import { useEffect, useState } from "react";
import Table from "../Components/table/Table";
import axios from "axios";
import { DELETE_PRODUCT, ORDERS, UPDATE_PRODUCT_STATUS } from "../Api/Api";
import Cookie from "cookie-universal";
import { toast, ToastContainer } from "react-toastify";
import MoonLoader from "react-spinners/MoonLoader";
import { useDebounce } from "use-debounce";

const Orders = () => {
    const cookie = Cookie();

    const headers = [
        { key: "order_number", label: "Order Number", align: "center", bgColor: "#A8C5DA" },
        { key: "customer", label: "Customer", align: "center", bgColor: "#e5ecf6" },
        { key: "vendor", label: "Vendor", align: "center", bgColor: "#E3F5FF" },
        { key: "total", label: "Total Price", align: "center", bgColor: "#A8C5DA" },
        { key: "promo_code", label: "Promo Code", align: "center", bgColor: "#D8FDEF" },
        { key: "status", label: "Status", align: "center", bgColor: "#D8FDEF" },
        { key: "update_status", label: "Update Status", align: "center", bgColor: "#E3F5FF" },
    ];

    const customStyles = {
        tableStyle: { width: "100%", borderCollapse: "collapse", borderRadius: "10px" },
        headerStyle: { color: "#2D3748", fontWeight: "bold", fontSize: "1em" },
        cellStyle: { padding: "10px", textAlign: "center", fontSize: "0.9em", fontWeight: "500" },
    };

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState("");
    const [search] = useDebounce(searchInput, 500);

    // جلب كل المنتجات
    const getAllOrders = async () => {
        try {
            setLoading(true);
            const res = await axios.get(ORDERS, {
                headers: {
                    Authorization: `Bearer ${cookie.get("admin-token")}`,
                    Accept: "application/json",
                },
            });
            setOrders(res.data.data.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    // جلب المنتجات بالبحث
    const searchorders = async (query) => {
        try {
            setLoading(true);
            const res = await axios.get(`${orders}/search?query=${query}`, {
                headers: {
                    Authorization: `Bearer ${cookie.get("admin-token")}`,
                    Accept: "application/json",
                },
            });

            const result = res.data?.data?.data || []; // لو مفيش بيانات خليه []

            if (result.length > 0) {
                setOrders(result);
            } else {
                setOrders([]); // لو مفيش نتائج
            }

        } catch (err) {
            console.log(err);
            setOrders([]); // لو حصل error خليه فاضي برضه
        } finally {
            setLoading(false);
        }
    };

    console.log(orders)

    // useEffect يتحكم أي دالة تستخدم
    useEffect(() => {
        if (search) {
            searchorders(search);
            console.log("searching...")
        } else {
            getAllOrders();
            // console.log("get all orders")
        }
    }, [search]);

    // delete product
    const handleDelete = (id) => {
        axios
            .delete(`${DELETE_PRODUCT}/${id}`, {
                headers: {
                    Authorization: `Bearer ${cookie.get("admin-token")}`,
                    Accept: "application/json",
                },
            })
            .then((res) => {
                toast.success("Product deleted successfully");
                console.log(res)
                // بعد الحذف، نرجع نجيب نفس الداتا (بحث أو عادي)
                if (search) {
                    searchorders(search);
                } else {
                    getAllOrders();
                }
            })
            .catch((err) => {
                // console.log(err)
                toast.error(err.response?.data?.message || "Failed to delete product");
            });
    };

    // update product status
    const handleUpdateStatus = (id, status) => {
        axios
            .post(`${UPDATE_PRODUCT_STATUS}/${id}`, { status: status }, {
                headers: {
                    Authorization: `Bearer ${cookie.get("admin-token")}`,
                    Accept: "application/json",
                },
            })
            .then(() => {
                toast.success("Product status updated successfully");
                // بعد التحديث، نرجع نجيب نفس الداتا (بحث أو عادي)
                if (search) {
                    searchorders(search);
                } else {
                    getAllOrders();
                }
            })
            .catch(() => {
                toast.error("Failed to update product status");
            });
    };

    // حالة التحميل
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen w-full">
                <MoonLoader color="#038edc" size={80} speedMultiplier={1} />
            </div>
        );
    }

    // console.log(orders)

    return (
        <div className="container mx-auto">
            <ToastContainer theme="colored" position="top-right" autoClose={3000} />

            <div className="container mx-auto">
                <div className="flex justify-between items-center px-5 pt-3">
                    <h1 className="text-3xl font-medium">orders</h1>
                    <input
                        type="text"
                        placeholder="Search orders..."
                        className="border px-3 py-2 rounded-lg shadow-sm outline-none"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                </div>
                {/* // لو البحث فاضي والداتا فاضية (نادرًا يحصل) → لودينج أو لا داتا */}
                {!loading && orders.length === 0 && search ? (
                    <div className="flex justify-center items-center h-screen w-full">
                        <h2 className="text-2xl text-gray-500">
                            No orders found for "{search}"
                        </h2>
                    </div>
                ) : (
                    <Table
                        headers={headers}
                        rows={orders}
                        customStyles={customStyles}
                        route="orders"
                        onDelete={handleDelete}
                        update_status={handleUpdateStatus}
                    />
                )}
            </div>

        </div>
    );
};

export default Orders;
