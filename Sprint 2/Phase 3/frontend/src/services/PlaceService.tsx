import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Place } from '../dto/Place'; 
import { User } from '../dto/User';

export class PlaceService {

    private apiUrl: string;
    private axiosInstance: AxiosInstance;
    constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
        this.axiosInstance = axios.create({baseURL: this.apiUrl})}
    
  addPlace(placeData:Place) {
    console.log(placeData)
    return this.axiosInstance.post<Place>('/places', placeData);
}


}