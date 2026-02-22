<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import { useCustomToast } from '../plugins/toast';

// toast元件引入
const { successToast, errorToast } = useCustomToast();

const { t } = useI18n()
const router = useRouter()

const email = ref('')
const isLoading = ref(false)
const isSent = ref(false)
const formRef = ref(null)

// 取得後端發送驗證信API URL
const requestVerificationMailUrl = `${import.meta.env.VITE_GOOGLEAPI_URL}/api/account/requestVerificationMail`

// Email規則
const emailRules = [
    v => !!v || t('VALIDATION.REQUIRED'),
    v => /.+@.+\..+/.test(v) || t('VALIDATION.EMAIL_FORMAT'),
]

// 重寄驗證信
const handleResend = async () => {
    // 先驗證表單
    const { valid } = await formRef.value.validate();
    if (!valid) return

    if (isLoading.value) return
    isLoading.value = true

    try {
        // 驗證信帶的前端Url
        const callbackUrl = window.location.origin;
        await axios.post(requestVerificationMailUrl, { email: email.value, callbackUrl: callbackUrl, type: 'register' })

        // 發送成功
        isSent.value = true
    } catch (err) {
        var toastMsg = '';
        console.error(err);

        if (err.response) {
            var errorCode = err.response.data.errorCode;
            var errMsg = err.response.data.message;

            // 找不到使用者
            if (errorCode === "User_NotFound") {
                toastMsg = t('PAGE.RESEND.EMAIL_NOT_FOUND');
            }
            // 已經驗證過了
            else if (errorCode === "Auth_AlreadyVerified") {
                toastMsg = t('PAGE.RESEND.ALREADY_VERIFIED');
            }
            // 其他錯誤
            else {
                toastMsg = t("ERRORS.DEFAULT");
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

                <v-card class="pa-8 text-center" elevation="8" rounded="lg">
                    <!-- 發送成功 -->
                    <template v-if="isSent">
                        <v-avatar size="100" color="#E8F5E9" class="mb-6">
                            <v-icon size="60" color="#4CAF50">mdi-email-check</v-icon>
                        </v-avatar>
                        <h2 class="text-h5 font-weight-bold mb-3">
                            {{ t('PAGE.RESEND.SUCCESS_TITLE') }}
                        </h2>
                        <p class="text-body-1 text-grey-darken-1 mb-6">
                            {{ t('PAGE.RESEND.SUCCESS_MESSAGE') }}
                        </p>
                        <v-btn variant="outlined" size="large" block @click="goToLogin">
                            {{ t('PAGE.RESEND.BACK_LOGIN') }}
                        </v-btn>
                    </template>

                    <!-- 輸入 Email 表單 -->
                    <template v-else>
                        <v-avatar size="100" color="#E3F2FD" class="mb-6">
                            <v-icon size="60" color="#658DC6">mdi-email-sync</v-icon>
                        </v-avatar>
                        <h2 class="text-h5 font-weight-bold mb-3">
                            {{ t('PAGE.RESEND.TITLE') }}
                        </h2>
                        <p class="text-body-1 text-grey-darken-1 mb-6">
                            {{ t('PAGE.RESEND.DESCRIPTION') }}
                        </p>

                        <v-form ref="formRef" @submit.prevent="handleResend">
                            <v-text-field v-model="email" type="email" :rules="emailRules" label="Email"
                                :placeholder="t('PAGE.LOGIN.TYPEEMAIL')" variant="outlined" density="comfortable"
                                class="mb-4 text-left" prepend-inner-icon="mdi-email-outline" :disabled="isLoading"
                                required />

                            <v-btn type="submit" color="#F5B895" size="large" block class="mb-3" :loading="isLoading"
                                :disabled="isLoading">
                                {{ t('PAGE.RESEND.SUBMIT') }}
                            </v-btn>
                        </v-form>
                        <v-btn variant="outlined" size="large" block @click="goToLogin" :disabled="isLoading">
                            {{ t('PAGE.RESEND.BACK_LOGIN') }}
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