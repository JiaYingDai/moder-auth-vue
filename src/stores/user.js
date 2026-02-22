import { defineStore } from "pinia";
import { ref } from "vue";
import api from "../api/axios";
import router from "../router/index";

// 取得後端驗證cookie API URL
const getUserInfoUrl = `/api/account/getUserInfo`

export const useUserStore = defineStore(
    "user", () => {
        // 1. 狀態: 存取驗證結果的資料
        const isLogin = ref(false);
        const userInfo = ref(null);
        const provider = ref('');

        // 2. 呼叫後端驗證API
        async function checkLogin(providerFrom) {
            // 賦值
            provider.value = providerFrom;
            // token不存在
            if (!localStorage.getItem("jwt_token")) {
                console.log("token不存在")
                logout();
                return false;
            }

            try {
                const res = await api.post(getUserInfoUrl, { provider: provider.value });

                // 成功驗證
                if (res.status === 200) {
                    isLogin.value = true;
                    userInfo.value = res.data;
                    return true;
                }

                return false;

            } catch (error) {   // token失效
                console.error(error);
                logout();
                return false;
            }
        }

        // 登出
        async function logout() {
            try {
                // 登出先打向後端，刪除refresh_token(cookie + DB)
                await api.post('/api/account/logout');
            } catch (err) {
                console.warn("後端登出異常，但前端將強制登出");
            }
            finally {
                isLogin.value = false;
                userInfo.value = null;
                localStorage.removeItem("jwt_token");
                // 強制回登入頁
                router.push('/login');
            }
        }

        return { isLogin, userInfo, checkLogin, logout, provider };
    }
);
