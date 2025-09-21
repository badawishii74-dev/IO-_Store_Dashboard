import { useEffect, useState } from "react";
import { WindowContext } from "./WindowContext";

export const WindowProvider = ({ children }) => {
    const [windowSize, setWindowSize] = useState(window.innerWidth);

    useEffect(() => {
        function setWindowWidth() {
            setWindowSize(window.innerWidth);
        }

        // Listen for window resize
        window.addEventListener("resize", setWindowWidth);

        // Cleanup
        return () => window.removeEventListener("resize", setWindowWidth);
    }, []);

    return (
        <WindowContext.Provider value={{ windowSize, setWindowSize }}>
            {children}
        </WindowContext.Provider>
    );
};
