import "./Bars.css";
import { NavLink } from "react-router-dom";
import { CiLogout } from "react-icons/ci";
import Cookie from "cookie-universal";
import { links } from "./Links";

// 👇 استدعاء الـ hooks بدل useContext مباشرة
import { useMenu } from "../../Context/useMenu";
import { useWindowSize } from "../../Context/useWindowSize";

export default function SideBar() {
    const { isOpen } = useMenu();           // من MenuContext
    const { windowSize } = useWindowSize(); // من WindowContext
    const cookie = Cookie();

    return (
        <div>
            {/* خلفية شفافة عند فتح القائمة في الشاشات الصغيرة */}
            <div
                style={{
                    position: "fixed",
                    top: "70px",
                    right: "0",
                    width: "100%",
                    height: "100vh",
                    zIndex: "1",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    display:
                        windowSize < 768
                            ? isOpen
                                ? "block"
                                : "none"
                            : "none",
                }}
            ></div>

            {/* القائمة الجانبية */}
            <div
                className="side-bar"
                style={{
                    right: windowSize < 768 ? (isOpen ? "0" : "-220px") : "0",
                    width: isOpen ? "220px" : "fit-content",
                    position: windowSize < 768 ? "fixed" : "sticky",
                }}
            >
                <div className="mt-4">
                    {links.map((link, key) => (

                        <NavLink
                            key={key}
                            to={link.path}
                            className="flex px-2 py-2 items-center gap-2 my-2 hover:bg-[#E5ECF6] transition rounded"
                        >
                            <i

                                className={`${link.icon} text-gray-400 hover:text-[#E5ECF6] transition`}

                            />
                            <p style={{ display: isOpen ? "block" : "none" }}>
                                {link.name}
                            </p>
                        </NavLink>
                    ))}
                </div>

                {/* logout */}
                <div
                    onClick={() => {
                        cookie.remove("admin-token");
                        window.location.href = "/login";
                    }}
                    className="cursor-pointer flex px-4 py-2 items-center gap-2 my-2 hover:text-[#038edc] transition rounded fixed bottom-0 w-fit"
                >
                    <CiLogout
                        style={{
                            fontSize: "20px",
                            fontWeight: "bold",
                        }}
                    />
                    <p style={{ display: isOpen ? "block" : "none" }}>
                        Log Out
                    </p>
                </div>
            </div>
        </div>
    );
}
