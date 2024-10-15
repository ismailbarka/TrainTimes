import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DropDownComponent from '../Components/DropDownComponent';
import { UserContext } from '../context/UserContext';
import { useTranslation } from 'react-i18next';
import i18next from '../services/i18next';
import {languages} from '../data.js'

const SetInfosScreen = ({ navigation }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const { setUserInfos } = useContext(UserContext);
  const { t } = useTranslation();

  useEffect(() => {
    setUserInfos({
      language: selectedLanguage,
    });
    i18next.changeLanguage(selectedLanguage);
  }, [selectedLanguage]);

  return (
    <View style={styles.container}>
      <DropDownComponent 
        placeholderTitle={t('langugeChoseTitle')} 
        search={false} 
        choices={languages} 
        setSelected={setSelectedLanguage}
        style={styles.dropdown}
        error={false}
      />
      <TouchableOpacity
        style={selectedLanguage ? styles.button : styles.buttonDisabled}
        onPress={() => navigation.navigate('HomeScreen')}
        disabled={selectedLanguage !== 'ar' && selectedLanguage !== 'fr' && selectedLanguage !== 'en'}
      >
        <Text style={selectedLanguage ?  styles.buttonText : styles.buttonTextDisabled}>{t('nextButton')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    gap: 20,
    backgroundColor: '#091057',
  },
  dropdown: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#024CAA',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#DBD3D3',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#DBD3D3',
    fontWeight: 'bold',
  },
  buttonTextDisabled: {
    fontSize: 16,
    color: '#EC8305',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#B0C4DE',
  },
});

export default SetInfosScreen;
