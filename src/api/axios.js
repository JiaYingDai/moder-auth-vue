import axios from "axios";
import { useRouter } from "vue-router";
import { useCustomToast } from '../plugins/toast';

// toast元件引入
const { warningToast } = useCustomToast();

const router = useRouter();
const api = axios.create({
    baseURL: import.meta.env.VITE_GOOGLEAPI_URL,
    timeout: Number(import.meta.env.VITE_AXIOS_TIMEOUT) || 5000, // 預設值: 5秒
    withCredentials: true,
});

// 每次發動請求前會自動執行
api.interceptors.request.use(config => {
    // 從localstorage拿出token
    const token = localStorage.getItem("jwt_token");

    // 有token，就加入Header
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
},
    error => {
        return Promise.reject(error);
    }
)


// 後端回傳錯誤時自動執行 (處理token過期)
api.interceptors.response.use(response => response,
    async (error) => {
        const originalRequest = error.config;

        // 後端回傳401，表示token失效 且 這個請求還沒被重試過 (避免死迴圈)
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // 標記為已重試

            try {
                // refresh token帶去後端詢問是否可換發新token
                // 取得後端驗證refreshToken API URL
                const refreshTokenUrl = `/api/account/refresh-token`
                const res = await api.post(refreshTokenUrl, {}, {
                    withCredentials: true,
                });

                // 成功換發新token，更新本地jwt_token (refresh Token已在cookie)
                const jwt_token = res.data;
                localStorage.setItem("jwt_token", jwt_token);

                // 更新原本失敗請求的Header
                originalRequest.headers.Authorization = `Bearer ${jwt_token}`;

                // 重發原本請求，並將結果回傳原本的呼叫者
                return api(originalRequest);

            } catch (refreshError) {
                console.warn("Refresh token 失效或換發失敗，強制登出");
                warningToast("Refresh token 失效或換發失敗，強制登出");

                // 清除失效token
                localStorage.removeItem("jwt_token");

                // 強制回登入頁
                router.push('/login');
            }
        }

        // 如果不是 401 或是重試失敗，就拋出原本的錯誤
        return Promise.reject(error);
    })

export default api;