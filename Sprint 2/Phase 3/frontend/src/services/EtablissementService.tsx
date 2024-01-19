import axios, {AxiosInstance} from 'axios'
import { Etablissement } from '../dto/Etablissement';

export class EtablissementService {

    private apiUrl: string;
    private axiosInstance: AxiosInstance;
    constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
        this.axiosInstance = axios.create({baseURL: this.apiUrl})
    }


    getEtablissement(nom:string) {
        return this.axiosInstance.get<Etablissement>('/etablissement/'+nom);
    }

    getEtablissements() {
        return this.axiosInstance.get<Etablissement[]>('/etablissement');
    }

    getEtablissementNote(nom:string) {
        return this.axiosInstance.get('note?nom='+nom );
    }

    getEtablissementCoord(address: string) {
        return this.axiosInstance.get(`/coord?address=${address}`);
    }


getEtablissementsByRegime(regime : string) {
    return this.axiosInstance.get(`/etablissements/by_regime?regime_id=${regime}`);
}
    

}