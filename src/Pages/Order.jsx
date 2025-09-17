import { useEffect, useState } from "react";
import Table from "../Components/table/Table"
import axios from "axios";
import { USERS } from "../Api/Api";
import Cookie from "cookie-universal";
import { Link } from "react-router-dom";
// import MoonLoader from "react-spinners/MoonLoader";

const Users = () => {

    // Cookies
    const cookie = Cookie();

    // Headers of the table
    const headers = [
        { key: "name", label: "اسم المستخدم", align: "left", bgColor: "#A8C5DA" },
        { key: "email", label: "البريد الالكتروني", align: "left", bgColor: "#e5ecf6" },
        { key: "phone", label: "رقم الهاتف", align: "center", bgColor: "#A8C5DA" },
        { key: "created_at", label: "تاريخ الانضمام", align: "center", bgColor: "#D8FDEF" },
        { key: "sign_in_type", label: "نوع الدخول", align: "center", bgColor: "#E3F5FF" },
        { key: "is_verify", label: "الحالة", align: "center", bgColor: "#D8FDEF" },
        { key: "is_completed", label: "مكتمل", align: "center", bgColor: "#E3F5FF" },
    ];

    const customStyles = {
        tableStyle: { width: "100%", borderCollapse: "collapse", borderRadius: "10px" },
        headerStyle: { color: "#2D3748", fontWeight: "bold", fontSize: "1em" },
        cellStyle: { padding: "10px", textAlign: "center", fontSize: "0.9em", fontWeight: "500" },
    };



    const [users, setUsers] = useState([]);

    // getting data from the server
    useEffect(() => {
        axios.get(`${USERS}`, {
            headers: {
                "auth-token": `${cookie.get("admin-token")}`,
                Accept: "application/json",
            },
        }).then((response) => {
            setUsers(response.data.data.data);
        }
        ).catch((error) => {
            console.log(error);
        })
    }, [])

    console.log(users);

    // if (users.length === 0) {
    //     return (
    //         <div className="flex justify-center items-center h-screen w-full">
    //             <MoonLoader
    //                 color="#038edc"
    //                 size={80}
    //                 speedMultiplier={1}
    //             />
    //         </div>
    //     )
    // }



    return (
        <div className="container mx-auto">

            <div className="flex justify-between items-center px-5 pt-3">
                <h1 className="text-3xl font-meduim">المستخدمين</h1>
                <Link to="/users/add" className="btn bg-blue-600  p-3 rounded-xl text-white">اضافة مستخدم</Link>
            </div>
            <Table headers={headers} rows={users} customStyles={customStyles} route="users" />
        </div>
    );
};

export default Users;