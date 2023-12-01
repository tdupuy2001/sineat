import React from "react"
import { User } from "./dto/User"

export interface MyBlogContextProps {
    user:User|null
    setUser: (user:User|null) => void
    // username: string|null
    // setUsername: (username:string|null) => void
}

export const MyBlogContext = React.createContext<MyBlogContextProps>({user: null, setUser:(u) => {}})