import { useEffect, useState } from "react";
import Table from "../../Components/table/Table";
import axios from "axios";
import { DELETE_PRODUCT, PRODUCTS } from "../../Api/Api";
import Cookie from "cookie-universal";
import { toast } from "react-toastify";
import MoonLoader from "react-spinners/MoonLoader";
import { useDebounce } from "use-debounce";

const Products = () => {
    const cookie = Cookie();

    const headers = [
        { key: "name", label: "Product Name", align: "left", bgColor: "#A8C5DA" },
        { key: "price", label: "Price", align: "left", bgColor: "#e5ecf6" },
        { key: "main_category", label: "Main Category", align: "center", bgColor: "#A8C5DA" },
        { key: "status", label: "Status", align: "center", bgColor: "#D8FDEF" },
        { key: "vendor", label: "Vendor", align: "center", bgColor: "#E3F5FF" },
        { key: "update_status", label: "Update Status", align: "center", bgColor: "#E3F5FF" },
        { key: "delete", label: "delete", align: "center", bgColor: "#D8FDEF" },
    ];

    const customStyles = {
        tableStyle: { width: "100%", borderCollapse: "collapse", borderRadius: "10px" },
        headerStyle: { color: "#2D3748", fontWeight: "bold", fontSize: "1em" },
        cellStyle: { padding: "10px", textAlign: "center", fontSize: "0.9em", fontWeight: "500" },
    };

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState("");
    const [search] = useDebounce(searchInput, 500);

    // جلب كل المنتجات
    const getAllProducts = async () => {
        try {
            setLoading(true);
            const res = await axios.get(PRODUCTS, {
                headers: {
                    Authorization: `Bearer ${cookie.get("admin-token")}`,
                    Accept: "application/json",
                },
            });
            setProducts(res.data.data.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    // جلب المنتجات بالبحث
    // جلب المنتجات بالبحث
    const searchProducts = async (query) => {
        try {
            setLoading(true);
            const res = await axios.get(`${PRODUCTS}/search?query=${query}`, {
                headers: {
                    Authorization: `Bearer ${cookie.get("admin-token")}`,
                    Accept: "application/json",
                },
            });

            const result = res.data?.data?.data || []; // لو مفيش بيانات خليه []

            if (result.length > 0) {
                setProducts(result);
            } else {
                setProducts([]); // لو مفيش نتائج
            }

        } catch (err) {
            console.log(err);
            setProducts([]); // لو حصل error خليه فاضي برضه
        } finally {
            setLoading(false);
        }
    };


    // useEffect يتحكم أي دالة تستخدم
    useEffect(() => {
        if (search) {
            searchProducts(search);
            console.log("searching...")
        } else {
            getAllProducts();
            console.log("get all products")
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
            .then(() => {
                toast.success("Product deleted successfully");
                // بعد الحذف، نرجع نجيب نفس الداتا (بحث أو عادي)
                if (search) {
                    searchProducts(search);
                } else {
                    getAllProducts();
                }
            })
            .catch(() => {
                toast.error("Failed to delete product");
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

    // console.log(products)

    return (
        <div className="container mx-auto">


            <div className="container mx-auto">
                <div className="flex justify-between items-center px-5 pt-3">
                    <h1 className="text-3xl font-medium">Products</h1>
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="border px-3 py-2 rounded-lg shadow-sm outline-none"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                </div>
                {/* // لو البحث فاضي والداتا فاضية (نادرًا يحصل) → لودينج أو لا داتا */}
                {!loading && products.length === 0 && search ? (
                    <div className="flex justify-center items-center h-screen w-full">
                        <h2 className="text-2xl text-gray-500">
                            No products found for "{search}"
                        </h2>
                    </div>
                ) : (
                    <Table
                        headers={headers}
                        rows={products}
                        customStyles={customStyles}
                        route="products"
                        onDelete={handleDelete}
                    />
                )}
            </div>

        </div>
    );
};

export default Products;
