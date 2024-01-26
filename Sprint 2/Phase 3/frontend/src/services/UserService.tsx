import axios, {AxiosInstance} from 'axios'
import { User } from '../dto/User';
import { UserProfile } from '../dto/UserProfile';
import { UserAdd } from '../dto/UserAdd';

interface CommunityUserResponse {
    nb_abonnement: number;
    nb_abonne: number;
    liste_abonnement: string[];
    liste_abonne: string[];
  }
export class UserService {

    private apiUrl: string;
    private axiosInstance: AxiosInstance;
    constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
        this.axiosInstance = axios.create({baseURL: this.apiUrl})
    }

    addUser(user:UserAdd) {
        console.log(user)
        return this.axiosInstance.post<User>('/register', user);
    }

    getUser(username:string) {
        return this.axiosInstance.get<UserProfile>('/users/'+username);
    }

    getUsers() {
        return this.axiosInstance.get<User[]>('/users');
    }

    updateUser(user:UserAdd) {
        return this.axiosInstance.put<User>('/users', user)
    }

    deleteUser(username:string) {
        return this.axiosInstance.delete<void>('/users/'+username)
    }

    log_user(user: UserAdd) {
        return this.axiosInstance.post<User>('/login_check', user);
    }

    communityUser(username:string) {
        return this.axiosInstance.get<CommunityUserResponse>('/community/'+username);
    }

    findFollow(username1:string, username2:string) {
        return this.axiosInstance.get<boolean>('/find_follow/'+username1+'/'+username2);
    }
    handleFollow(username1:string, username2:string) {
        return this.axiosInstance.post<string>('/handle_follow/'+username1+'/'+username2);
    }



}