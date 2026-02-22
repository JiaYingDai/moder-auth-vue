<script setup>
import { useUserStore } from "../stores/user"
import EditIcon from "../assets/edit.svg?component"
import { ref, nextTick, reactive } from "vue"
import AvatarUploader from '../components/AvatarUploader.vue'
import api from "../api/axios";
import { useI18n } from "vue-i18n";
import { useCustomToast } from '../plugins/toast';

// toast元件引入
const { successToast, errorToast } = useCustomToast();

// 用t簡化替代使用useI18n()
const { t } = useI18n();

const userStore = useUserStore();
const userInfo = userStore.userInfo;

// 取得後端更新API URL
const updateUserUrl = '/api/account/updateUser';

// 取得後端移除大頭貼 API URL
const removeAvatarUrl = '/api/account/removeAvatar';

// 姓名規則
const nameRules = [
    // 1. 必填檢查
    v => !!v || t('VALIDATION.REQUIRED'),
]

// 編輯模式
const isEditName = ref(false);

// 編輯的欄位
const updateInfoForm = reactive(
    {
        id: userInfo.id,
        name: '',
        picture: userInfo.picture
    }
);

const nameInputRef = ref(null); // 綁定DOM元素以控制 focus

// 儲存中，防止重複送出
const isSaving = ref(false);

// 點擊edit icon觸發編輯模式
const startEdit = async () => {
    updateInfoForm.name = userInfo.name; // input放入原先的name
    isEditName.value = true;    // 編輯模式: true
}

const handleFinishEdit = async () => {
    // 如果是空的，則直接取消編輯，還原成舊名字
    if (!updateInfoForm.name) {
        isEditName.value = false;
        return;
    }

    // 如果名字沒變則不update
    if (updateInfoForm.name === userInfo.name) {
        isEditName.value = false;
        return;
    }

    // 去除空白
    updateInfoForm.name = updateInfoForm.name.trim();

    isSaving.value = true;
    try {
        var formData = new FormData();
        formData.append('id', updateInfoForm.id);
        formData.append('name', updateInfoForm.name);

        // post到後端update
        await api.post(updateUserUrl, formData);

        // 更新store
        userInfo.name = updateInfoForm.name;

        // 編輯模式切換為false
        isEditName.value = false;

        // 成功提醒
        successToast(t("RESULT.EDIT_SUCCESS"));
    }
    catch (err) {
        console.error(err);
        // 失敗提醒
        errorToast(t("ERRORS.EDIT_FAILED"));

        isEditName.value = false;
    }
    finally {
        isSaving.value = false;
    }
}

const handleImageChange = async (file) => {
    try {
        if (file) {
            updateInfoForm.picture = file;

            var formData = new FormData();
            formData.append('id', updateInfoForm.id);
            formData.append('picture', updateInfoForm.picture);

            // post到後端update
            const res = await api.post(updateUserUrl, formData);

            // 更新store
            if (res.data.picture) {
                userInfo.picture = res.data.picture;
            }

            // 成功提醒
            successToast(t("RESULT.EDIT_SUCCESS"));
        }
    }
    catch (err) {
        console.error(err);
        // 失敗提醒
        errorToast(t("ERRORS.EDIT_FAILED"));
    }
}

const handleFileRemove = async () => {
    try {
        updateInfoForm.picture = null
        // post到後端remove
        await api.post(removeAvatarUrl, { id: userInfo.id });
        // 更新store
        userInfo.picture = null;
        // 成功提醒
        successToast(t("RESULT.EDIT_SUCCESS"));
    } catch (err) {
        console.error(err);
        // 失敗提醒
        errorToast(t("ERRORS.EDIT_FAILED"));
    }
}
</script>    

<template>
    <v-container class="member-container">
        <h1 class="text-h4 font-weight-bold mb-6">{{ t("PAGE.MEMBER.TITLE") }}</h1>

        <v-card v-if="userInfo" class="pa-6" elevation="2" rounded="lg">
            <div class="d-flex flex-column flex-sm-row align-center ga-6">
                <AvatarUploader size="lg" :current-image="userInfo.picture" @change="handleImageChange"
                    @remove="handleFileRemove" />

                <v-table density="comfortable" class="info-table flex-grow-1">
                    <tbody>
                        <!-- 姓名欄位 -->
                        <tr>
                            <td class="font-weight-bold text-right" style="width: 100px;">
                                {{ t("FIELD.NAME") }}：
                            </td>
                            <td>
                                <v-text-field v-if="isEditName" :rules="nameRules" v-model="updateInfoForm.name"
                                    :disabled="isSaving" ref="nameInputRef" density="compact" variant="underlined"
                                    hide-details autofocus @blur="handleFinishEdit" @keyup.enter="handleFinishEdit"
                                    required />
                                <span v-else class="text-body-1">{{ userInfo.name }}</span>
                            </td>
                            <td style="width: 48px;">
                                <v-btn v-if="!isEditName" icon variant="text" size="small" @click="startEdit" title="編輯">
                                    <v-icon color="grey" size="20">mdi-pencil</v-icon>
                                </v-btn>
                            </td>
                        </tr>

                        <!-- Email 欄位 -->
                        <tr>
                            <td class="font-weight-bold text-right">Email：</td>
                            <td class="text-body-1">{{ userInfo.email }}</td>
                            <td></td>
                        </tr>
                    </tbody>
                </v-table>
            </div>
        </v-card>
    </v-container>
</template>

<style scoped>
.member-container {
    max-width: 600px;
}

.info-table {
    background: transparent !important;
}

.info-table td {
    border-bottom: none !important;
    padding: 8px 12px !important;
}

.v-btn:hover .v-icon {
    color: #F5B895 !important;
}
</style>