
export const pasangersDataAdult = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' }
];
export const pasangersDataKids = [
  { label: '0', value: '0' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' }
];

export const hour = [
  { label: '12am - 06am', value: '00:01' },
  { label: '06am - 12pm', value: '06:01' },
  { label: '12pm - 19pm', value: '12:01' },
  { label: '19pm - 12am', value: '19:01' }
];

export const languages = [
  { label: 'العربية', value: 'ar' },
  { label: 'francais', value: 'fr' },
  { label: 'english', value: 'en' },
];

export const AvailabilityRequest = (codeGareDepart, codeGareArrivee, codeNiveauConfort,dateDepartAller, adulte, kids ) =>{
    return {
      codeGareDepart: codeGareDepart,
      codeGareArrivee: codeGareArrivee,
      codeNiveauConfort: codeNiveauConfort,
      dateDepartAller: dateDepartAller,
      dateDepartAllerMax: null,
      dateDepartRetour: null,
      dateDepartRetourMax: null,
      isTrainDirect: null,
      isPreviousTrainAller: null,
      isTarifReduit: true,
      adulte: adulte,
      kids: kids,
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
}