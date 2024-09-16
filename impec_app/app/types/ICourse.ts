export interface ICourse {
    id: string;
    taxi_nom: string;
    taxi_prenom: string;
    taxi_nom_prenom: string;
    client_nom: string;
    client_prenom: string;
    client_nom_prenom: string;
    client_tel: string;
    date_prisecharge_display: string;
    date_prisecharge: string;
    heure_prisecharge: string;
    date_prisecharge_retour: string;
    heure_prisecharge_retour: string;
    calendarDisplay: {
      year: string;
      month: string;
      day: string;
    };
    date_add_course: string;
    code_course: string;
    created_by: string;
    proposer_a: string[];
    etat_course: string;
    client: string;
    nom_service: string;
    num_chambre: string;
    num_dossier: string;
    date_heure_prise_encharge: string;
    heure_prise_encharge_retour: string;
    lieu_prise_encharge: {
      _id: string;
      adresse: string;
      gps_coords: {
        type: string;
        coordinates: [number, number];
        _id: string;
      };
    };
    destination_prise_encharge: {
      _id: string;
      adresse: string;
      gps_coords: {
        type: string;
        coordinates: [number, number];
        _id: string;
      };
    };
    type_course: string;
    estimated_distance: string;
    estimated_duree: string;
    remarques: string;
    bon_transport: any; // You can replace 'any' with a more specific type if needed
    bon_securite: any;
    bon_mutuel: any;
    is_urgent: boolean;
    date_fin: string;
    notifications: any[]; // Same here, replace 'any' with a specific type if needed
    istaxivsl: boolean;
    isambulance: boolean;
    taxi_tel: string;
    taxi_raison_social: string;
    taxi_societe: string;
  }
  

  export enum EStatusCourse {
    PROPOSED = 'PROPOSED',
    TERMINE= "TERMINE",
    ACCEPTED = 'ACCEPTED',
    AVENIR = 'AVENIR',
    ATTENTE = 'ATTENTE',
    
  }

  export interface ICourseForm {
    siret: string;
    society: string;
    firstname: string;
    lastname: string;
    phone: string;
    mobilephone: string;
    address: string;
    email: string;
    password: string;
    password_confirm: string;
    zipcode: string;
    commune: string;
    cpam: string;
    security_number: string;
    stationnement: string;
    isTaxiVSL?: boolean;
    isAmbulance?: boolean;
    ars?: string;
    client_firstname: string;
    client_lastname: string;
    client_phone: string;
    date: string;
    time: string;
    destination: string;
    prise_en_charge: string;
    typeCourse: string;
  }