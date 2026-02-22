<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps({
    clientId: {
        type: String,
        required: true
    },
    // 讓外部可控制按鈕寬度 (預設250px)
    width: {
        type: String,
        default: '250px'
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['login_success', 'login_fail']);
const buttonContainer = ref(null);

const decodeJWT = (token) => {
    try {
        let base64Url = token.split(".")[1];
        let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        let jsonPayload = decodeURIComponent(
            atob(base64).split("").map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("JWT Decode Error", e);
        return null;
    }
};

const handleCredentialResponse = (response) => {
    const userData = decodeJWT(response.credential);
    if (userData) {
        emit('login_success', { ...userData, credential: response.credential });
    } else {
        emit('login_fail');
    }
};

onMounted(() => {
    const checkGoogleInterval = setInterval(() => {
        if (window.google && window.google.accounts) {
            clearInterval(checkGoogleInterval);
            try {
                window.google.accounts.id.initialize({
                    client_id: props.clientId,
                    callback: handleCredentialResponse,
                    auto_select: false,
                    cancel_on_tap_outside: true,
                    // 關鍵：允許按鈕在任何地方被點擊
                    ux_mode: 'popup',
                });

                // 渲染 Google 按鈕
                window.google.accounts.id.renderButton(
                    buttonContainer.value,
                    {
                        theme: "filled_blue", // 樣式隨意，會被透明化
                        size: "large",        // 設大一點以覆蓋底層
                        width: parseInt(props.width),
                        type: "standard",
                        shape: "rectangular",
                        text: "signin_with",
                        logo_alignment: "left"
                    }
                );
            } catch (error) {
                console.error("Google Sign-In Error:", error);
            }
        }
    }, 100);
});
</script>

<template>
    <div class="gsi-btn-wrapper" :style="{ width: width }">

        <v-btn block variant="outlined" color="grey-darken-1" class="custom-btn text-none" prepend-icon="mdi-google"
            :loading="loading">
            使用 Google 帳號登入
        </v-btn>

        <div ref="buttonContainer" class="google-hidden-btn" v-show="!loading"></div>
    </div>
</template>

<style scoped>
.gsi-btn-wrapper {
    position: relative;
    /* 關鍵 */
    height: 44px;
    /* 設定高度跟 v-btn 一樣高 */
    display: inline-block;
}

.custom-btn {
    width: 100%;
    height: 100% !important;
    pointer-events: none;
    /* 讓點擊穿透視覺層 (保險起見) */
    background-color: white !important;
    /* 確保底色 */
    border-color: #dadce0;
}

.google-hidden-btn {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.01;
    /* 關鍵：幾乎透明，但仍然存在可被點擊 */
    z-index: 10;
    /* 確保在最上層 */
    overflow: hidden;
}

/* 強制調整 Google iframe 的大小以填滿容器 */
:deep(iframe) {
    width: 100% !important;
    height: 100% !important;
    margin: 0 !important;
}
</style>