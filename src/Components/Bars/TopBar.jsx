import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useMenu } from "../../Context/useMenu";  // 👈 استدعاء الـ hook

export default function TopBar() {
    const { setIsOpen } = useMenu(); // 👈 استخدام hook مباشرة

    return (
        <div className="top-bar flex items-center gap-2">
            <Link to={"/"}>
                {/* <img src={logo} alt="logo"
                    width={!isOpen ? "90px" : "218px"}
                    style={{ height: "70px" }}
                /> */}
            </Link>
            <div className="d-flex align-items-center gap-5">
                <FontAwesomeIcon
                    onClick={() => setIsOpen((prev) => !prev)}
                    cursor={"pointer"}
                    icon={faBars}
                />
            </div>
            <div className="w-[60%] h-[100%] flex items-center px-3 justify-between">
                <div className="flex">
                    <p className="text-[14px]">IO Store Dashboard</p>
                </div>
            </div>
        </div>
    );
}
