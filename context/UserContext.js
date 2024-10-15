import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react';

export const UserContext = createContext({
  userData: {
    language: '',
  },
  setUserInfos: () => {},
});

export const UserContextProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    language: '',
    stationsData : [],
    selectedStart : "",
    selectedEnd : "",
    date : "",
    selectedAdults : "",
    selectedKids : "",
    selectedConfort : "",
    
    });
  const [avaliabletrips, setAvaliableTrips] = useState({ 
    departurePath :[],
    next: false,
    prev: false,
  });

  const [singleTrip, setSingleTrip] = useState([]);

  const setUserInfos = (newData) => {
    setUserData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };



  const UpdateAvaliableTrips = (data) =>{
    setAvaliableTrips(data)
  }

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem("language") || '';
        const storedGender = await AsyncStorage.getItem("gender") || '';
        setUserData({ language: storedLanguage, gender: storedGender });
      } catch (error) {
        console.error('Failed to load user data from AsyncStorage', error);
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    const saveUserData = async () => {
      try {
        console.log("userData.language: " + userData.language);
        await AsyncStorage.setItem("language", userData.language);
        console.log('UserData saved');
      } catch (error) {
        console.log('Failed to save user data to AsyncStorage', error);
      }
    };

    saveUserData();
  }, [userData]); // Dependency array to trigger effect on userData change

  return (
    <UserContext.Provider value={{ userData, setUserInfos, avaliabletrips, UpdateAvaliableTrips, setSingleTrip, singleTrip }}>
      {children}
    </UserContext.Provider>
  );
};
