import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN.json'
import zhTW from './zh-TW.json'
import es from './es.json'
import en from './en.json'
import pt from './pt.json'
import jp from './jp.json'
import kr from './kr.json'
import fr from './fr.json'
const messages = {
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  en: en,
  es: es,
  pt: pt,
  jp: jp,
  kr: kr,
  fr: fr,
}

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('language') || 'pt',
  fallbackLocale: 'en',
  messages,
})

export default i18n
