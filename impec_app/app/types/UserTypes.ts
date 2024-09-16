export interface IUsers {

    token?: string;
    userdetails: {
      idU: string;
      idP: string;
      role: string;
      expiration: string;
      profile: {
        type_vehicule: string[];
        is_taxi_independant: boolean;
        is_deleted: boolean;
        _id: string;
        siret: string;
        raison_social: string;
        nom: string;
        prenom: string;
        tel_fix: string;
        tel_mobile: string;
        adresse: string;
        commune_rattachement: string;
        num_autorisation_stationnement: string;
        carte_professionnelle: string;
        carte_stationnement: string;
        num_finess: string;
        societe_parent: string | null;
        __v: number;
      };
    };
    email: string;

}
