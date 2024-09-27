import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import HOME_EN from '/src/locales/en/home.json'
import HEADER_EN from '/src/locales/en/header.json'
import FOOTER_EN from '/src/locales/en/footer.json'
import EVENT_EN from '/src/locales/en/event.json'
import FILTER_EN from '/src/locales/en/filter.json'
import PRODUCTVIEW_EN from '/src/locales/en/productview.json'
import ABOUT_EN from '/src/locales/en/about.json'
import REGISTER_EN from '/src/locales/en/register.json'

import HOME_VI from '/src/locales/vi/home.json'
import HEADER_VI from '/src/locales/vi/header.json'
import FOOTER_VI from '/src/locales/vi/footer.json'
import EVENT_VI from '/src/locales/vi/event.json'
import FILTER_VI from '/src/locales/vi/filter.json'
import PRODUCTVIEW_VI from '/src/locales/vi/productview.json'
import ABOUT_VI from '/src/locales/vi/about.json'
import REGISTER_VI from '/src/locales/vi/register.json'

export const resources = {
  en: {
    home: HOME_EN,
    header: HEADER_EN,
    footer: FOOTER_EN,
    event: EVENT_EN,
    filter: FILTER_EN,
    productview: PRODUCTVIEW_EN,
    about: ABOUT_EN,
    register: REGISTER_EN
  },
  vi: {
    home: HOME_VI,
    header: HEADER_VI,
    footer: FOOTER_VI,
    event: EVENT_VI,
    filter: FILTER_VI,
    productview: PRODUCTVIEW_VI,
    about: ABOUT_VI,
    register: REGISTER_VI
  },
};

export const defaultNs = 'vi'
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "vi",
    defaultNs,
    ns: ['home'],
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;