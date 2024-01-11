import axios, {AxiosInstance} from 'axios'
import { Post } from '../dto/Post';
import { User } from '../dto/User';
import { Like } from '../dto/Like';

export class LikeService {

    private apiUrl: string;
    private axiosInstance: AxiosInstance;
    constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
        this.axiosInstance = axios.create({baseURL: this.apiUrl})
    }

    addLike(like:Like) {
        return this.axiosInstance.post<Like>('/likes', like);
    }

    getLikes() {
        return this.axiosInstance.get<Like[]>('/likes');
    }

    getPostLikes(id_post: number) {
        return this.axiosInstance.get<Like[]>('likes/'+id_post)
    }

    deletePost(id_post:number, id_user:number) {
        return this.axiosInstance.delete<void>('/likes/'+id_post+'/'+id_user);
    }

}
