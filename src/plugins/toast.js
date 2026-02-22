// 共用toast元件
import { useToast } from "vue-toastification";

const toastSetting = {
    position: "bottom-center",
    timeout: 2000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    closeButton: "button",
    icon: true,
    rtl: false
}

export function useCustomToast() {
    const toast = useToast();
    const defaultToastMessage = "Toastification is awesome";

    const normalToast = (message) => {
        return toast(message || defaultToastMessage, toastSetting);
    };

    const successToast = (message) => {
        return toast.success(message || defaultToastMessage, toastSetting);
    };

    const warningToast = (message) => {
        return toast.warning(message || defaultToastMessage, toastSetting);
    };

    const errorToast = (message) => {
        return toast.error(message || defaultToastMessage, toastSetting);
    };

    const infoToast = (message) => {
        return toast.info(message || defaultToastMessage, toastSetting);
    };

    // 回傳這些功能
    return {
        normalToast,
        successToast,
        warningToast,
        errorToast,
        infoToast
    };
}