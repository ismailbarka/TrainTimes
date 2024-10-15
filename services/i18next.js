// services/i18next.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next'; // Import the react-i18next plugin

// Import your translation files
import en from '../locales/en.json';
import fr from '../locales/fr.json';
import ar from '../locales/ar.json';

i18n
  .use(initReactI18next) // Pass the instance to react-i18next
  .init({
    resources: {
      en: {
        translation: en,
      },
      fr: {
        translation: fr,
      },
      ar: {
        translation: ar,
      },
    },
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    returnObjects: true,
  });

export default i18n;
