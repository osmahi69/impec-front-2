export interface ContactTypes {
    id: string;
    raison_social: string;
    prenom: string;
    nom: string;
    tel: string;
    fix: string;
    status: string;
    discussion: {
      lastdate: string;
    };
    lastdate: string;
}
