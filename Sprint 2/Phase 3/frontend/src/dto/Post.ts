export interface Post {
    id_post:number;
    id_user:number;
    date:Date;
    type:string;
    afficher:boolean;
    text?:string;
    id_note?:number;
    id_post_comm?:number;
}
