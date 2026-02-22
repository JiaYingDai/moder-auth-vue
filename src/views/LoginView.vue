<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/user";
import GsiBtn from "../components/GsiBtn.vue";
import axios from "axios";
import { ref, reactive } from "vue";
import { useI18n } from "vue-i18n";
import AvatarUploader from '../components/AvatarUploader.vue'
import { useCustomToast } from '../plugins/toast';

// toast元件引入
const { successToast, errorToast } = useCustomToast();

// 用t簡化替代使用useI18n()
const { t } = useI18n();

const router = useRouter();
const userStore = useUserStore();

// 控制顯示 三種模式 ('login' | 'register' | 'success')
const loginMode = ref('login'); // 預設: login

// Loading 狀態
const isLoading = ref(false);

// 登入 / 註冊 切換方向
const slideDirection = ref('slide-left')

// 註冊表單ref
const registerFormRef = ref(null)

// 登入表單ref
const loginFormRef = ref(null)

// 切換模式的函式
const toggleMode = () => {
    // 如果目前是login，要去register (往左滑)
    if (loginMode.value === 'login') {
        slideDirection.value = 'slide-left';
        loginMode.value = 'register';
    } else {
        // 如果目前是register或success，要回login (往右滑)
        slideDirection.value = 'slide-right';
        loginMode.value = 'login';
    }
};

// 從成功頁面返回登入頁面的函式
const goToLogin = () => {
    slideDirection.value = 'slide-right';
    loginMode.value = 'login';
}

// 註冊表單資料
const registerForm = reactive({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    picture: null
})

// 登入表單資料
const loginForm = reactive({
    email: '',
    password: ''
})
// 大頭貼預覽網址
const picturePreview = ref(null)

// 取得clientId
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
// 取得後端驗證google API URL
const validateGoogleUrl = `${import.meta.env.VITE_GOOGLEAPI_URL}/api/account/validateGoogle`
// const validateGoogleUrl = '/api/account/validateGoogle'

// 取得後端註冊API URL
const registerUrl = `${import.meta.env.VITE_GOOGLEAPI_URL}/api/account/register`

// 取得後端登入API URL
const loginUrl = `${import.meta.env.VITE_GOOGLEAPI_URL}/api/account/login`

const showPassword = ref(false)
const showRegisterPassword = ref(false)
const showConfirmPassword = ref(false)

// Email規則
const emailRules = [
    // 1. 必填檢查
    v => !!v || t('VALIDATION.REQUIRED'),
    // 2. 格式檢查 (Regex)
    // 檢查字串中是否有 @，且 @ 後面有點 (.)
    v => /.+@.+\..+/.test(v) || t('VALIDATION.EMAIL_FORMAT'),
]

// 登入密碼規則
const loginPwdRules = [
    // 1. 必填檢查
    v => !!v || t('VALIDATION.REQUIRED'),
]

// 註冊密碼規則
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

// 確認密碼
const confirmPwdRules = [
    // 1. 必填
    v => !!v || t('VALIDATION.REQUIRED'),
    // 2. 比對邏輯：輸入的值必須等於 registerForm.password
    v => v === registerForm.password || t('VALIDATION.PWD_NOT_MATCH')
]

// 姓名規則
const nameRules = [
    // 1. 必填檢查
    v => !!v || t('VALIDATION.REQUIRED'),
]

// 處理檔案選擇與預覽
const handleFileChange = (file) => {
    if (file) {
        registerForm.picture = file
        // 建立預覽連結
        picturePreview.value = URL.createObjectURL(file)
    }
}

const handleFileRemove = () => {
    registerForm.picture = null
}

// 處理登入Google的邏輯
const handleGoogleLogin = async (userData) => {
    if (isLoading.value) return
    isLoading.value = true
    try {
        // 將Google給的token打後端換Cookie
        const res = await axios.post(
            validateGoogleUrl, {
            credential: userData.credential
        }, {
            withCredentials: true
        });

        // 取得後端傳來token
        const token = res.data;

        // 拿到token，先存localstorage
        localStorage.setItem('jwt_token', token);

        // 呼叫store更新現在狀態
        await userStore.checkLogin('Google');

        // 登入成功提醒
        successToast(t("PAGE.LOGIN.LOGIN_SUCCESS"));
        // 跳轉回首頁
        router.push('/');
    } catch (err) {
        console.error(err);
        var toastMsg = '';
        toastMsg = t('ERRORS.LOGIN_FAILED');

        // 失敗提醒
        errorToast(toastMsg);
    } finally {
        isLoading.value = false
    }
};

// 處理註冊的邏輯
const handleRegister = async () => {
    // 先驗證表單
    const { valid } = await registerFormRef.value.validate();
    if (!valid) return

    if (isLoading.value) return
    isLoading.value = true
    try {
        // 建立post的formData
        const formData = new FormData();
        formData.append('name', registerForm.name);
        formData.append('email', registerForm.email);
        formData.append('password', registerForm.password);
        formData.append('callbackUrl', window.location.origin);
        formData.append('type', 'register');

        if (registerForm.picture)
            formData.append('picture', registerForm.picture);
        // post到API
        await axios.post(registerUrl, formData);

        // 註冊成功提醒
        successToast(t("PAGE.REGISTER.REGISTER_SUCCESS"));

        // 註冊成功，切換到註冊成功頁面
        slideDirection.value = 'slide-left'; // 左滑
        loginMode.value = 'success';
    }
    catch (err) {
        console.error(err);

        // 註冊失敗
        var toastMsg = '';
        if (err.response) {
            // 重複的Email和登入方式
            if (err.response.status === 409) {
                toastMsg = t("ERRORS.AUTH_005");
            }
            // 發信失敗
            else if (err.response.errorCode === "System_EmailSendFailed") {
                toastMsg = t("ERRORS.REGISTER_FAILED");
            }
            // 其他錯誤
            else {
                toastMsg = t("ERRORS.REGISTER_FAILED");
            }
        } else {
            toastMsg = t("ERRORS.REGISTER_FAILED");
        }
        // 失敗提醒
        errorToast(toastMsg);
    } finally {
        isLoading.value = false
    }
    // // 清空表單
    // registerForm.name = '';
    // registerForm.email = '';
    // registerForm.password = '';
    // registerForm.confirmPassword = '';
    // registerForm.picture = null;
    // picturePreview.value = null;
}

// 處理登入的邏輯
const handleLogin = async () => {
    // 先驗證表單
    const { valid } = await loginFormRef.value.validate();
    if (!valid) return

    if (isLoading.value) return
    isLoading.value = true
    try {
        // 建立post的formData
        var formData = new FormData();
        formData.append('email', loginForm.email);
        formData.append('password', loginForm.password);

        // post到API
        const res = await axios.post(loginUrl, formData, {
            withCredentials: true
        });

        // 取得後端傳來token
        const token = res.data;
        // 拿到token，先存localstorage
        localStorage.setItem("jwt_token", token);

        // 呼叫store更新現在狀態
        await userStore.checkLogin('Local');

        // 登入成功提醒
        successToast(t("PAGE.LOGIN.LOGIN_SUCCESS"));
        // 導轉到首頁
        router.push('/');
    } catch (err) {
        console.error(err);
        var toastMsg = '';

        // 登入失敗
        if (err.response) {
            var errorCode = err.response.data.errorCode;

            // 帳號或密碼錯誤
            if (errorCode === "Auth_LoginFailed") {
                toastMsg = t("ERRORS.AUTH_001");
            }
            // 帳號被停權
            else if (errorCode === "User_AccountDisabled") {
                toastMsg = t("ERRORS.AUTH_002");
            }
            // 帳號存在但未驗證Email
            else if (errorCode === "User_EmailNotVerified") {
                toastMsg = t("ERRORS.AUTH_003");
            }
            // 其他錯誤
            else {
                toastMsg = t("ERRORS.DEFAULT");
            }
        } else {
            toastMsg = t("ERRORS.DEFAULT");
        }
        // 失敗提醒
        errorToast(toastMsg);

        // 清空表單
        loginForm.email = '';
        loginForm.password = '';
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <v-container fluid class="loginpage-container fill-height">
        <!-- Loading 覆蓋層 -->
        <!-- <v-overlay v-model="isLoading" class="align-center justify-center" persistent>
            <v-progress-circular indeterminate size="64" color="#F5B895" />
        </v-overlay> -->
        <v-row justify="center" align="center" class="fill-height">
            <v-col cols="12" sm="8" md="6" lg="4" xl="3">
                <h1 class="text-center text-h3 font-weight-bold mb-6" style="color: #F2D6AE;">
                    ModernAuth
                </h1>
                <v-card class="pa-6 pa-sm-8" elevation="8" rounded="lg">
                    <transition :name="slideDirection" mode="out-in">
                        <!-- 登入表單 -->
                        <v-card-text v-if="loginMode === 'login'" key="login">
                            <v-form ref="loginFormRef" @submit.prevent="handleLogin">
                                <v-text-field v-model="loginForm.email" type="email" :rules="emailRules" label="Email"
                                    :placeholder='t("PAGE.LOGIN.TYPEEMAIL")' variant="outlined" density="comfortable"
                                    class="mb-5" prepend-inner-icon="mdi-email-outline" :disabled="isLoading" required />

                                <v-text-field v-model="loginForm.password" :type="showPassword ? 'text' : 'password'"
                                    :rules="loginPwdRules" :label="t('FIELD.PASSWORD')"
                                    :placeholder="t('PAGE.LOGIN.TYPEPWD')" variant="outlined" density="comfortable"
                                    class="mb-5" prepend-inner-icon="mdi-lock-outline"
                                    :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                                    @click:append-inner="showPassword = !showPassword" :disabled="isLoading" required />

                                <v-btn type="submit" color="#F5B895" size="large" block class="mb-4" :loading="isLoading"
                                    :disabled="isLoading">
                                    {{ t('ACTION.SUBMIT') }}
                                </v-btn>
                            </v-form>
                            <v-divider class="my-4">
                                <span class="text-grey px-2">{{ t('PAGE.LOGIN.OR') }}</span>
                            </v-divider>

                            <div class="d-flex justify-center mb-4" style="min-height: 44px;">

                                <GsiBtn :client-id="clientId" @login_success="handleGoogleLogin" :loading="isLoading" />
                            </div>

                            <p class="text-center text-body-2 mb-0">
                                {{ t('PAGE.LOGIN.NO_ACCOUNT_HINT') }}
                                <a href="#" class="font-weight-bold" @click.prevent="toggleMode" style="color: #B5C7D3;">
                                    {{ t('PAGE.LOGIN.SIGNUP_LINK') }}
                                </a>
                            </p>
                            <p class="text-center text-body-2 mt-8 mb-0">
                                <router-link to="/forgot-pwd" class="link-text">
                                    {{ t('PAGE.LOGIN.FORGOT_PASSWORD') }}
                                </router-link>
                                <span class="mx-2 text-grey">|</span>
                                <router-link to="/resend-email" class="link-text">
                                    {{ t('PAGE.LOGIN.RESEND_VERIFICATION') }}
                                </router-link>
                            </p>
                        </v-card-text>

                        <!-- 註冊表單 -->
                        <v-card-text v-else-if="loginMode === 'register'" key="register">
                            <v-form ref="registerFormRef" @submit.prevent="handleRegister">
                                <div class="d-flex justify-center mb-6">
                                    <AvatarUploader size="md" @change="handleFileChange" @remove="handleFileRemove"
                                        :readonly="isLoading" />
                                </div>

                                <v-text-field v-model="registerForm.name" :rules="nameRules" :label="t('FIELD.NAME')"
                                    :placeholder="t('PAGE.REGISTER.TYPENAME')" variant="outlined" density="comfortable"
                                    class="mb-3" prepend-inner-icon="mdi-account-outline" :disabled="isLoading" required />

                                <v-text-field v-model="registerForm.email" type="email" :rules="emailRules" label="Email"
                                    :placeholder='t("PAGE.LOGIN.TYPEEMAIL")' variant="outlined" density="comfortable"
                                    class="mb-3" prepend-inner-icon="mdi-email-outline" :disabled="isLoading" required />

                                <v-text-field v-model="registerForm.password"
                                    :type="showRegisterPassword ? 'text' : 'password'" :rules="pwdRules"
                                    :label="t('FIELD.PASSWORD')" :placeholder="t('PAGE.REGISTER.SET_PASSWORD')"
                                    variant="outlined" density="comfortable" class="mb-3"
                                    prepend-inner-icon="mdi-lock-outline"
                                    :append-inner-icon="showRegisterPassword ? 'mdi-eye-off' : 'mdi-eye'"
                                    @click:append-inner="showRegisterPassword = !showRegisterPassword" :disabled="isLoading"
                                    required />
                                <v-text-field v-model="registerForm.confirmPassword"
                                    :type="showConfirmPassword ? 'text' : 'password'" :rules="confirmPwdRules"
                                    :label="t('PAGE.REGISTER.CONFIRM_PASSWORD')"
                                    :placeholder="t('PAGE.REGISTER.RESET_PASSWORD')" variant="outlined"
                                    density="comfortable" class="mb-4" prepend-inner-icon="mdi-lock-outline"
                                    :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                                    @click:append-inner="showConfirmPassword = !showConfirmPassword" :disabled="isLoading"
                                    required />

                                <v-btn type="submit" color="#F5B895" size="large" block class="mb-4" :loading="isLoading"
                                    :disabled="isLoading">
                                    {{ t('PAGE.REGISTER.SUBMIT_BTN') }}
                                </v-btn>
                            </v-form>
                            <p class="text-center text-body-2 mb-0">
                                {{ t('PAGE.REGISTER.HAS_ACCOUNT_HINT') }}
                                <a href="#" class="font-weight-bold" @click.prevent="toggleMode" style="color: #B5C7D3;">
                                    {{ t('PAGE.REGISTER.LOGIN_LINK') }}
                                </a>
                            </p>
                        </v-card-text>
                        <v-card-text v-else-if="loginMode === 'success'" key="success" class="text-center py-10">
                            <v-avatar size="100" color="#E8F5E9" class="mb-6">
                                <v-icon size="60" color="#4CAF50">mdi-email-check</v-icon>
                            </v-avatar>

                            <h2 class="text-h5 font-weight-bold mb-3">
                                {{ t('PAGE.RESEND.SUCCESS_TITLE', '註冊成功！') }}
                            </h2>

                            <p class="text-body-1 text-grey-darken-1 mb-8">
                                {{ t('PAGE.RESEND.SUCCESS_MESSAGE', '請檢查您的信箱並點擊驗證連結完成帳號驗證。') }}
                            </p>

                            <v-btn variant="outlined" color="#F5B895" size="large" block @click="goToLogin">
                                {{ t('PAGE.RESEND.BACK_LOGIN', '返回登入') }}
                            </v-btn>
                        </v-card-text>
                    </transition>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
<style scoped>
.loginpage-container {
    min-height: 100vh;
    background: #658DC6;
}

/* 往左滑（切換到註冊） */
.slide-left-enter-active,
.slide-left-leave-active {
    transition: all 0.1s ease;
}

.slide-left-enter-from {
    opacity: 0;
    transform: translateX(30px);
}

.slide-left-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}

/* 往右滑（返回登入） */
.slide-right-enter-active,
.slide-right-leave-active {
    transition: all 0.1s ease;
}

.slide-right-enter-from {
    opacity: 0;
    transform: translateX(-30px);
}

.slide-right-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

.link-text {
    color: #84898C;
    text-decoration: none;
}

.link-text:hover {
    text-decoration: underline;
}
</style>