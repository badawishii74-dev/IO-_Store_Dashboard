import { useEffect, useState } from "react";
import Table from "../Components/table/Table";
import axios from "axios";
import { ADD_CATEGORY, CATEGORIES, UPDATE_CATEGORY } from "../Api/Api";
import Cookie from "cookie-universal";
import { toast, ToastContainer } from "react-toastify";
import MoonLoader from "react-spinners/MoonLoader";
import { CiGlass } from "react-icons/ci";

const Categories = () => {
    const cookie = Cookie();

    const headers = [
        { key: "id", label: "ID", align: "center", bgColor: "#A8C5DA" },
        { key: "name", label: "Name", align: "right", bgColor: "#e5ecf6" },
        { key: "icon", label: "Icon", align: "center", bgColor: "#E3F5FF" },
        { key: "actions", label: "Actions", align: "center", bgColor: "#FCE4EC" },
    ];

    const customStyles = {
        tableStyle: { width: "100%", borderCollapse: "collapse", borderRadius: "10px" },
        headerStyle: { color: "#2D3748", fontWeight: "bold", fontSize: "1em" },
        cellStyle: { padding: "10px", textAlign: "center", fontSize: "0.9em", fontWeight: "500" },
    };

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState("add"); // 'add' or 'edit'
    const [formData, setFormData] = useState({ name: "", icon: null });
    const [editId, setEditId] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const IMAGE_BASE_URL = "https://yourdomain.com/uploads/categories/"; // غيّر حسب سيرفرك

    // جلب البيانات
    const getAllCategories = async () => {
        try {
            setLoading(true);
            const res = await axios.get(CATEGORIES, {
                headers: {
                    Authorization: `Bearer ${cookie.get("admin-token")}`,
                    Accept: "application/json",
                },
            });
            setCategories(res.data.mainCategories.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllCategories();
    }, []);

    // إضافة تصنيف
    const addCategory = async () => {
        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("icon", formData.icon);

            await axios.post(ADD_CATEGORY, data, {
                headers: {
                    Authorization: `Bearer ${cookie.get("admin-token")}`,
                    Accept: "application/json",
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Category added successfully");
            getAllCategories();
            closeModal();
        } catch (err) {
            toast.error("Failed to add category");
            console.error(err);
        }
    };

    // تعديل تصنيف - الاسم فقط بدون رفع صورة
    const updateCategory = async () => {
        try {
            const payload = { name: formData.name };

            await axios.post(`${UPDATE_CATEGORY}/${editId}`, payload, {
                headers: {
                    Authorization: `Bearer ${cookie.get("admin-token")}`,
                    Accept: "application/json",
                },
            });

            toast.success("Category updated successfully");
            getAllCategories();
            closeModal();
        } catch (err) {
            toast.error("Failed to update category");
            console.error(err);
        }
    };

    // حذف تصنيف
    const deleteCategory = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;

        try {
            await axios.delete(`${CATEGORIES}/${id}`, {
                headers: {
                    Authorization: `Bearer ${cookie.get("admin-token")}`,
                    Accept: "application/json",
                },
            });
            toast.success("Category deleted successfully");
            getAllCategories();
        } catch (err) {
            toast.error("Failed to delete category");
            console.error(err);
        }
    };

    // فتح مودال الإضافة
    const openAddModal = () => {
        setFormData({ name: "", icon: null });
        setImagePreview(null);
        setModalType("add");
        setIsModalOpen(true);
    };

    // فتح مودال التعديل
    const openEditModal = (category) => {
        setFormData({ name: category.name, icon: null });
        setImagePreview(category.icon ? `${IMAGE_BASE_URL}${category.icon}` : null);
        setEditId(category);
        setModalType("edit");
        setIsModalOpen(true);
    };
    console.log(editId)

    // إغلاق المودال
    const closeModal = () => {
        setIsModalOpen(false);
        setEditId(null);
        setImagePreview(null);
    };

    // التعامل مع تغيير الصورة عند الإضافة
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, icon: file });

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    // إرسال الفورم
    const handleSubmit = (e) => {
        e.preventDefault();
        if (modalType === "add") {
            addCategory();
        } else {
            updateCategory();
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen w-full">
                <MoonLoader color="#038edc" size={80} speedMultiplier={1} />
            </div>
        );
    }

    return (
        <div className="container mx-auto">
            <ToastContainer theme="colored" position="top-right" autoClose={3000} />

            <div className="flex justify-between items-center px-5 pt-3">
                <h1 className="text-3xl font-medium">Categories</h1>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={openAddModal}
                >
                    + Add Category
                </button>
            </div>

            <Table
                headers={headers}
                rows={categories}
                route={"Categories"}
                customStyles={customStyles}
                onDelete={deleteCategory}
                OnUpdate={openEditModal} // اربط زر التعديل بفتح المودال
            />

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-55505"   style={{ background: "rgba(0, 0, 0, 0.6)" }}>
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">
                            {modalType === "add" ? "Add Category" : "Edit Category"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700">Name:</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            {/* عرض رفع الصورة فقط في حالة الإضافة */}
                            {modalType === "add" && (
                                <div>
                                    <label className="block text-gray-700">Icon (image):</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                        onChange={handleImageChange}
                                        required
                                    />
                                </div>
                            )}

                            {/* عرض المعاينة */}
                            {imagePreview && (
                                <div className="mt-2">
                                    <label className="block text-gray-700 mb-1">
                                        {modalType === "add" ? "Preview:" : "Current Icon:"}
                                    </label>
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-20 h-20 object-cover rounded"
                                    />
                                </div>
                            )}

                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    className="bg-gray-400 text-white px-4 py-2 rounded"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded"
                                >
                                    {modalType === "add" ? "Add" : "Update"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categories;
