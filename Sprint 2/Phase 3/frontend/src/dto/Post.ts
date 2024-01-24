export interface Post {
    id_user:number;
    type:string;
    afficher:boolean;
    date: Date;  
    titre_post?:string;
    text?:string;
    id_note?:number;
    id_post_comm?:number;
    id_post?:number;
    picbin?:string;
    picform?:string;
    blob?:Blob;
}
