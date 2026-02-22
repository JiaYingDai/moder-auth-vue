<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useI18n } from "vue-i18n";

// 用t簡化替代使用useI18n()
const { t } = useI18n();

const route = useRoute();
const router = useRouter();

// 取得後端驗證token API URL
const registerVerifyUrl = `${import.meta.env.VITE_GOOGLEAPI_URL}/api/account/registerVerify`
const isLoading = ref(true);
const isResending = ref(false)
const validResult = ref('');

onMounted(async () => {
    // 取得 token
    const token = route.query.token;
    if (!token) {
        validResult.value = 'failed';
        isLoading.value = false;
        return;
    }
    try {
        // 將取得的token post後端驗證
        await axios.post(registerVerifyUrl, { token: token, type: 'register' })

        // 驗證成功
        validResult.value = 'success';
    } catch (err) {
        console.error(err);
        if (err.response) {
            var errorCode = err.response.data.errorCode;
            // 連結過期
            if (errorCode === 'Auth_TokenExpired') {
                validResult.value = 'expired';
            } else {
                // 其他錯誤
                validResult.value = 'failed';
            }
        } else {
            // 其他錯誤
            validResult.value = 'failed';
        }
    } finally {
        isLoading.value = false;
    }
});

const goToLogin = () => {
    router.push('/login')
}

const resendVerification = async () => {
    router.push('/resend-email')
}

</script>

<template>
    <v-container fluid class="verify-container fill-height">
        <v-row justify="center" align="center" class="fill-height">
            <v-col cols="12" sm="8" md="6" lg="4" xl="3">
                <h1 class="text-center text-h3 font-weight-bold mb-6 app-title">
                    ModernAuth
                </h1>

                <v-card class="pa-8 text-center" elevation="8" rounded="lg">
                    <!-- 載入中狀態 -->
                    <template v-if="isLoading">
                        <v-progress-circular indeterminate size="80" width="6" color="#F5B895" class="mb-6" />
                        <p class="text-h6 text-grey-darken-1">
                            {{ t('PAGE.VERIFY.LOADING') }}
                        </p>
                    </template>

                    <!-- 驗證成功 -->
                    <template v-else-if="validResult === 'success'">
                        <v-avatar size="100" color="#E8F5E9" class="mb-6">
                            <v-icon size="60" color="#4CAF50">mdi-check-circle</v-icon>
                        </v-avatar>
                        <h2 class="text-h5 font-weight-bold mb-3">
                            {{ t('PAGE.VERIFY.SUCCESS_TITLE') }}
                        </h2>
                        <p class="text-body-1 text-grey-darken-1 mb-6">
                            {{ t('PAGE.VERIFY.SUCCESS_MESSAGE') }}
                        </p>
                        <v-btn color="#F5B895" size="large" block @click="goToLogin">
                            {{ t('PAGE.VERIFY.GO_LOGIN') }}
                        </v-btn>
                    </template>

                    <!-- 驗證失敗 -->
                    <template v-else-if="validResult === 'failed'">
                        <v-avatar size="100" color="#FFEBEE" class="mb-6">
                            <v-icon size="60" color="#F44336">mdi-close-circle</v-icon>
                        </v-avatar>
                        <h2 class="text-h5 font-weight-bold mb-3">
                            {{ t('PAGE.VERIFY.FAILED_TITLE') }}
                        </h2>
                        <p class="text-body-1 text-grey-darken-1 mb-6">
                            {{ t('PAGE.VERIFY.FAILED_MESSAGE') }}
                        </p>
                        <v-btn color="#F5B895" size="large" block class="mb-3" @click="resendVerification"
                            :loading="isResending">
                            {{ t('PAGE.VERIFY.RESEND') }}
                        </v-btn>
                        <v-btn variant="outlined" size="large" block @click="goToLogin">
                            {{ t('PAGE.VERIFY.BACK_LOGIN') }}
                        </v-btn>
                    </template>

                    <!-- 連結過期 -->
                    <template v-else-if="validResult === 'expired'">
                        <v-avatar size="100" color="#FFF3E0" class="mb-6">
                            <v-icon size="60" color="#FF9800">mdi-clock-alert</v-icon>
                        </v-avatar>
                        <h2 class="text-h5 font-weight-bold mb-3">
                            {{ t('PAGE.VERIFY.EXPIRED_TITLE') }}
                        </h2>
                        <p class="text-body-1 text-grey-darken-1 mb-6">
                            {{ t('PAGE.VERIFY.EXPIRED_MESSAGE') }}
                        </p>
                        <v-btn color="#F5B895" size="large" block class="mb-3" @click="resendVerification"
                            :loading="isResending">
                            {{ t('PAGE.VERIFY.RESEND') }}
                        </v-btn>
                        <v-btn variant="outlined" size="large" block @click="goToLogin">
                            {{ t('PAGE.VERIFY.BACK_LOGIN') }}
                        </v-btn>
                    </template>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
.verify-container {
    min-height: 100vh;
    background: #658DC6;
}

.app-title {
    color: #F2D6AE;
}
</style>