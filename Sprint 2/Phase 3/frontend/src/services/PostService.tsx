import axios, {AxiosInstance} from 'axios'
import { Post } from '../dto/Post';
import { User } from '../dto/User';
import { UserInfo } from '../dto/UserInfo';

export class PostService {

    private apiUrl: string;
    private axiosInstance: AxiosInstance;
    constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
        this.axiosInstance = axios.create({baseURL: this.apiUrl})
    }

    addPost(post:Post) {
        return this.axiosInstance.post<Post>('/posts', post);
    }

    getPost(id_post:number) {
        return this.axiosInstance.get<Post>('/posts/'+id_post);
    }

    getPosts() {
        return this.axiosInstance.get<Post[]>('/posts');
    }

    updatePost(id_post:number, post:Post) {
        return this.axiosInstance.put<Post>('/posts/'+id_post, post);
    }

    deletePost(id_post:number) {
        return this.axiosInstance.delete<void>('/posts/'+id_post);
    }

    getPostComments(id_post:number) {
        return this.axiosInstance.get<Post []>('/posts/'+id_post+'/comments');
    }

    getUserFromPost(id_post:number) {
        return this.axiosInstance.get<UserInfo>('/posts/'+id_post+'/user');
    }
}
