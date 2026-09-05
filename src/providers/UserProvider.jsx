"use client"

import { useState } from "react";
import { UserContext } from "@/context/UserContext";
import api from "@/lib/axios";

export default function UserProvider({children}) {
    const [user, setUser] = useState(null);

    async function getUser() {
        try {
            const { data } = await api.get("/auth/me");
            setUser(data.user);
        } catch (err) {
            console.error(err);
        }
    }

    async function logoutUser() {
        try {
            await api.post("/auth/logout");
            setUser(null);
            return true;
        } catch (error) {
            console.error("Logout failed:", error);
            return false;
        }
    }

    return (
        <UserContext value={{user, getUser, logoutUser}}>
            {children}
        </UserContext>
    )
}