import { User } from "./User";

export interface UserProfile {
  user: User;
  main_post_ids: number[];
}