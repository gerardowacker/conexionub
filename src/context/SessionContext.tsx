"use client";

import React, {createContext, useContext, useEffect, useState, ReactNode} from "react";
import {post} from "@/utils/request";

type User = {
    email: string;
    displayName: string;
    subscriptions?: string[];
    level: number;
}
type SessionContextType = {
    user: User | null;
    token: string | null;
    clientToken: string | null;
    login: (email: string, password: string) => Promise<User>;
    logout: (single?: boolean) => Promise<void>;
    localLogout: () => void;
};

export const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({children}: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [clientToken, setClientToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("__lorest");
        const storedClientToken = localStorage.getItem("__lore_client");

        if (storedToken && storedClientToken) {
            setToken(storedToken);
            setClientToken(storedClientToken);

            post("/user/get", {token: storedToken, clientToken: storedClientToken}).then((result) => {
                if (result.response.status === 200) {
                    setUser(result.response.data);
                } else {
                    if (result.response.status === 498) localLogout();
                    setUser(null);
                    console.error(result.response.data.error);
                }
            });
        }
    }, []);

    const saveSession = (token: string, clientToken: string) => {
        localStorage.setItem("__lorest", token);
        localStorage.setItem("__lore_client", clientToken);
    };

    const login = async (email: string, password: string): Promise<User> => {
        const res = await post("/login", {email, password});
        if (res.response.status !== 200) throw new Error(res.response.data.error);

        const {session, user} = res.response.data;
        setToken(session.token);
        setClientToken(session.clientToken);
        setUser(user);
        saveSession(session.token, session.clientToken);
        return user;
    };

    const logout = async (single: boolean = true) => {
        try {
            if (!token || !clientToken) {
                console.warn("Faltan parámetros para logout — se hará logout local.");
                localLogout();
                return;
            }
            const res = await post("/logout", {token, clientToken, single});

            if (!res?.response || res.response.status !== 200) {
                const msg = res?.response?.data?.error || "Error desconocido al cerrar sesión.";
                console.warn("Logout remoto falló:", msg);
            }
        } catch (err) {
            console.error("Error durante logout:", err);
        } finally {
            localLogout();
        }
    };

    const localLogout = () => {
        localStorage.removeItem("__lorest");
        localStorage.removeItem("__lore_client");
        window.location.reload();
        setToken(null);
        setClientToken(null);
        setUser(null);
    };

    return (
        <SessionContext.Provider value={{user, token, clientToken, login, logout, localLogout}}>
            {children}
        </SessionContext.Provider>
    );
}

export const useSession = () => {
    const context = useContext(SessionContext);
    if (!context) throw new Error("useSession must be used within a SessionProvider");
    return context;
};
