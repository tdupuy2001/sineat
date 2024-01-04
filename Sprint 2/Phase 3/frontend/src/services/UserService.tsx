import axios, {AxiosInstance} from 'axios'
import { User } from '../dto/User';

export class UserService {

    private apiUrl: string;
    private axiosInstance: AxiosInstance;
    constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
        this.axiosInstance = axios.create({baseURL: this.apiUrl})
    }

    addUser(user:User) {
        console.log(user)
        return this.axiosInstance.post<User>('/register', user);
    }

    getUser(username:string) {
        return this.axiosInstance.get<User>('/users/'+username);
    }

    getUsers() {
        return this.axiosInstance.get<User[]>('/users');
    }

    updateUser(user:User) {
        return this.axiosInstance.put<User>('/users', user)
    }

    deleteUser(username:string) {
        return this.axiosInstance.delete<void>('/users/'+username)
    }

    log_user(user: User) {
        return this.axiosInstance.post<User>('/login_check', user);
    }

    communityUser(username:string) {
        return this.axiosInstance.get<number[]>('/community/'+username);
    }

    findFollow(username1:string, username2:string) {
        return this.axiosInstance.get<string>('/find_follow/'+username1+'/'+username2);
    }
    handleFollow(username1:string, username2:string) {
        return this.axiosInstance.post<string>('/handle_follow/'+username1+'/'+username2);
    }



}