export interface Post {
    id_user:number;
    date:Date;
    type:string;
    afficher:boolean;   
    titre_post?:string;
    text?:string;
    id_note?:number;
    id_post_comm?:number;
    id_post?:number;
}
