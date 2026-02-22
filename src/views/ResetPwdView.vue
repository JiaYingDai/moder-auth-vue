<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import { useCustomToast } from '../plugins/toast';

// toast元件引入
const { successToast, errorToast } = useCustomToast();

// 載入元件
const { t } = useI18n()
const route = useRoute();
const router = useRouter()

// 控制是否顯示重設密碼表單
const isTokenVerified = ref(false)

const isLoading = ref(false)
const formRef = ref(null)

// 重設密碼表單資料
const resetPwdForm = reactive({
    password: '',
    confirmPassword: ''
})

// 密碼顯示開關
const showRsetPwdPassword = ref(false)
const showConfirmPassword = ref(false)

// 取得後端驗證token API URL
const checkTokenUrl = `${import.meta.env.VITE_GOOGLEAPI_URL}/api/account/checkToken`

// 取得後端發送驗證信API URL
const resetPwdUrl = `${import.meta.env.VITE_GOOGLEAPI_URL}/api/account/resetPwd`

// 重設密碼規則
const pwdRules = [
    // 1. 必填檢查
    v => !!v || t('VALIDATION.REQUIRED'),

    // 2. 長度檢查 (8-20碼)
    v => (v && v.length >= 8 && v.length <= 20) || t('VALIDATION.PWD_COMPLEXITY'),

    // 3. 大寫英文檢查 (A-Z)
    v => /(?=.*[A-Z])/.test(v) || t('VALIDATION.PWD_COMPLEXITY'),

    // 4. 小寫英文檢查 (a-z)
    v => /(?=.*[a-z])/.test(v) || t('VALIDATION.PWD_COMPLEXITY'),

    // 5. 數字檢查 (0-9)
    v => /(?=.*\d)/.test(v) || t('VALIDATION.PWD_COMPLEXITY'),

    // 6. 特殊符號檢查
    // 這裡列出了常見符號，你可以依需求增減
    v => /(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(v) || t('VALIDATION.PWD_COMPLEXITY'),
]

// 確認密碼規則
const confirmPwdRules = [
    // 1. 必填
    v => !!v || t('VALIDATION.REQUIRED'),
    // 2. 比對邏輯：輸入的值必須等於 resetPwdForm.password
    v => v === resetPwdForm.password || t('VALIDATION.PWD_NOT_MATCH')
]

onMounted(async () => {
    // 取得 token
    const token = route.query.token;
    if (!token) {
        // 失敗提醒
        errorToast(t("PAGE.RESETPWD.FAILED_LINK"));
        router.push('/login')
        return;
    }
    try {
        // 將取得的token post後端驗證
        await axios.post(checkTokenUrl, { token: token, type: 'forgotPwd' })

        // 驗證成功，允許顯示表單
        isTokenVerified.value = true
    } catch (err) {
        var toastMsg = '';
        console.error(err);
        if (err.response) {
            var errorCode = err.response.data.errorCode;
            // 連結過期
            if (errorCode === 'Auth_TokenExpired') {
                toastMsg = t("PAGE.RESETPWD.LINK_EXPIRED");
            }
            else {
                toastMsg = t("PAGE.RESETPWD.FAILED_LINK");
            }
        }
        // 其他錯誤
        toastMsg = t("PAGE.RESETPWD.FAILED_LINK");
        errorToast(toastMsg);
        router.push('/login')
    } finally {
        isLoading.value = false;
    }
})

// 送出表單
const handleSubmit = async () => {
    // 先驗證表單
    const { valid } = await formRef.value.validate();
    if (!valid) return

    // 取得 token
    const token = route.query.token;
    if (!token) {
        isLoading.value = false;
        return;
    }

    if (isLoading.value) return
    isLoading.value = true

    // 送到後端
    try {
        var formData = new FormData();
        formData.append('token', token);
        formData.append('password', resetPwdForm.password);

        await axios.post(resetPwdUrl, formData)

        // 成功提醒
        successToast(t("PAGE.RESETPWD.SUCCESS_MESSAGE"));
        router.push('/login')
    } catch (err) {
        console.error(err);

        if (err.response) {
            var errorCode = err.response.data.errorCode;
            var toastMsg = '';

            // 找不到使用者
            if (errorCode === "User_NotFound") {
                toastMsg = t('PAGE.RESETPWD.USER_NOT_FOUND');
            }
            // Token被使用過
            else if (errorCode === "Auth_TokenAlreadyUsed") {
                toastMsg = t('PAGE.RESETPWD.TOKEN_ALREADY_USED');
            }
            // 新密碼不能與舊密碼相同
            else if (errorCode === "Auth_PasswordReuse") {
                toastMsg = t('PAGE.RESETPWD.PASSWORD_REUSED');
            }
            // 其他錯誤
            else {
                toastMsg = t("ERRORS.RESETPWD_FAILED");
            }
        }
        else {
            toastMsg = t("ERRORS.DEFAULT");
        }
        errorToast(toastMsg);
    } finally {
        isLoading.value = false
    }
}

const goToLogin = () => {
    router.push('/login')
}
</script>

<template>
    <v-container fluid class="resend-container fill-height">
        <v-row justify="center" align="center" class="fill-height">
            <v-col cols="12" sm="8" md="6" lg="4" xl="3">
                <h1 class="text-center text-h3 font-weight-bold mb-6 app-title">
                    ModernAuth
                </h1>

                <v-card class="pa-6 pa-sm-8 text-center" elevation="8" rounded="lg">
                    <!-- 載入中狀態 -->
                    <template v-if="!isTokenVerified">
                        <v-progress-circular indeterminate size="80" width="6" color="#F5B895" class="mb-6" />
                        <p class="text-h6 text-grey-darken-1">
                            {{ t('PAGE.VERIFY.LOADING') }}
                        </p>
                    </template>
                    <template v-else>
                        <h2 class="text-h5 text-center font-weight-bold mb-3">
                            {{ t('PAGE.RESETPWD.TITLE') }}
                        </h2>
                        <v-form ref="formRef" @submit.prevent="handleSubmit">
                            <v-text-field v-model="resetPwdForm.password" :type="showRsetPwdPassword ? 'text' : 'password'"
                                :rules="pwdRules" :label="t('FIELD.PASSWORD')"
                                :placeholder="t('PAGE.REGISTER.SET_PASSWORD')" variant="outlined" density="comfortable"
                                class="mb-3 text-left" prepend-inner-icon="mdi-lock-outline"
                                :append-inner-icon="showRsetPwdPassword ? 'mdi-eye-off' : 'mdi-eye'"
                                @click:append-inner="showRsetPwdPassword = !showRsetPwdPassword" :disabled="isLoading"
                                required />
                            <v-text-field v-model="resetPwdForm.confirmPassword"
                                :type="showConfirmPassword ? 'text' : 'password'" :rules="confirmPwdRules"
                                :label="t('PAGE.REGISTER.CONFIRM_PASSWORD')"
                                :placeholder="t('PAGE.REGISTER.RESET_PASSWORD')" variant="outlined" density="comfortable"
                                class="mb-4 text-left" prepend-inner-icon="mdi-lock-outline"
                                :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                                @click:append-inner="showConfirmPassword = !showConfirmPassword" :disabled="isLoading"
                                required />


                            <v-btn type="submit" color="#F5B895" size="large" block class="mb-3" :loading="isLoading"
                                :disabled="isLoading">
                                {{ t('ACTION.SUBMIT') }}
                            </v-btn>
                        </v-form>
                        <v-btn variant="outlined" size="large" block @click="goToLogin" :disabled="isLoading">
                            {{ t('PAGE.FORGOT.BACK_LOGIN') }}
                        </v-btn>
                    </template>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
.resend-container {
    min-height: 100vh;
    background: #658DC6;
}

.app-title {
    color: #F2D6AE;
}
</style>