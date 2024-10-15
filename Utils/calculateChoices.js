export const calculateChoices = (pasangersData, n, add) => {
    const index = +n;
    if(pasangersData.length - n + add <= 0)
      return [0];
    return pasangersData.slice(0, pasangersData.length - n + add);
  };