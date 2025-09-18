import { useEffect, useState } from "react";
import Table from "../Components/table/Table";
import axios from "axios";
import { SEARCH_ORDERS, ORDERS, UPDATE_PRODUCT_STATUS, UPDATE_ORDER_STATUS, ORDER_DETIALS, FILTER_ORDERS_BY_DATE } from "../Api/Api";
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
        { key: "show", label: "Show", align: "right", bgColor: "#A8C5DA" },
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
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");


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

    // جلب تفاصيل الطلب
    const getOrderDetails = async (id) => {
        try {
            setLoading(true);
            const res = await axios.get(
                `${ORDER_DETIALS}/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${cookie.get("admin-token")}`,
                        Accept: "application/json",
                    },
                }
            );
            setSelectedOrder(res.data.data); // خزن البيانات
            setShowModal(true); // افتح المودال
        } catch (err) {
            console.log(err);
            toast.error("Failed to fetch order details");
        } finally {
            setLoading(false);
        }
    };

    // جلب المنتجات بالبحث
    const searchorders = async (query) => {
        try {
            setLoading(true);
            const res = await axios.get(`${SEARCH_ORDERS}?query=${query}`, {
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

    // filter orders by date range
    const filterOrdersByDate = async (startDate, endDate) => {
        try {
            setLoading(true);
            const res = await axios.post(
                `${FILTER_ORDERS_BY_DATE}`,
                {
                    start_date: startDate,
                    end_date: endDate,
                },
                {
                    headers: {
                        Authorization: `Bearer ${cookie.get("admin-token")}`,
                        Accept: "application/json",
                    },
                }
            );

            const result = res.data?.data?.data || [];

            if (result.length > 0) {
                setOrders(result);
            } else {
                setOrders([]);
            }
        } catch (err) {
            console.log(err);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };


    // update product status
    const handleUpdateStatus = (id, status) => {
        axios
            .post(`${UPDATE_ORDER_STATUS}/${id}`, { status: status }, {
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
                    <div className="flex gap-4 items-center px-5 pt-3">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border px-3 py-2 rounded-lg shadow-sm outline-none"
                        />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border px-3 py-2 rounded-lg shadow-sm outline-none"
                        />
                        <button
                            onClick={() => filterOrdersByDate(startDate, endDate)}
                            className="bg-[#038edc] hover:bg-[#0277bd] text-white px-4 py-2 rounded-lg transition"
                        >
                            Filter
                        </button>
                    </div>

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
                        update_status={handleUpdateStatus}
                        onShow={getOrderDetails}
                    />
                )}
            </div>

            {showModal && selectedOrder && (
                <div className="fixed inset-0  flex items-center justify-center z-55550 shadow-lg"
                    style={{ background: "rgba(0, 0, 0, 0.6)" }}
                >
                    <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-h-[80vh] overflow-y-auto"

                    >
                        {/* Title */}
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                            Order Details - #{selectedOrder.order_number}
                        </h2>

                        {/* Order Info */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <p><b>Status:</b> <span className="capitalize">{selectedOrder.status}</span></p>
                            <p><b>Total:</b> {selectedOrder.total} EGP</p>
                            <p><b>Date:</b> {selectedOrder.created_at}</p>
                            <p><b>Promo Code:</b> {selectedOrder.promo_code || "None"}</p>
                            <p><b>Customer:</b> {selectedOrder.customer?.name}</p>
                            <p><b>Vendor:</b> {selectedOrder.vendor?.name}</p>
                        </div>

                        {/* Items */}
                        <h3 className="text-xl font-bold mb-3">Items</h3>
                        <div className="space-y-4">
                            {selectedOrder.items?.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between border-b pb-3"
                                >
                                    {/* صورة المنتج */}
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-20 h-20 object-cover rounded-md border"
                                    />

                                    {/* تفاصيل المنتج */}
                                    <div className="flex-1 px-4">
                                        <p className="font-semibold text-gray-700">{item.name}</p>
                                        <p className="text-sm text-gray-500">
                                            Quantity: {item.quantity}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Price: {item.price} EGP
                                        </p>
                                    </div>

                                    {/* العمولة */}
                                    <p className="font-medium text-gray-600">
                                        Commission: {item.product_commission} EGP
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Close Button */}
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Orders;
