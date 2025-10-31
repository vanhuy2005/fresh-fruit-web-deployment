import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { images } from "../images";
import { useAppContext } from "../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import OrderCard from "../components/OrderCard";
import {
  FaShoppingBag,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaCog,
} from "react-icons/fa";
import { API_URL } from "../utils/constants";

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser, logout, formatPrice } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [loadingUser, setLoadingUser] = useState(false);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoadingOrders(false);
        return;
      }

      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${API_URL}/order/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Xử lý cả trường hợp success: true và success: false
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
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [user]);

  // Calculate real stats from orders - Memoized để tránh recalculate mỗi render
  const orderStats = useMemo(() => {
    const totalOrders = orders.length;
    const processingOrders = orders.filter(
      (o) =>
        o.orderStatus === "pending" ||
        o.orderStatus === "confirmed" ||
        o.orderStatus === "processing"
    ).length;
    const completedOrders = orders.filter(
      (o) => o.orderStatus === "delivered"
    ).length;
    const cancelledOrders = orders.filter(
      (o) => o.orderStatus === "cancelled"
    ).length;
    const shippedOrders = orders.filter(
      (o) => o.orderStatus === "shipped"
    ).length;
    const totalPoints = completedOrders * 50; // 50 points per completed order

    return {
      totalOrders,
      processingOrders,
      completedOrders,
      cancelledOrders,
      shippedOrders,
      totalPoints,
    };
  }, [orders]);

  const {
    totalOrders,
    processingOrders,
    completedOrders,
    cancelledOrders,
    shippedOrders,
    totalPoints,
  } = orderStats;

  // Get recent orders (latest 5) - Memoized
  const recentOrders = useMemo(() => {
    return orders.slice(0, 5);
  }, [orders]);

  const userStats = [
    {
      label: "Tổng đơn hàng",
      value: totalOrders,
      icon: FaShoppingBag,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Đang xử lý",
      value: processingOrders,
      icon: FaClock,
      color: "from-amber-500 to-orange-500",
    },
    {
      label: "Hoàn thành",
      value: completedOrders,
      icon: FaCheckCircle,
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Đã hủy",
      value: cancelledOrders,
      icon: FaTimesCircle,
      color: "from-red-500 to-pink-500",
    },
  ];

  // Fetch user mới nhất từ API khi mount (nếu user đang login)
  useEffect(() => {
    const fetchUser = async () => {
      if (user && user._id) {
        setLoadingUser(true);
        try {
          const token = localStorage.getItem("accessToken");
          const res = await axios.get(`${API_URL}/user/${user._id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.data && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem("user", JSON.stringify(res.data.user));
          }
        } catch (error) {
          // Nếu lỗi (hết hạn hoặc không đúng token) thì logout
          setUser(null);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
        } finally {
          setLoadingUser(false);
        }
      }
    };
    fetchUser();
    // eslint-disable-next-line
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-3xl shadow-xl p-12 max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Vui lòng đăng nhập
          </h2>
          <p className="text-gray-600 mb-6">
            Bạn cần đăng nhập để xem trang cá nhân
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

  // Hiển thị loading nếu đang fetch user từ api
  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 text-4xl">⏳</div>
          <div className="font-bold text-lg text-gray-700">
            Đang tải thông tin tài khoản...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <span className="text-xl">←</span>
            <span className="font-medium">Quay lại</span>
          </button>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-white to-green-100 p-1 shadow-2xl group-hover:scale-105 transition-transform duration-300">
                <img
                  className="w-full h-full rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-4xl md:text-5xl font-bold shadow-inner"
                  src={user?.avatar || "/default-avatar.png"}
                  alt={`${user?.firstName || "User"}'s avatar`}
                />
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-white text-green-600 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center">
                <span className="text-lg">📷</span>
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold">
                  Xin chào, {user.firstName} {user.lastName}
                </h1>
              </div>
              <p className="text-green-100 text-lg mb-3">{user.email}</p>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/settings")}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all border border-white/30 group"
              >
                <FaCog className="text-white text-2xl group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {userStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 group"
              >
                <div
                  className={`w-14 h-14 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <IconComponent className="text-white text-2xl" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Orders Section */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-2xl">📦</span>
                Đơn hàng gần đây
              </h2>
            </div>
            {loadingOrders ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Đang tải đơn hàng...</p>
              </div>
            ) : recentOrders.length > 0 ? (
              <>
                <div className="p-6 space-y-4">
                  {recentOrders.map((order) => (
                    <OrderCard
                      key={order._id}
                      order={order}
                      formatPrice={formatPrice}
                      isAdmin={false}
                    />
                  ))}
                </div>
                <div className="p-4 bg-gray-50 text-center">
                  <button
                    onClick={() => navigate("/orders")}
                    className="text-green-600 hover:text-green-700 font-semibold"
                  >
                    Xem tất cả đơn hàng →
                  </button>
                </div>
              </>
            ) : (
              <div className="p-12 text-center">
                <div className="text-5xl mb-4">🛒</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Chưa có đơn hàng
                </h3>
                <p className="text-gray-500 mb-4">Bắt đầu mua sắm ngay!</p>
                <button
                  onClick={() => navigate("/products")}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Khám phá sản phẩm
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
