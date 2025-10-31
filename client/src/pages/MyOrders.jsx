import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";
import OrderCard from "../components/OrderCard";
import { API_URL } from "../utils/constants";

const MyOrders = () => {
  const navigate = useNavigate();
  const { formatPrice, user } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${API_URL}/order/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Xử lý cả trường hợp success: true và success: false (không có đơn hàng)
        setOrders(response.data.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        // Nếu lỗi 404 (không có đơn hàng) thì set orders = []
        if (error.response?.status === 404) {
          setOrders([]);
        } else {
          toast.error("Không thể tải đơn hàng");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // Check if user is logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-3xl shadow-xl p-12 max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Vui lòng đăng nhập
          </h2>
          <p className="text-gray-600 mb-6">
            Bạn cần đăng nhập để xem đơn hàng
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

  const handleCancelClick = (orderId) => {
    setSelectedOrderId(orderId);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.patch(
        `${API_URL}/order/${selectedOrderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Đã hủy đơn hàng thành công");
        // Refresh orders
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === selectedOrderId
              ? {
                  ...order,
                  orderStatus: "cancelled",
                }
              : order
          )
        );
      }
    } catch (error) {
      console.error("Error canceling order:", error);
      toast.error(error.response?.data?.message || "Không thể hủy đơn hàng");
    } finally {
      setShowCancelModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
          Đơn hàng của tôi
        </h1>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16 bg-white rounded-xl">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-gray-600">Đang tải đơn hàng...</p>
          </div>
        )}

        {/* Orders List */}
        {!loading && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                formatPrice={formatPrice}
                onCancelClick={handleCancelClick}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && orders.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Không có đơn hàng nào
            </h2>
            <p className="text-gray-600 mb-6">
              Bắt đầu mua sắm để xem đơn hàng của bạn ở đây!
            </p>
            <button
              onClick={() => navigate("/products")}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700"
            >
              Xem sản phẩm
            </button>
          </div>
        )}
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Xác nhận hủy đơn hàng
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              Bạn có chắc chắn muốn hủy đơn hàng này không?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
              >
                Đóng
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all shadow-lg"
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
