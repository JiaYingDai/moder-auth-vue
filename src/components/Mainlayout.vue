<script setup>
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'
import AvatarUploader from '../components/AvatarUploader.vue'
import { useI18n } from "vue-i18n";

// 用t簡化替代使用useI18n()
const { t } = useI18n();

const route = useRouter();
const userStore = useUserStore();
const userInfo = userStore.userInfo;

// 處理登出邏輯
const handleLogout = async () => {
    // 確定要登出嗎
    const logout = confirm(t("PAGE.HOME.LOGOUT_CONFIRM"));
    if (!logout) return;

    // 登出
    await userStore.logout();
};

// 處理進會員中心邏輯
const goToMember = () => {
    route.push('/member');
};

// 處理回首頁邏輯
const goToHome = () => {
    route.push('/');
};

</script>

<template>
    <v-app>
        <v-app-bar color="#658DC6" elevation="2" height="60">
            <!-- Logo 置中 -->
            <v-app-bar-title class="text-center">
                <a href="/" class="app-logo text-h6 font-weight-bold" style="color: white;">ModernAuth</a>
            </v-app-bar-title>

            <!-- 右側用戶區域 -->
            <template v-slot:append v-if="userStore.isLogin">
                <div class="d-flex align-center ga-2 mr-4">
                    <!-- 用戶資料連結 -->
                    <v-btn variant="text" class="text-none" @click="goToMember" :title='t("PAGE.MEMBER.TITLE")'>
                        <AvatarUploader size="xs" :current-image="userInfo.picture" readonly />
                        <span class="ml-2">{{ userInfo?.name }}</span>
                    </v-btn>

                    <!-- 首頁按鈕 -->
                    <v-btn icon variant="text" @click="goToHome" :title='t("PAGE.HOME.TITLE")'>
                        <v-icon>mdi-home</v-icon>
                    </v-btn>

                    <!-- 登出按鈕 -->
                    <v-btn icon variant="text" @click="handleLogout" :title='t("PAGE.HOME.LOGOUT")'>
                        <v-icon>mdi-logout</v-icon>
                    </v-btn>
                </div>
            </template>
        </v-app-bar>

        <v-main class="bg-grey-lighten-4">
            <v-container fluid class="pa-5">
                <router-view />
            </v-container>
        </v-main>
    </v-app>
</template>

<style scoped>
.app-logo {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>