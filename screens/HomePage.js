import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, Text, StyleSheet, Button, TouchableOpacity, Modal, View, ActivityIndicator, Alert } from 'react-native';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import DropDownComponent from '../Components/DropDownComponent';
import DatePicker from 'react-native-modern-datepicker';
import {getToday, getFormatedDate} from 'react-native-modern-datepicker';
import {pasangersDataAdult, pasangersDataKids, hour, AvailabilityRequest } from '../data';
import { useTranslation } from 'react-i18next';
import i18next from '../services/i18next';
import {findStationName} from '../Utils/findStationName'
import { choices } from '../Utils/choices';
import {calculateChoices} from '../Utils/calculateChoices'



const HomePage = ({ navigation }) => {
  const { userData, UpdateAvaliableTrips ,  setUserInfos} = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [stationsData, setStationsData] = useState([]);
  const [selectedStart, setSelectedStart] = useState("");
  const [selectedEnd, setSelectedEnd] = useState("");
  const [date, setDate] = useState("12/12/2023");
  const [selectedAdults, setSelectedAdults] = useState("");
  const [selectedKids, setSelectedKids] = useState("");
  const [selectedConfort, setSelectedConfort] = useState("");
  const [selectedHour, setSelectedHour] = useState("");
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({selectedStart: false , selectedEnd: false  , selectedAdults: false, selectedKids: false, selectedConfort: false, selectedHour: false});
  // const [avalibility, setAvalibility] = useState([]);
  const { t } = useTranslation();

  const today = new Date();
  const startDate = getFormatedDate(today.setDate(today.getDate()), 'YYYY/MM/DD');

  useEffect(() => {
    setIsLoading(true)
    const fetchData = async () => {
      setDate(startDate);
      setIsLoading(true);
      try {
        const stationsResponse = await axios.get("https://www.oncf-voyages.ma/cache/stations");
        const stations = stationsResponse.data.station
        .filter(station => /^\d+$/.test(station.codeGare))  
        .map(station => ({
          codeGare: station.codeGare,
          designationAr: station.designationAr,
          designationFr: station.designationFr,
          designationEn: station.designationEn
        }));
        setStationsData(stations);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error.response);
        setIsLoading(false);
      }
    };
    fetchData();
    i18next.changeLanguage(userData.language);
  }, []);

  const handlePressOpenButton = () =>{
    setOpen(!open);
  }

  const handleDateChange = (propDate) => {
    setDate(propDate);
  }

  const valideDate = (date, hour) => {
    const valideDay =  date.split('/').join('-');
    return `${valideDay}T${hour}:08+01:00`;

  };

  const handleSubmit = async () => {
    valideDate(date , selectedHour);
    const requestBody = AvailabilityRequest(selectedStart, selectedEnd, selectedConfort, valideDate(date , selectedHour),selectedAdults, selectedKids)
    try {
      setIsLoading(true)
      const response = await axios.post('https://www.oncf-voyages.ma/api/availability', requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      let resToUpdate = { 
        departurePath :[],
        next: false,
        prev: false,
      };
      for (let i = 0; response.data.body.departurePath[i]; i++) {
        const codeGareDepart = response.data.body.departurePath[i].codeGareDepart;
        const codeGareArrivee = response.data.body.departurePath[i].codeGareArrivee;
        const dateTimeDepart = response.data.body.departurePath[i].dateTimeDepart;
        const dateTimeArrivee = response.data.body.departurePath[i].dateTimeArrivee;
        const durationTrajet = response.data.body.departurePath[i].durationTrajet;
        const prix = response.data.body.departurePath[i].listPrixFlexibilite[0].prixFlexibilite[0].prix;
        const trains = response.data.body.departurePath[i].listSegments.map((item) =>{
          return {
            codeClassification : item.codeClassification,
            codeGareArrivee :  item.codeGareArrivee,
            codeGareDepart : item.codeGareDepart,
            codeNiveauConfort: item.codeNiveauConfort,
            dateHeureArrivee: item.dateHeureArrivee,
            dateHeureDepart : item.dateHeureDepart,
            duree : item.duree,
            numeroCommercial : item.numeroCommercial
          }
        })
      
        resToUpdate.departurePath.push({
          codeGareDepart: codeGareDepart,
          codeGareArrivee: codeGareArrivee,
          dateTimeDepart: dateTimeDepart,
          dateTimeArrivee: dateTimeArrivee,
          durationTrajet: durationTrajet,
          prix: prix,
          trains : trains,
        });
      }

      resToUpdate.next = response.data.body.nextCta.next;
      resToUpdate.prev = response.data.body.nextCta.prev;

      UpdateAvaliableTrips(resToUpdate);
      setUserInfos({
        language: userData.language,
        stationsData : stationsData,
        selectedStart : selectedStart,
        selectedEnd : selectedEnd,
        date : valideDate(date , selectedHour),
        selectedAdults : selectedAdults,
        selectedKids : selectedKids,
        selectedConfort : selectedConfort,
        });
      navigation.navigate('AvailabilityScreen');

    } catch (error) {
      if(error.response)
        handleAlert(t("error")) 
      else
        handleAlert(t("noTrips"));

    } finally{
      setIsLoading(false);
    }
  };



  const handleAlert = (message) =>{
    Alert.alert('', message);
    setIsLoading(false);

  }

  const fullInfos = () => {
    if (selectedStart && selectedEnd && selectedAdults && selectedKids && selectedConfort && selectedHour)
      return true;
    return false;
  }

  const showHourChoices = (selectedHour) =>{
    if(selectedHour && selectedHour === "00:01")
      return t("12am - 06am");
    else if(selectedHour && selectedHour === "06:01")
      return t("06am - 12pm");
    else if(selectedHour && selectedHour === "12:01")
      return t("12pm - 19pm");
    else if(selectedHour && selectedHour === "19:01")
      return t("19pm - 12am");
    return t("hour")

  }

  return (
    <ScrollView style={styles.container}>
      {isLoading ? (
        <>
          <ActivityIndicator />
        </>
      ) : (
        <>
        {/* <Text>{avalibility}</Text> */}
          <Text style={styles.subHeader}>{ t("startStation")}</Text>
          <DropDownComponent
            placeholderTitle={selectedStart ? findStationName(stationsData, userData, selectedStart) : t("choseStation")}
            search={true}
            choices={choices(selectedStart, selectedEnd,stationsData, userData,"start")}
            setSelected={setSelectedStart}
            error={errors.selectedStart}
          />
          <Text style={styles.subHeader}>{ t("endStation")}</Text>
          <DropDownComponent
            style={styles.test}
            placeholderTitle={ selectedEnd ? findStationName(stationsData, userData, selectedEnd) : t("choseStation")}
            search={true}
            choices={choices(selectedStart, selectedEnd,stationsData, userData,"end")}
            setSelected={setSelectedEnd}
            error={errors.selectedEnd}
            />
          <Text style={styles.subHeader}>{ t("passengers")}</Text>
            <View style={styles.pasangersContainer}>
              <View style={styles.DropCntainer}>
                <DropDownComponent
                  placeholderTitle={ selectedAdults ?  selectedAdults : t("Adult")}
                  search={false}
                  choices={calculateChoices(pasangersDataAdult , selectedKids, 0)}
                  setSelected={setSelectedAdults}
                  error={errors.selectedAdults}
                  />
              </View>
              <View style={styles.DropCntainer}>
                <DropDownComponent
                  placeholderTitle={ selectedKids ?  selectedKids : t("kid")}
                  search={false}
                  choices={calculateChoices(pasangersDataKids, selectedAdults, 2)}
                  setSelected={setSelectedKids}
                  error={errors.selectedKids}
                  />
              </View>
            </View> 
          <Text style={styles.subHeader}>{ t("confort")}</Text>
          <DropDownComponent
            style={styles.test}
            placeholderTitle={selectedConfort ?  selectedConfort : t("confort")}
            search={false}
            choices={t("myConfort", { returnObjects: true })}
            setSelected={setSelectedConfort}
            error={errors.selectedConfort}
          />
          <Text style={styles.subHeader}>{t("choseHour")}</Text>
          <DropDownComponent
            style={styles.test}
            placeholderTitle={ showHourChoices(selectedHour)}
            search={false}
            choices={hour}
            setSelected={setSelectedHour}
            error={errors.selectedHour}
          />
          <Text style={styles.subHeader}>{ t("dayChose")}</Text>
          <TouchableOpacity onPress={handlePressOpenButton} style={styles.dateContainer}>
            <Text style={styles.dropdown}>{date}</Text>
          </TouchableOpacity>
          <Modal
            animationType='slide'
            transparent={true}
            visible={open}
            >
            <View style={styles.centredView}>
              <View style={styles.modalView}>
                <DatePicker
                  mode="calendar"
                  minimumDate={startDate}
                  selected={date}
                  onSelectedChange={handleDateChange} 
                  
                  />
                <Text>{date}</Text>
              <TouchableOpacity onPress={handlePressOpenButton} style={styles.button}>
                <Text style={styles.buttonText}>close</Text>
              </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Text style={styles.subHeader}> </Text>
          <TouchableOpacity
            style={fullInfos() ? styles.button : styles.buttonDisabled}
            disabled={!fullInfos()}
            onPress={() => handleSubmit()}
          >
            <Text style={fullInfos() ? styles.buttonText :styles.buttonTextDisabled }>{fullInfos() ?t('nextButton'): t('pleaseFillAll') }</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#091057"
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
    color: 'gray',
    fontWeight: 'bold',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color : "#EC8305"
  },
  datePicker: {
    width: 200,
    height: 200,
  },
  centredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    width : "90%",
    padding: 35,
    alignItems: "center",
    shadowColor : "#000",
    shadowOffset : {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,

  },
  dateContainer: {
    backgroundColor: '#DBD3D3',
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  dropdown: {
  },
  pasangersContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'space-around',
    gap: 20
  },
  DropCntainer: {
    flex: 1,
  }
});

export default HomePage;
