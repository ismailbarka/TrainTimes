export const choices = (selectedStart, selectedEnd,stationsData, userData, point) => {
    if (!stationsData || !Array.isArray(stationsData)) {
      console.error("Invalid stations data");
      return [];
    }
    const res =  stationsData.map(station => ({
      label: userData.language === "ar" 
                ? station.designationAr 
                : userData.language === "fr" 
                  ? station.designationFr 
                  : station.designationEn || "Unknown",
      value: station.codeGare
    }));

    if(point === "start")
      if(selectedEnd)
        return res.filter(item => item.value !== selectedEnd)
    if(point === "end")
      if(selectedStart)
        return res.filter(item => item.value !== selectedStart)
    return res;
  };