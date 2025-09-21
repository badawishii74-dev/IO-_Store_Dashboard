import { useState } from "react";
import { MenuContext } from "./MenuContext";

export const MenuProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <MenuContext.Provider value={{ isOpen, setIsOpen }}>
            {children}
        </MenuContext.Provider>
    );
};
