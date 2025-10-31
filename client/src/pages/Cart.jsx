import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";
import { API_URL } from "../utils/constants";

const Cart = () => {
  const navigate = useNavigate();
  const { currency, formatPrice, user, refreshCart } = useAppContext();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState(
    "Thanh toán khi nhận hàng"
  );
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showOrderConfirmModal, setShowOrderConfirmModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    productId: null,
    productName: "",
  });

  // Fetch cart from API
  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_URL}/cart/myCart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setCart(response.data.cart);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        if (error.response?.status === 404) {
          // Cart không tồn tại - đây là trường hợp bình thường cho user mới
          setCart(null);
        } else if (error.response?.status === 401) {
          toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user, navigate]);

  // Handle quantity change
  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      toast.error("Số lượng tối thiểu là 1. Dùng nút xóa để xóa sản phẩm.");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.patch(
        `${API_URL}/cart/${productId}`,
        {
          quantity: newQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        console.log("Update quantity response:", response.data);
        console.log("Cart data:", response.data.cart);
        setCart(response.data.cart);
        toast.success("Đã cập nhật số lượng!");
        refreshCart(); // Instantly update cart count in navbar
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi cập nhật số lượng!"
      );
    }
  };

  // Handle remove item
  const handleRemoveItem = async (productId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.delete(`${API_URL}/cart/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setCart(response.data.cart);
        toast.success("Đã xóa sản phẩm khỏi giỏ hàng!");
        refreshCart(); // Instantly update cart count in navbar
        setDeleteModal({ isOpen: false, productId: null, productName: "" }); // Đóng modal
      }
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi xóa sản phẩm!"
      );
    }
  };

  // Mở modal xác nhận xóa
  const openDeleteModal = (productId, productName) => {
    setDeleteModal({
      isOpen: true,
      productId: productId,
      productName: productName,
    });
  };

  // Đóng modal
  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, productId: null, productName: "" });
  };

  // Handle place order
  const handlePlaceOrder = () => {
    if (!user?.address) {
      toast.error("Vui lòng thêm địa chỉ giao hàng trong Settings!");
      setTimeout(() => navigate("/settings"), 1500);
      return;
    }
    setShowOrderConfirmModal(true);
  };

  const handleConfirmOrder = async () => {
    setIsPlacingOrder(true);
    setShowOrderConfirmModal(false);

    try {
      const token = localStorage.getItem("accessToken");

      // Map payment method from Vietnamese to API format
      const paymentMethodMap = {
        "Thanh toán khi nhận hàng": "cod",
        Online: "online",
      };

      const orderData = {
        shippingAddress: user.address,
        paymentMethod: paymentMethodMap[paymentMethod] || "cod",
        discount: 0,
        notes: "",
      };

      const response = await axios.post(`${API_URL}/order`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success("Đặt hàng thành công!");
        // Reset cart
        setCart(null);
        refreshCart();
        // Navigate to my orders
        setTimeout(() => {
          navigate("/orders");
        }, 500);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Không thể đặt hàng. Vui lòng thử lại!"
      );
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-3xl shadow-xl p-12 max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Vui lòng đăng nhập
          </h2>
          <p className="text-gray-600 mb-6">
            Bạn cần đăng nhập để xem giỏ hàng và đặt hàng
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  // Get cart products
  const cartProducts = cart?.products || [];
  console.log("Cart Products:", cartProducts);

  // Calculate totals
  const subtotal = cart?.totalAmount || 0;
  const shippingFee = 0; // Free shipping
  const totalAmount = subtotal + shippingFee;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Tiêu đề */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Giỏ Hàng
            {cartProducts.length > 0 && (
              <span className="text-lg text-gray-500 font-normal ml-3">
                {cartProducts.length} Sản Phẩm
              </span>
            )}
          </h1>
        </div>

        {cartProducts.length === 0 ? (
          /* Trạng thái giỏ hàng trống */
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <div className="text-7xl mb-6">🛒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Giỏ hàng của bạn đang trống
            </h2>
            <button
              onClick={() => navigate("/products")}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-10 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
            >
              <span>←</span> Tiếp Tục Mua Sắm
            </button>
          </div>
        ) : (
          /* Giỏ hàng có sản phẩm */
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cột trái: Danh sách sản phẩm */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Tiêu đề bảng - chỉ hiển thị trên desktop */}
                <div className="hidden md:grid grid-cols-12 gap-6 px-8 py-5 bg-gray-50 border-b border-gray-200">
                  <div className="col-span-5 text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Chi tiết sản phẩm
                  </div>
                  <div className="col-span-3 text-center text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Tổng tiền
                  </div>
                  <div className="col-span-4 text-center text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Thao tác
                  </div>
                </div>

                {/* Dòng sản phẩm */}
                <div className="divide-y divide-gray-100">
                  {cartProducts.map((item) => {
                    const product = item.productId;

                    // Kiểm tra dữ liệu sản phẩm
                    if (
                      !product ||
                      !product.image ||
                      product.image.length === 0
                    ) {
                      console.warn("Dữ liệu sản phẩm không hợp lệ:", item);
                      return null;
                    }

                    return (
                      <div
                        key={product._id}
                        className="p-6 md:p-8 hover:bg-gray-50 transition-colors"
                      >
                        <div className="grid md:grid-cols-12 gap-6 items-center">
                          {/* Thông tin sản phẩm - 5 cột */}
                          <div className="col-span-12 md:col-span-5">
                            <div className="flex gap-5">
                              {/* Ảnh sản phẩm */}
                              <div
                                className="w-28 h-28 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden cursor-pointer group"
                                onClick={() =>
                                  navigate(`/product/${product._id}`)
                                }
                              >
                                <img
                                  src={product.image[0]}
                                  alt={product.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              </div>

                              {/* Thông tin chi tiết */}
                              <div className="flex-1">
                                <h3 className="font-bold text-gray-800 text-lg mb-2">
                                  {product?.name || "Sản phẩm không xác định"}
                                </h3>
                                <p className="text-sm text-gray-500 mb-3">
                                  {formatPrice(item?.price || 0)} {currency}
                                </p>

                                {/* Điều khiển số lượng */}
                                <div className="flex items-center gap-3">
                                  <span className="text-sm text-gray-600">
                                    Số lượng:
                                  </span>
                                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                    <button
                                      onClick={() =>
                                        handleQuantityChange(
                                          product._id,
                                          (item?.quantity || 1) - 1
                                        )
                                      }
                                      className="px-3 py-1.5 hover:bg-gray-100 transition-colors"
                                    >
                                      <span className="text-gray-600">-</span>
                                    </button>
                                    <span className="px-4 py-1.5 bg-white font-medium text-gray-800 min-w-[40px] text-center">
                                      {item?.quantity || 0}
                                    </span>
                                    <button
                                      onClick={() =>
                                        handleQuantityChange(
                                          product._id,
                                          (item?.quantity || 0) + 1
                                        )
                                      }
                                      className="px-3 py-1.5 hover:bg-gray-100 transition-colors"
                                    >
                                      <span className="text-gray-600">+</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Tổng phụ - 3 cột */}
                          <div className="col-span-6 md:col-span-3 text-left md:text-center">
                            <span className="text-xl font-bold text-gray-800">
                              {formatPrice(
                                (item?.price || 0) * (item?.quantity || 0)
                              )}{" "}
                              {currency}
                            </span>
                          </div>

                          {/* Nút thao tác - 4 cột */}
                          <div className="col-span-6 md:col-span-4 text-left md:text-center">
                            <button
                              onClick={() =>
                                openDeleteModal(product._id, product.name)
                              }
                              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors border border-red-200"
                              title="Xóa toàn bộ sản phẩm này"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              <span className="hidden md:inline text-sm font-medium">
                                Xóa
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Liên kết tiếp tục mua sắm */}
              <button
                onClick={() => navigate("/products")}
                className="mt-6 inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors"
              >
                <span>←</span> Tiếp tục mua sắm
              </button>
            </div>

            {/* Cột phải: Tóm tắt đơn hàng */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-8 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-800 mb-8">
                  Tóm tắt đơn hàng
                </h2>

                {/* Delivery Address Section */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Địa chỉ giao hàng
                    </h3>
                    <button
                      onClick={() => navigate("/settings")}
                      className="text-green-600 hover:text-green-700 text-sm font-semibold transition-colors"
                    >
                      Thay đổi
                    </button>
                  </div>
                  {user?.address ? (
                    <div className="bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-200">
                      <p className="text-lg font-semibold text-gray-900 mb-2">
                        {user.firstName} {user.lastName}
                      </p>

                      {user.phoneNumber && (
                        <p className="text-sm text-gray-700 mb-1">
                          <span className="font-medium text-gray-800">
                            Số điện thoại:
                          </span>{" "}
                          {user.phoneNumber}
                        </p>
                      )}

                      <p className="text-sm text-gray-700">
                        <span className="font-medium text-gray-800">
                          Địa chỉ:
                        </span>{" "}
                        {user.address}
                      </p>
                    </div>
                  ) : (
                    <div className="text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
                      <p>Chưa có địa chỉ giao hàng!</p>
                      <button
                        onClick={() => navigate("/settings")}
                        className="text-green-600 hover:text-green-700 font-semibold mt-1"
                      >
                        Thêm địa chỉ →
                      </button>
                    </div>
                  )}
                </div>

                {/* Payment Method Section */}
                <div className="mb-8">
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                    Phương thức thanh toán
                  </h3>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-700 font-medium"
                  >
                    <option value="Thanh toán khi nhận hàng">
                      Thanh toán khi nhận hàng
                    </option>
                    <option value="Online">Thanh toán online</option>
                  </select>
                </div>

                {/* Danh sách sản phẩm trong đơn hàng */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                    Sản phẩm đặt mua
                  </h3>
                  <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-gray-100 border-b border-gray-200">
                      <div className="col-span-5 text-xs font-semibold text-gray-600 uppercase">
                        Sản phẩm
                      </div>
                      <div className="col-span-3 text-xs font-semibold text-gray-600 uppercase text-right">
                        Đơn giá
                      </div>
                      <div className="col-span-4 text-xs font-semibold text-gray-600 uppercase text-right">
                        Thành tiền
                      </div>
                    </div>

                    {/* Product Rows */}
                    <div className="divide-y divide-gray-200">
                      {cartProducts.map((item) => {
                        const product = item.productId;
                        if (!product) return null;

                        return (
                          <div
                            key={product._id}
                            className="grid grid-cols-12 gap-2 px-3 py-2.5 hover:bg-gray-100 transition-colors"
                          >
                            <div className="col-span-5 text-xs text-gray-800">
                              <div className="font-medium line-clamp-2">
                                {product.name}
                              </div>
                              <div className="text-gray-500 mt-0.5">
                                x{item.quantity}
                              </div>
                            </div>
                            <div className="col-span-3 text-xs text-gray-700 text-right self-center">
                              {formatPrice(item.price)}
                            </div>
                            <div className="col-span-4 text-xs font-semibold text-gray-900 text-right self-center">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tạm tính</span>
                    <span className="font-semibold text-gray-800">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span className="text-green-600 font-semibold">
                      Miễn phí
                    </span>
                  </div>
                </div>

                {/* Total Amount */}
                <div className="flex justify-between items-center mb-8">
                  <span className="text-lg font-bold text-gray-800">
                    Tổng cộng:
                  </span>
                  <span className="text-2xl font-bold text-gray-800">
                    {formatPrice(totalAmount)}
                  </span>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isPlacingOrder ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang xử lý...
                    </span>
                  ) : (
                    "Đặt hàng"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal xác nhận đặt hàng */}
      {showOrderConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 rounded-full p-3">
                <svg
                  className="w-12 h-12 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Tiêu đề */}
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Xác nhận đặt hàng
            </h3>

            {/* Nội dung */}
            <div className="text-sm text-gray-600 mb-6 space-y-2">
              <p className="text-center mb-4">
                Bạn có chắc chắn muốn đặt hàng với thông tin sau?
              </p>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Địa chỉ:</span>
                  <span className="text-right max-w-[60%] text-gray-800">
                    {user?.address}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Thanh toán:</span>
                  <span className="text-gray-800">{paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">
                    Số sản phẩm:
                  </span>
                  <span className="text-gray-800">
                    {cartProducts.length} sản phẩm
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="font-bold text-gray-800">Tổng tiền:</span>
                  <span className="font-bold text-blue-600">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowOrderConfirmModal(false)}
                disabled={isPlacingOrder}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmOrder}
                disabled={isPlacingOrder}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {isPlacingOrder ? "Đang xử lý..." : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            {/* Icon cảnh báo */}
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 rounded-full p-3">
                <svg
                  className="w-12 h-12 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
            </div>

            {/* Tiêu đề */}
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Xác nhận xóa sản phẩm
            </h3>

            {/* Nội dung */}
            <p className="text-gray-600 text-center mb-6">
              Bạn có chắc chắn muốn xóa sản phẩm{" "}
              <span className="font-semibold text-gray-900">
                "{deleteModal.productName}"
              </span>{" "}
              khỏi giỏ hàng?
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={closeDeleteModal}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
              >
                Hủy
              </button>
              <button
                onClick={() => handleRemoveItem(deleteModal.productId)}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
