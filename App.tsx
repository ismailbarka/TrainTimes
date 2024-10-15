// App.js
import React, { useEffect } from 'react';
import { UserContextProvider } from './context/UserContext';
import AppNavigator from './AppNavigator';
import { useTranslation } from 'react-i18next';
import i18next from './services/i18next'; // This should ensure i18next is properly initialized
import { Text } from 'react-native';

const App = () => {
  const { t } = useTranslation();

  useEffect(() => {
    i18next.changeLanguage('en'); // Set to 'en', 'fr', or 'ar' to test translations
  }, []);

  return (
    <UserContextProvider>
      <AppNavigator />
    </UserContextProvider>
  );
};

export default App;
