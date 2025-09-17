import { Outlet, useNavigate } from "react-router-dom";
import Cookie from "cookie-universal";
import { useEffect } from "react";

export default function RequireAuth() {
    // Cookies
    const cookie = Cookie();
    const token = cookie.get("admin-token");

    const navigate = useNavigate();

    // Navigate if no token
    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);

    // Render the Outlet only if token exists
    if (!token) {
        return null; // Optionally replace with a spinner/loading indicator
    }

    return <Outlet />;
}