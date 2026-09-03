"use client"

import { useState } from "react";
import { UserContext } from "@/context/UserContext";

export default function UserProvider({children}) {
    const [user, setUser] = useState(null);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    async function getUser() {
        try {
            const response = await fetch(`${API_URL}/auth/me`, { credentials: "include" });
            const result = await response.json();
            setUser(result);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <UserContext value={{user, getUser}}>
            {children}
        </UserContext>
    )
}