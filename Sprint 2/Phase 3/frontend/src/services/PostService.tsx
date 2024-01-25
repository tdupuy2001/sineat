import axios, { AxiosInstance } from "axios";
import { Post } from "../dto/Post";
import { PostAdd } from "../dto/PostAdd";
import { UserInfo } from "../dto/UserInfo";
import { IdPost } from "../dto/IdPost";

export class PostService {
  private apiUrl: string;
  private axiosInstance: AxiosInstance;
  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
    this.axiosInstance = axios.create({ baseURL: this.apiUrl });
  }

  addPost(post: PostAdd) {
    return this.axiosInstance.post<Post>("/posts", post);
  }

  postPostsByIds(ids_post: IdPost) {
    return this.axiosInstance.post<Post[]>("/postsById", ids_post);
  }

  getPosts() {
    return this.axiosInstance.get<Post[]>("/posts");
  }

  updatePost(id_post: number, post: Post) {
    return this.axiosInstance.put<Post>("/posts/" + id_post, post);
  }

  deletePost(id_post: number) {
    return this.axiosInstance.delete<void>("/posts/" + id_post);
  }

  getPostComments(id_post: number) {
    return this.axiosInstance.get<Post[]>("/posts/" + id_post + "/comments");
  }

  getUserFromPost(id_post: number) {
    return this.axiosInstance.get<UserInfo>("/posts/" + id_post + "/user");
  }

  addComment(post1: Post, post2: PostAdd) {
    return this.axiosInstance.post<Post>("/posts/comment", { post1, post2 });
  }

  // test pour la pagination
  getPostsPerPage(
    page: number,
    limit: number,
    sortOrder: string,
    type: string | null
  ) {
    let url = `/page?page=${page}&limit=${limit}&sortOrder=${sortOrder}`;
    if (type) {
      url += `&type=${type}`;
    }
    return this.axiosInstance.get(url);
  }
}
