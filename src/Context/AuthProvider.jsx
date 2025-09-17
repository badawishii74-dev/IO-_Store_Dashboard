import { useState } from "react";
import { BASE } from "../Api/Api";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async (email, password) => {
        const response = await fetch(`${BASE}/admin/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            localStorage.setItem("admin-token", JSON.stringify(userData.token));
            return true;
        }

        return false;
    };

    const logout = () => {
        setUser(null);
    };

    const isAuthenticated = localStorage.getItem("admin-token") !== null;

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};
