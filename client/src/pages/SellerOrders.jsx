import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";
import OrderCard from "../components/OrderCard";
import OrderStatsCard from "../components/OrderStatsCard";
import OrderFilterTab from "../components/OrderFilterTab";
import { API_URL } from "../utils/constants";

const SellerOrders = () => {
  const { formatPrice } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch all orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${API_URL}/admin/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setOrders(response.data.orders || []);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Không thể tải danh sách đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Handle status update
  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, orderStatus: newStatus } : order
      )
    );
  };

  // Filter orders
  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((order) => order.orderStatus === filterStatus);

  // Calculate stats
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.orderStatus === "pending").length,
    confirmed: orders.filter((o) => o.orderStatus === "confirmed").length,
    processing: orders.filter((o) => o.orderStatus === "processing").length,
    shipped: orders.filter((o) => o.orderStatus === "shipped").length,
    delivered: orders.filter((o) => o.orderStatus === "delivered").length,
    cancelled: orders.filter((o) => o.orderStatus === "cancelled").length,
  };

  if (loading) {
    return (
      <div className="py-8 px-6 md:px-12 bg-white min-h-[calc(100vh-73px)]">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải đơn hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-6 md:px-12 bg-white min-h-[calc(100vh-73px)]">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Quản lý đơn hàng
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
        <OrderStatsCard label="Tất cả" count={stats.total} variant="default" />
        <OrderStatsCard
          label="Chờ xác nhận"
          count={stats.pending}
          variant="pending"
        />
        <OrderStatsCard
          label="Đã xác nhận"
          count={stats.confirmed}
          variant="confirmed"
        />
        <OrderStatsCard
          label="Đang xử lý"
          count={stats.processing}
          variant="processing"
        />
        <OrderStatsCard
          label="Đang giao"
          count={stats.shipped}
          variant="shipped"
        />
        <OrderStatsCard
          label="Hoàn thành"
          count={stats.delivered}
          variant="delivered"
        />
        <OrderStatsCard
          label="Đã hủy"
          count={stats.cancelled}
          variant="cancelled"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <OrderFilterTab
          label="Tất cả"
          count={stats.total}
          isActive={filterStatus === "all"}
          onClick={() => setFilterStatus("all")}
        />
        <OrderFilterTab
          label="Chờ xác nhận"
          count={stats.pending}
          isActive={filterStatus === "pending"}
          onClick={() => setFilterStatus("pending")}
        />
        <OrderFilterTab
          label="Đã xác nhận"
          count={stats.confirmed}
          isActive={filterStatus === "confirmed"}
          onClick={() => setFilterStatus("confirmed")}
        />
        <OrderFilterTab
          label="Đang xử lý"
          count={stats.processing}
          isActive={filterStatus === "processing"}
          onClick={() => setFilterStatus("processing")}
        />
        <OrderFilterTab
          label="Đang giao"
          count={stats.shipped}
          isActive={filterStatus === "shipped"}
          onClick={() => setFilterStatus("shipped")}
        />
        <OrderFilterTab
          label="Hoàn thành"
          count={stats.delivered}
          isActive={filterStatus === "delivered"}
          onClick={() => setFilterStatus("delivered")}
        />
        <OrderFilterTab
          label="Đã hủy"
          count={stats.cancelled}
          isActive={filterStatus === "cancelled"}
          onClick={() => setFilterStatus("cancelled")}
        />
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Không có đơn hàng
          </h3>
          <p className="text-gray-500">
            {filterStatus === "all"
              ? "Chưa có đơn hàng nào từ khách hàng"
              : `Không có đơn hàng nào ở trạng thái này`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              formatPrice={formatPrice}
              isAdmin={true}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerOrders;
