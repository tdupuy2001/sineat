export interface User {
    id_user: number;
    username: string;
    date_de_naissance?:Date;
    email:string;
    password: string;
    langue:string;
    nom?:string;
    prenom?:string;
    genre?:string;
    adresse?:string;
    description?:string;
}
