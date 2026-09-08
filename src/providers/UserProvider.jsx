"use client"

import { useCallback, useState, useEffect } from "react";
import { UserContext } from "@/context/UserContext";
import api from "@/lib/axios";

export default function UserProvider({children}) {
    const [userDetails, setUserDetails] = useState(null);

    const logoutUser = useCallback(async () => {
        try {
            await api.post("/auth/logout");
            setUserDetails(null);
            return true;
        } catch (error) {
            console.error("Logout failed:", error);
            return false;
        }
    }, []);

    const getUserDetails = useCallback(async () => {
        try {
            const [userRes, userQueRes] = await Promise.all(
                [api.get("/auth/me"), api.get("/users/me/questions")]);
            setUserDetails({ user: userRes.data.user, userQuestions: userQueRes.data.userQuestions ?? [] });
        } catch (err) {
            // console.error(err);
            await logoutUser();
        }
    }, [logoutUser]);

    useEffect(() => {
        getUserDetails() 
    }, [getUserDetails]);

    return (
        <UserContext value={{userDetails, getUserDetails, logoutUser}}>
            {children}
        </UserContext>
    )
}