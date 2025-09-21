import { useContext } from "react";
import { WindowContext } from "./WindowContext";

export const useWindowSize = () => {
    const context = useContext(WindowContext);
    if (context === undefined) {
        throw new Error("useWindowSize must be used within a WindowProvider");
    }
    return context;
};
