import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import he from './locales/he.json';

const resources = {
  en: { translation: en },
  he: { translation: he },
};

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources,
  fallbackLng: 'en',
  lng: getLocales()[0].languageCode,
  interpolation: { escapeValue: false },
});

export default i18n;
