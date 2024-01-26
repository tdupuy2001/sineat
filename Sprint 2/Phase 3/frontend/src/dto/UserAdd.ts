export interface UserAdd {
    username: string;
    date_de_naissance?:string|undefined;
    email?:string;
    password?: string;
    langue?:string|undefined;
    nom?:string|undefined;
    prenom?:string|undefined;
    genre?:string|undefined;
    adresse?:string|undefined;
    description?:string|undefined;
    old_username?: string|undefined;
    ppbin?: string|undefined;
    ppform?: string|undefined;
}
