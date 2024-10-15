import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { UserContext } from '../context/UserContext';
import TrainImage from '../svgtopng/train.png';

const TripDetails = () => {
  const { userData, singleTrip } = useContext(UserContext);

  const findStationName = (userData ,code) => {
    const lg = userData.language;
    const station = userData.stationsData.find(item => item.codeGare === code);
    return station ? lg === 'en' ? station.designationEn : lg === 'fr' ? station.designationFr :station.designationAr  : 'Unknown Station'; 
};

  const getHour = (date) => {
    const hour = date.split("T")[1].split("+")[0].split(":");
    return hour[0] + ":" + hour[1];
  };

  const getTime = (date) => {
    const hour = date.split(":");
    return hour[0] + "h" + hour[1] + "m";
  };

  return (
    <View style={styles.container}>
      {singleTrip.trains.map((item, index) => (
        <View key={index} style={styles.tripSegment}>
          {index === 0 && (
            <View style={styles.stationInfo}>
              <View style={styles.dot}></View>
              <Text style={styles.stationText}>{getHour(item.dateHeureDepart)} ({findStationName(userData, item.codeGareDepart)})</Text>
            </View>
          )}
          <View style={styles.trainInfo}>
            <Image source={TrainImage} style={styles.trainIcon} />
            <View style={styles.trainDetails}>
              {item.codeClassification && (
                <View style={styles.classInfo}>
                  <View style={styles.dotSmall}></View>
                  <Text style={styles.classText}>Class: {item.codeClassification} ({item.codeGamme === "2" ? "2nd Class" : item.codeGamme === "1" ? "1st Class" : "Single Bed"})</Text>
                </View>
              )}
              {item.duree && (
                <View style={styles.durationInfo}>
                  <View style={styles.dotSmall}></View>
                  <Text style={styles.durationText}>Duration: {getTime(item.duree)}</Text>
                </View>
              )}
            </View>
          </View>
          <View style={styles.stationInfo}>
            <View style={styles.dot}></View>
            <Text style={styles.stationText}>{getHour(item.dateHeureArrivee)} ({findStationName(userData, item.codeGareArrivee)})</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#091057',
  },
  tripSegment: {
    marginBottom: 30,
  },
  stationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dot: {
    width: 12,
    height: 12,
    backgroundColor: '#024CAA',
    borderRadius: 6,
    marginRight: 10,
  },
  dotSmall: {
    width: 6,
    height: 6,
    backgroundColor: '#EC8305',
    borderRadius: 3,
    marginRight: 5,
  },
  stationText: {
    fontSize: 18,
    color: '#DBD3D3',
    lineHeight: 24,
  },
  trainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  trainIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  trainDetails: {
    flex: 1,
  },
  classInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  classText: {
    fontSize: 16,
    color: '#DBD3D3',
    lineHeight: 22,
  },
  durationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    fontSize: 16,
    color: '#DBD3D3',
    lineHeight: 22,
  },
});

export default TripDetails;