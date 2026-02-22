// tw.js
export default {
    // 全域共用動作
    ACTION: {
        "SUBMIT": "送出",
        "CONFIRM": "確認",
    },
    // 全域共用欄位名
    FIELD: {
        "NAME": "姓名",
        "PASSWORD": "密碼",
    },
    RESULT: {
        "EDIT_SUCCESS": "編輯成功!",
    },
    // 後端回傳錯誤代碼
    ERRORS: {
        "DEFAULT": "發生未知的錯誤",
        "AUTH_001": "帳號或密碼錯誤",
        "AUTH_002": "帳號被停權，請聯繫客服",
        "AUTH_003": "帳號存在但未驗證Email",
        "AUTH_005": "此Email已經註冊過囉！",
        "LOGIN_FAILED": "登入發生錯誤",
        "EDIT_FAILED": "編輯失敗",
        "RESETPWD_FAILED": "重設密碼失敗，請再嘗試一次",
        "INVALID_LINK": "無效的連結!",
        "REGISTER_FAILED": "註冊失敗，請稍後再試或聯繫客服"
    },
    // 前端驗證規則
    VALIDATION: {
        "REQUIRED": "此欄位必填",
        "PWD_COMPLEXITY": "需包含大小寫英文、數字及特殊符號",
        "EMAIL_FORMAT": "Email格式錯誤",
        "PWD_NOT_MATCH": "密碼不一致"
    },
    // 各頁面文案
    PAGE: {
        HOME: {
            "TITLE": "首頁",
            "LOGOUT": "登出",
            "LOGOUT_CONFIRM": "確定要登出嗎?",
        },
        LOGIN: {
            "TITLE": "會員登入",
            "NO_ACCOUNT_HINT": "還不是會員嗎?",
            "SIGNUP_LINK": "立即註冊",
            "TYPEEMAIL": "請輸入Email",
            "TYPEPWD": "請輸入密碼",
            "OR": "或",
            "FORGOT_PASSWORD": "忘記密碼",
            "RESEND_VERIFICATION": "重寄註冊驗證信",
            "LOGIN_SUCCESS": "登入成功!"
        },
        REGISTER: {
            "TITLE": "註冊新帳號",
            "SET_PASSWORD": "設定密碼",
            "RESET_PASSWORD": "再次輸入密碼",
            "CONFIRM_PASSWORD": "確認密碼",
            "SUBMIT_BTN": "確認註冊",
            "HAS_ACCOUNT_HINT": "已經有帳號了?",
            "LOGIN_LINK": "返回登入",
            "REGISTER_SUCCESS": "註冊成功!請檢查您的信箱並點擊驗證連結完成帳號驗證。",
            "TYPENAME": "請輸入姓名",
        },
        MEMBER: {
            "TITLE": "會員中心",
            "HELLO": "你好!",
            "WELCOME_BACK": "歡迎回來!",

        },
        VERIFY: {
            "LOADING": "驗證中，請稍候...",
            "SUCCESS_TITLE": "驗證成功",
            "SUCCESS_MESSAGE": "您的帳號已成功驗證，現在可以登入了。",
            "GO_LOGIN": "前往登入",
            "FAILED_TITLE": "驗證失敗",
            "FAILED_MESSAGE": "驗證連結無效，請確認連結是否正確或重新發送驗證信。",
            "EXPIRED_TITLE": "連結已過期",
            "EXPIRED_MESSAGE": "此驗證連結已過期，請重新發送驗證信。",
            "ALREADY_TITLE": "已驗證",
            "ALREADY_MESSAGE": "您的帳號已驗證過，現在可以登入了。",
            "TOKEN_ALREADY_USED": "此連結已失效或已被使用，請重新申請",

            "RESEND": "重新發送驗證信",
            "RESEND_SUCCESS": "驗證信已重新發送，請檢查您的信箱。",
            "RESEND_FAILED": "發送失敗，請稍後再試。",
            "BACK_LOGIN": "返回登入頁"
        },
        RESEND: {
            "TITLE": "重寄註冊驗證信",
            "DESCRIPTION": "請輸入您註冊時使用的Email，我們將重新發送註冊驗證信給您。",
            "SUBMIT": "發送驗證信",
            "SUCCESS_TITLE": "驗證信已發送",
            "SUCCESS_MESSAGE": "請檢查您的信箱並點擊驗證連結完成帳號驗證。",
            "BACK_LOGIN": "返回登入頁",
            "EMAIL_NOT_FOUND": "此Email尚未註冊",
            "ALREADY_VERIFIED": "此帳號已完成驗證，請直接登入"
        }
        ,
        FORGOT: {
            "TITLE": "寄送忘記密碼驗證信",
            "DESCRIPTION": "請輸入您註冊時使用的Email，我們將發送忘記密碼驗證信給您。",
            "SUBMIT": "發送驗證信",
            "SUCCESS_TITLE": "驗證信已發送",
            "SUCCESS_MESSAGE": "請檢查您的信箱並點擊驗證連結以重設密碼。",
            "BACK_LOGIN": "返回登入頁",
            "EMAIL_NOT_FOUND": "此Email尚未註冊",
            "USER_NOT_FOUND": "找不到使用者 或 資料未變更"
        },
        RESETPWD: {
            "TITLE": "重設密碼",
            "BACK_LOGIN": "返回登入頁",
            "LINK_EXPIRED": "連結已過期，請重新發送驗證信。",
            "FAILED_LINK": "連結無效，請確認連結是否正確或重新發送驗證信。",
            "SUCCESS_MESSAGE": "重設密碼成功，請重新登入。",
            "USER_NOT_FOUND": "找不到使用者 或 資料未變更",
            "TOKEN_ALREADY_USED": "此連結已失效或已被使用，請重新申請",
            "PASSWORD_REUSED": "新密碼不能與舊密碼相同",
        }
    }
}

