export interface Etablissement {
    idEtablissement: number;
    codePostal: string;
    ville: string;
    rue: string;
    numeroRue: number;
    nom: string;
    dateAjout: Date;
    description?: string;
    idUserApproved: number;
}
