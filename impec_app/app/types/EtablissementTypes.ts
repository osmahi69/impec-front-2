export interface EtablissementType {
    id: string;
    name: string;
    description: string;
    address: string;
    city: string;
    lat: number;
    lng: number;
    phone: string;
    logo?: string;
    banner?: string;
    zipcode: string;
    schedules?: Object[];
    user_id: string;
  }