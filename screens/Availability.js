import React, { useContext, useState } from "react";
import { Button, Text, View, ScrollView, StyleSheet, Image, TouchableOpacity } from "react-native";
import { UserContext } from "../context/UserContext";
import TrainImage from '../svgtopng/train.png'  // Import the local PNG file
import arrowUp from '../svgtopng/arrowUp.png'  // Import the local PNG file
import arrowDown from '../svgtopng/arrowDown.png'  // Import the local PNG file
import passenger from '../svgtopng/passenger.png'  // Import the local PNG file
import price from '../svgtopng/price.png'  // Import the local PNG file
import axios from "axios";
import i18next from '../services/i18next';
import { useTranslation } from 'react-i18next';



const categories = ["all","direct", "connected"];

const data = [
    {
        codeGareDepart: "206",
        codeGareArrivee: "200",
        dateTimeDepart: "2024-09-20T00:01:47+01:00",
        dateTimeArrivee: "2024-09-20T00:01:47+01:00",
        durationTrajet: "12:00",
        prix: "50"
    },
    {
        codeGareDepart: "206",
        codeGareArrivee: "200",
        dateTimeDepart: "2024-09-20T00:01:47+01:00",
        dateTimeArrivee: "2024-09-20T00:01:47+01:00",
        durationTrajet: "12:00",
        prix: "50"
    },
    {
        codeGareDepart: "206",
        codeGareArrivee: "200",
        dateTimeDepart: "2024-09-20T00:01:47+01:00",
        dateTimeArrivee: "2024-09-20T00:01:47+01:00",
        durationTrajet: "12:00",
        prix: "50"
    },
    {
        codeGareDepart: "206",
        codeGareArrivee: "200",
        dateTimeDepart: "2024-09-20T00:01:47+01:00",
        dateTimeArrivee: "2024-09-20T00:01:47+01:00",
        durationTrajet: "12:00",
        prix: "50"
    },
]

const Availability = ({ navigation }) => {
    const { userData, avaliabletrips, UpdateAvaliableTrips, setSingleTrip, singleTrip  } = useContext(UserContext);
    const [category , setCategory] = useState("all");
    const { t } = useTranslation();

    
    const findStationName = (userData ,code) => {
        const lg = userData.language;
        const station = userData.stationsData.find(item => item.codeGare === code);
        return station ? lg === 'en' ? station.designationEn : lg === 'fr' ? station.designationFr :station.designationAr  : 'Unknown Station'; 
    };

    const getHour = (date) =>{
        const hour = date.split("T")[1].split("+")[0].split(":");
        return hour[0] + ":" + hour[1];

    }
    const getTime = (date) =>{
        const hour = date.split(":");
        return hour[0] + "h" + hour[1] + "m";

    }

    const directTrips = avaliabletrips.departurePath.filter(item => item.trains.length === 1);
    const connectedTrips = avaliabletrips.departurePath.filter(item => item.trains.length > 1);

    const handleNextPage = async () =>{
        const requestBody = {
          codeGareDepart: userData.selectedStart,
          codeGareArrivee: userData.selectedEnd,
          codeNiveauConfort: userData.selectedConfort,
          dateDepartAller: avaliabletrips.departurePath[avaliabletrips.departurePath.length - 1].dateTimeDepart,
          dateDepartAllerMax: null,
          dateDepartRetour: null,
          dateDepartRetourMax: null,
          isTrainDirect: null,
          isPreviousTrainAller: null,
          isTarifReduit: true,
          adulte: userData.selectedAdults,
          kids: userData.selectedKids,
          listVoyageur: [
            {
              numeroClient: null,
              codeTarif: null,
              codeProfilDemographique: "3",
              dateNaissance: null
            },
            {
              numeroClient: null,
              codeTarif: null,
              codeProfilDemographique: "3",
              dateNaissance: null
            },
            {
              numeroClient: null,
              codeTarif: null,
              codeProfilDemographique: "1",
              dateNaissance: null
            },
            {
              numeroClient: null,
              codeTarif: null,
              codeProfilDemographique: "1",
              dateNaissance: null
            },
            {
              numeroClient: null,
              codeTarif: null,
              codeProfilDemographique: "1",
              dateNaissance: null
            }
          ],
          booking: false,
          isEntreprise: false,
          token: "",
          numeroContract: "",
          codeTiers: ""
        };
    
        console.log("nC : " +userData.selectedConfort);
        try {
          const response = await axios.post('https://www.oncf-voyages.ma/api/availability', requestBody, {
            headers: {
              'Content-Type': 'application/json',
            }
          });
          // console.log('Response:', response.data.body);
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
    
          const nextPage = response.data.body.nextCta.next;
          const PrevPage = response.data.body.nextCta.prev;
    
          resToUpdate.next = response.data.body.nextCta.next;
          resToUpdate.prev = response.data.body.nextCta.prev;
    
          console.log("avalibiiiiil : " + resToUpdate.departurePath[0].codeGareDepart);
          UpdateAvaliableTrips(resToUpdate);

          navigation.navigate('AvailabilityScreen');
    
        } catch (error) {
          console.error('Error:', error.response ? error.response.data : error.message);
        }
    }
    const handlePrevPage = async () =>{
        const requestBody = {
          codeGareDepart: userData.selectedStart,
          codeGareArrivee: userData.selectedEnd,
          codeNiveauConfort: userData.selectedConfort,
          dateDepartAller: avaliabletrips.departurePath[0].dateTimeDepart,
          dateDepartAllerMax: null,
          dateDepartRetour: null,
          dateDepartRetourMax: null,
          isTrainDirect: null,
          isPreviousTrainAller: null,
          isTarifReduit: true,
          adulte: userData.selectedAdults,
          kids: userData.selectedKids,
          listVoyageur: [
            {
              numeroClient: null,
              codeTarif: null,
              codeProfilDemographique: "3",
              dateNaissance: null
            },
            {
              numeroClient: null,
              codeTarif: null,
              codeProfilDemographique: "3",
              dateNaissance: null
            },
            {
              numeroClient: null,
              codeTarif: null,
              codeProfilDemographique: "1",
              dateNaissance: null
            },
            {
              numeroClient: null,
              codeTarif: null,
              codeProfilDemographique: "1",
              dateNaissance: null
            },
            {
              numeroClient: null,
              codeTarif: null,
              codeProfilDemographique: "1",
              dateNaissance: null
            }
          ],
          booking: false,
          isEntreprise: false,
          token: "",
          numeroContract: "",
          codeTiers: ""
        };
    
        console.log("nC : " +userData.selectedConfort);
        try {
          const response = await axios.post('https://www.oncf-voyages.ma/api/availability', requestBody, {
            headers: {
              'Content-Type': 'application/json',
            }
          });
          // console.log('Response:', response.data.body);
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
    
          const nextPage = response.data.body.nextCta.next;
          const PrevPage = response.data.body.nextCta.prev;
    
          resToUpdate.next = response.data.body.nextCta.next;
          resToUpdate.prev = response.data.body.nextCta.prev;
    
          console.log("avalibiiiiil : " + resToUpdate.departurePath[0].codeGareDepart);
          UpdateAvaliableTrips(resToUpdate);

          navigation.navigate('AvailabilityScreen');
    
        } catch (error) {
          console.error('Error:', error.response ? error.response.data : error.message);
        }
    }

    const handleSelectTrip = (item) =>{
        setSingleTrip(item);
        navigation.navigate("TripDetails");
    }


    return (
        <View style={styles.container}>
            <View style={styles.navBar}>
                {categories.map((item) => {
                    return  <TouchableOpacity style={item === category ? styles.NavChoiceSelected : styles.NavChoice} onPress={() => setCategory(item)}>
                                <View style={styles.categoriesContainer} >
                                    <Image
                                        source={TrainImage}
                                        style={{ width: 20, height: 20 }}
                                    />
                                    <Text style={styles.titleText}>{t(item)}</Text>
                                </View>
                            </TouchableOpacity>
                })}
            </View>
            <ScrollView>
            {avaliabletrips.next && (
                    <TouchableOpacity style={styles.button} onPress={handlePrevPage}>
                        <Image
                          source={arrowUp}
                          style={{ width: 20, height: 20 }}
                          />
                        <Text style={styles.text}>{t("prev")}</Text>
                    </TouchableOpacity>
                )}
                {( category === "all" ? avaliabletrips.departurePath : category === "direct" ? directTrips : connectedTrips).map((item, index) => {
                    return (
                        <TouchableOpacity onPress={() => handleSelectTrip(item)} key={index} style={styles.tripContainer}>
                            <View style={styles.up}>
                                <View style={styles.upElement}>
                                    <Text style={styles.simpleText}>{t("startStation")}</Text>
                                    <Text style={styles.boldText}>{getHour(item.dateTimeDepart)}</Text>
                                    <Text style={styles.simpleText}>{findStationName(userData ,item.codeGareDepart)}</Text>
                                </View>
                                <View style={styles.upElement}>
                                    <Text style={styles.simpleText}>{getTime(item.durationTrajet)}</Text>
                                    <View style={styles.AToB}>
                                        {item.trains.map((item,index) =>{
                                            return<>
                                                <View style={styles.dot}></View>
                                                <View style={styles.line}></View>
                                            </>
                                        })}
                                        <View style={styles.dot}></View>
                                    </View>
                                    <Text style={styles.simpleText}>{item.trains.length === 1 ? t("direct") : t("inderect")}</Text>
                                </View>
                                <View style={styles.upElement}>
                                    <Text style={styles.simpleText}>{t("endStation")}</Text>
                                    <Text style={styles.boldText}>{getHour(item.dateTimeArrivee)}</Text>
                                    <Text style={styles.simpleText}>{findStationName(userData ,item.codeGareArrivee)}</Text>
                                </View>
                            </View>
                            <View style={styles.down}>
                                <View style={styles.downElementContainer}>
                                    <Image
                                        source={TrainImage}
                                        style={{ width: 20, height: 20 }}
                                        />
                                    <View>
                                        <Text style={styles.simpleText}>{item.trains[0].codeClassification}</Text>
                                        <Text style={styles.simpleText}>{item.trains[0].codeNiveauConfort === "1" ? "first class" : item.trains[0].codeNiveauConfort === "2" ? "second class" : "bed"}</Text>
                                    </View>  
                                </View>
                                <View style={styles.downElementContainer}>
                                    <Image
                                        source={passenger}
                                        style={{ width: 20, height: 20 }}
                                        />
                                    <View>
                                        <Text style={styles.simpleText}>{userData.selectedAdults} : {t("Adult")}</Text>
                                        <Text style={styles.simpleText}>{userData.selectedKids} : {t("kid")}</Text>
                                    </View>   
                                </View>
                                <View style={styles.downElementContainer}>
                                    <Image
                                        source={price}
                                        style={{ width: 20, height: 20 }}
                                        />
                                    <Text style={styles.simpleText}>{item.prix} DH</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })}
                {avaliabletrips.next && (
                    <TouchableOpacity style={styles.button} onPress={handleNextPage}>
                        <Image
                          source={arrowDown}
                          style={{ width: 20, height: 20 }}
                        />
                        <Text style={styles.text}>{t("next")}</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#091057',
    },
    tripContainer: {
        height: 200,
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
        backgroundColor: '#024CAA',
    },
    text: {
        fontSize: 16,
        color: '#DBD3D3',
        marginBottom: 5,
    },
    navBar: {
        height: 50,
        alignItems: "center",
        justifyContent: 'flex-start',
        flexDirection: 'row',
        gap: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#DBD3D3',
        marginBottom: 5,

    },
     NavChoice: {
        height : '100%',
        alignSelf: 'center',
        justifyContent: 'space-around',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderBlockColor: '#DBD3D3',
    },
     NavChoiceSelected: {
        height : '100%',
        backgroundColor: '#DBD3D3',
        alignSelf: 'center',
        justifyContent: 'space-around',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 4,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBlockColor: '#DBD3D3',
        backgroundColor: "#024CAA",
    },
    titleText:{
      color: '#DBD3D3',
    },
    categoriesContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
    },
    down: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        
    },
    downElementContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
        gap: 5
        
    },
    up: {
        flex: 2,
        gap: 5,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: 'gray'
    },
    upElement:{
        flex: 1,
        // backgroundColor: "blue",
        justifyContent: 'center',
        alignItems: 'center',
    },
    simpleText:{
      color: '#DBD3D3',
      textAlign: 'center',
    },
    AToB:{
        width: "80%",
        height: 20,
        // backgroundColor: 'red',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center',
    },
    dot:{
        width: 10,
        height: 10,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#EC8305',
        borderRadius: 50,
        
    },
    line:{
        flex: 1,
        height: 1,
        backgroundColor: '#EC8305',
    },
    boldText:{
        fontWeight: 'bold',
        fontSize: 20,
        color: '#EC8305',
    },
    button: {
        flexDirection: 'row', // Align icon and text horizontally
        alignItems: 'center', // Vertically align icon and text
        backgroundColor: 'transparent', // Transparent background
        padding: 10, // Add padding
        width : "100%",
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        color: '#007AFF', // Text color
        marginLeft: 5, // Space between icon and text
        fontSize: 16,
    },
});

export default Availability;
