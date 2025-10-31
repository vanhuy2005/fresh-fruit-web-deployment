import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { API_URL } from "../utils/constants";

const SellerStoreControl = () => {
  const navigate = useNavigate();
  const { products, formatPrice, user, token, axios, fetchProducts } =
    useAppContext();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const handleUpdate = async (productId) => {
    if (!user || user.role !== "admin" || !token) {
      return toast.error("Admin login required");
    }
    try {
      const { data } = await axios.get(
        `${API_URL}/admin/product/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success) {
        // Force a hard navigation to /seller
        window.location.href = `/seller?edit=${productId}`;
        // Save the product data to localStorage for the next page
        localStorage.setItem("editProductData", JSON.stringify(data.data));
      } else {
        toast.error("Failed to fetch product details");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to load product details"
      );
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Map categoryType to display names
  const getCategoryDisplay = (categoryType) => {
    const categoryMap = {
      "Vietnamese-Fruits": "Vietnamese Fruits",
      "Imported-Fruits": "Imported Fruits",
      "Dried-Processed": "Dried & Processed",
      "Gift-Baskets": "Gift Baskets",
      "Fresh-Juices": "Fresh Juices",
    };
    return categoryMap[categoryType] || categoryType || "Fruits";
  };

  // Toggle product in-stock (isActive) status via PATCH API
  const toggleStock = async (productId) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return toast.error("Không tìm thấy sản phẩm");
    if (!user || user.role !== "admin" || !token) {
      return toast.error("Cần đăng nhập với quyền admin");
    }
    try {
      const newActive = !product.isActive;
      await axios.patch(
        `${API_URL}/admin/product/${productId}`,
        { isActive: newActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Sản phẩm hiện ${newActive ? "có sẵn" : "không có sẵn"}`);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi cập nhật sản phẩm");
    }
  };

  // Show delete confirmation modal
  const showDeleteConfirmation = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  // Delete product via DELETE API
  const handleDelete = async () => {
    if (!productToDelete) return;
    if (!user || user.role !== "admin" || !token) {
      return toast.error("Admin login required");
    }

    try {
      await axios.delete(`${API_URL}/admin/product/${productToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Product deleted successfully");
      setShowDeleteModal(false);
      setProductToDelete(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <div className="py-8 px-6 md:px-12 bg-white min-h-[calc(100vh-73px)]">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">Tất cả sản phẩm</h2>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Sản phẩm
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Danh mục
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Giá bán
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                  Tồn kho
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={product.image[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {product.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {getCategoryDisplay(product.category)}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                    {formatPrice(product.offerPrice)} VNĐ
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={product.isActive}
                          onChange={() => toggleStock(product._id)}
                        />
                        <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-colors duration-200"></div>
                        <span className="absolute left-1 top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5 shadow-sm"></span>
                      </label>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-1">
                      <button
                        onClick={() => handleUpdate(product._id)}
                        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                        title="Chỉnh sửa sản phẩm"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={() => showDeleteConfirmation(product)}
                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                        title="Xóa sản phẩm"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg mb-4">No products yet</p>
          <p className="text-gray-400">Start by adding your first product</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <div className="relative bg-white rounded-lg w-full max-w-md mx-4 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Xác nhận xóa
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Bạn có chắc chắn muốn xóa{" "}
                <span className="font-medium text-gray-900">
                  {productToDelete?.name}
                </span>
                ? Hành động này không thể hoàn tác.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setProductToDelete(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerStoreControl;
