import axios, {AxiosInstance} from 'axios'
import { User } from '../dto/User';
import { UserLogin } from '../dto/UserLogin';

export class UserService {

    private apiUrl: string;
    private axiosInstance: AxiosInstance;
    constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
        this.axiosInstance = axios.create({baseURL: this.apiUrl})
    }

    addUser(user:User) {
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

    log_user(user: UserLogin) {
        return this.axiosInstance.post<User>('/login_check', user);
    }
}