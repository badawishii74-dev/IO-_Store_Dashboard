import { useEffect, useState } from "react";
import Table from "../Components/table/Table";
import axios from "axios";
import { UPDATE_ORDER_STATUS, ORDER_DETIALS, VENDORS, VENDOR_DETAILS, UPDATE_VENDOR_STATUS, DELETE_VENDORS } from "../Api/Api";
import Cookie from "cookie-universal";
import { toast, ToastContainer } from "react-toastify";
import MoonLoader from "react-spinners/MoonLoader";


const Vendors = () => {
    const cookie = Cookie();

    const headers = [
        { key: "name", label: "Name", align: "center", bgColor: "#A8C5DA" },
        { key: "store_name", label: "Store Name", align: "center", bgColor: "#e5ecf6" },
        { key: "profile_image", label: "Profile Image", align: "center", bgColor: "#E3F5FF" },
        { key: "update_status", label: "Update Status", align: "center", bgColor: "#E3F5FF" },
        { key: "show", label: "Show", align: "right", bgColor: "#A8C5DA" },
        { key: "delete", label: "Delete", align: "right", bgColor: "#D8FDEF" },
    ];

    const customStyles = {
        tableStyle: { width: "100%", borderCollapse: "collapse", borderRadius: "10px" },
        headerStyle: { color: "#2D3748", fontWeight: "bold", fontSize: "1em" },
        cellStyle: { padding: "10px", textAlign: "center", fontSize: "0.9em", fontWeight: "500" },
    };

    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedVendor, setSelectedVendor] = useState(null);
    const [showModal, setShowModal] = useState(false);



    // جلب كل المنتجات
    const getAllvendors = async () => {
        try {
            setLoading(true);
            const res = await axios.get(VENDORS, {
                headers: {
                    Authorization: `Bearer ${cookie.get("admin-token")}`,
                    Accept: "application/json",
                },
            });
            setVendors(res.data.vendors);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllvendors();
    }, []);

    // جلب تفاصيل الطلب
    const getOrderDetails = async (id) => {
        try {
            setLoading(true);
            const res = await axios.get(
                `${VENDOR_DETAILS}/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${cookie.get("admin-token")}`,
                        Accept: "application/json",
                    },
                }
            );
            setSelectedVendor(res.data.data); // خزن البيانات
            setShowModal(true); // افتح المودال
        } catch (err) {
            console.log(err);
            toast.error("Failed to fetch order details");
        } finally {
            setLoading(false);
        }
    };

    console.log(vendors)


    // update product status
    const handleUpdateStatus = (id, status) => {
        axios
            .post(`${UPDATE_VENDOR_STATUS}/${id}`, { status: status }, {
                headers: {
                    Authorization: `Bearer ${cookie.get("admin-token")}`,
                    Accept: "application/json",
                },
            })
            .then(() => {
                toast.success("Product status updated successfully");
                // بعد التحديث، نرجع نجيب نفس الداتا (بحث أو عادي)
                getAllvendors();
            })
            .catch(() => {
                toast.error("Failed to update product status");
            });
    };

    // delete product
    const handleDelete = (id) => {
        axios
            .delete(`${DELETE_VENDORS}/${id}`, {
                headers: {
                    Authorization: `Bearer ${cookie.get("admin-token")}`,
                    Accept: "application/json",
                },
            })
            .then((res) => {
                toast.success("Vendor deleted successfully");
                console.log(res)
                getAllvendors();
            })
            .catch((err) => {
                // console.log(err)
                toast.error(err.response?.data?.message || "Failed to delete vendor");
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

    // console.log(vendors)

    return (
        <div className="container mx-auto">
            <ToastContainer theme="colored" position="top-right" autoClose={3000} />

            <div className="container mx-auto">
                <div className="flex justify-between items-center px-5 pt-3">
                    <h1 className="text-3xl font-medium">Vendors</h1>
                </div>
                <Table
                    headers={headers}
                    rows={vendors}
                    customStyles={customStyles}
                    route="vendors"
                    onDelete={handleDelete}
                    update_status={handleUpdateStatus}
                    onShow={getOrderDetails}
                />

            </div>

            {showModal && selectedVendor && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-55550 shadow-lg"
                    style={{ background: "rgba(0, 0, 0, 0.6)" }}
                >
                    <div className="bg-white p-6 rounded-lg shadow-lg w-4/5 max-h-[90vh] overflow-y-auto">
                        {/* Title */}
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                            Vendor Details - {selectedVendor.name}
                        </h2>

                        {/* Vendor Info */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <p><b>Store Name:</b> {selectedVendor.store_name}</p>
                                <p><b>Email:</b> {selectedVendor.email}</p>
                                <p><b>Phone:</b> {selectedVendor.phone}</p>
                                <p><b>Address:</b> {selectedVendor.address}</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <img
                                    src={selectedVendor.profile_image}
                                    alt={selectedVendor.name}
                                    className="w-32 h-32 rounded-full border shadow-md object-cover"
                                />
                                <p className="mt-2 text-sm text-gray-500">
                                    Delivery in {selectedVendor.expected_delivery_time} days
                                </p>
                            </div>
                        </div>

                        {/* Commission Plans */}
                        <h3 className="text-xl font-bold mb-3">Commission Plans</h3>
                        {selectedVendor.commission_plans?.map((plan) => (
                            <div key={plan.id} className="mb-4 border rounded-lg p-4 shadow-sm">
                                <p className="font-semibold text-gray-700 mb-2">
                                    Type: {plan.commission_type}
                                </p>
                                {plan.ranges?.length > 0 && (
                                    <table className="w-full text-sm border-collapse">
                                        <thead>
                                            <tr className="bg-gray-100 text-gray-700">
                                                <th className="border px-3 py-2">Min</th>
                                                <th className="border px-3 py-2">Max</th>
                                                <th className="border px-3 py-2">Percentage</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {plan.ranges.map((range) => (
                                                <tr key={range.id}>
                                                    <td className="border px-3 py-2">{range.min}</td>
                                                    <td className="border px-3 py-2">{range.max}</td>
                                                    <td className="border px-3 py-2">{range.percentage}%</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        ))}

                        {/* Products */}
                        <h3 className="text-xl font-bold mb-3 mt-6">Products</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedVendor.products?.map((product) => (
                                <div
                                    key={product.id}
                                    className="border p-4 rounded-lg shadow-sm flex flex-col justify-between"
                                >
                                    <div>
                                        <h4 className="font-semibold text-gray-800">{product.name}</h4>
                                        <p className="text-sm text-gray-500 mb-1">
                                            {product.description}
                                        </p>
                                        <p className="text-gray-700 font-medium">Price: {product.price} EGP</p>
                                        <p className="text-sm">
                                            Status:{" "}
                                            <span
                                                className={`px-2 py-1 rounded text-white ${product.status === "approved"
                                                    ? "bg-green-500"
                                                    : product.status === "pending"
                                                        ? "bg-yellow-500"
                                                        : "bg-red-500"
                                                    }`}
                                            >
                                                {product.status}
                                            </span>
                                        </p>
                                        <p className="text-sm mt-1">
                                            Active:{" "}
                                            <span
                                                className={`font-medium ${product.is_active === "active"
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                                    }`}
                                            >
                                                {product.is_active}
                                            </span>
                                        </p>
                                    </div>
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

export default Vendors;
