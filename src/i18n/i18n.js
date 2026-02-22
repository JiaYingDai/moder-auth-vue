// i18n.js
import { createI18n } from 'vue-i18n'
import tw from './tw'
import en from './en'

const messages = {
    tw, en
}

// 預設語系
const locale = localStorage.getItem('locale') || 'tw';

// 建立Vuei18n實體
const i18n = createI18n({
    legacy: false,
    locale: locale, // 設定本地語系
    messages,
});

export default i18n;