import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

// tslint:disable-next-line: no-floating-promises
i18next
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: {
      'en-US': ['en'],
      'it-IT': ['it'],
      default: ['en'],
    },
    debug: true,
    backend: {
      allowMultiLoading: true,
    },
    react: {
      wait: true,
    },
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18next;
