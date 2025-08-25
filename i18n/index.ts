// app/i18n/index.ts
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import he from './locales/he.json';

i18n
  .use(initReactI18next)
  .init({
    lng: Localization.locale.includes('he') ? 'he' : 'en',
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      he: { translation: he }
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
