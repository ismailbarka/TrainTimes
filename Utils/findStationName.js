export const findStationName = (stationsData, userData, code) => {
    const station = stationsData.find(item => item.codeGare === code);
    return station ? userData.language === "ar" ? station.designationAr : station.designationFr : 'Unknown Station';
  };