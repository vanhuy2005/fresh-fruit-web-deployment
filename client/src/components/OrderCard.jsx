import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "../utils/constants";

const OrderCard = ({
  order,
  formatPrice,
  onCancelClick,
  isAdmin,
  onStatusUpdate,
}) => {
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(order.orderStatus);

  const getStatusColor = (status) => {
    switch (status) {
      case "processing":
        return "text-blue-600 bg-blue-50";
      case "cancelled":
        return "text-red-600 bg-red-50";
      case "confirmed":
        return "text-orange-600 bg-orange-50";
      case "delivered":
        return "text-green-600 bg-green-50";
      case "shipped":
        return "text-purple-600 bg-purple-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: "Chờ xử lý",
      confirmed: "Đã xác nhận",
      processing: "Đang xử lý",
      shipped: "Đang giao",
      delivered: "Hoàn thành",
      cancelled: "Đã hủy",
    };
    return statusMap[status] || status;
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "text-green-600 bg-green-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "failed":
        return "text-red-600 bg-red-50";
      case "refunded":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getPaymentStatusText = (status) => {
    const statusMap = {
      paid: "Đã thanh toán",
      pending: "Chờ thanh toán",
      failed: "Thanh toán thất bại",
      refunded: "Đã hoàn tiền",
    };
    return statusMap[status] || status;
  };

  const handleUpdateStatus = async () => {
    if (selectedStatus === order.orderStatus) {
      setShowStatusModal(false);
      return;
    }

    setIsUpdating(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.patch(
        `${API_URL}/admin/order/${order._id}/status`,
        { newStatus: selectedStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Cập nhật trạng thái thành công!");
        setShowStatusModal(false);
        if (onStatusUpdate) {
          onStatusUpdate(order._id, selectedStatus);
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(
        error.response?.data?.message || "Không thể cập nhật trạng thái"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Order Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 flex items-center justify-between border-b">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm flex-1">
          <div>
            <p className="text-xs text-gray-500 mb-1">Mã đơn hàng</p>
            <p className="font-semibold text-gray-800">
              {order.orderNumber || order._id}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Phương thức thanh toán</p>
            <p className="font-semibold text-gray-800 uppercase">
              {order.paymentMethod}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Trạng thái đơn hàng</p>
            <span
              className={`inline-block font-semibold px-3 py-1 rounded-full text-xs ${getStatusColor(order.orderStatus)}`}
            >
              {getStatusText(order.orderStatus)}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Trạng thái thanh toán</p>
            <span
              className={`inline-block font-semibold px-3 py-1 rounded-full text-xs ${getPaymentStatusColor(order.paymentStatus)}`}
            >
              {getPaymentStatusText(order.paymentStatus)}
            </span>
          </div>
        </div>

        {/* Action Buttons - Top Right */}
        <div className="flex items-center gap-2">
          {/* Admin Status Update Button */}
          {isAdmin && (
            <button
              onClick={() => setShowStatusModal(true)}
              className="ml-4 px-4 py-2 bg-blue-50 border border-blue-200 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-all text-sm"
            >
              Cập nhật trạng thái
            </button>
          )}

          {/* Customer Cancel Button */}
          {!isAdmin &&
            (order.orderStatus === "pending" ||
              order.orderStatus === "confirmed") && (
              <button
                onClick={() => onCancelClick(order._id)}
                className="ml-4 px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-all text-sm"
              >
                Hủy đơn
              </button>
            )}
        </div>
      </div>

      {/* Status Update Modal for Admin */}
      {isAdmin && showStatusModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Cập nhật trạng thái đơn hàng
            </h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn trạng thái mới:
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pending">Chờ xử lý</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="processing">Đang xử lý</option>
                <option value="shipped">Đang giao</option>
                <option value="delivered">Hoàn thành</option>
                <option value="cancelled">Hủy đơn hàng</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowStatusModal(false)}
                disabled={isUpdating}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={isUpdating}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {isUpdating ? "Đang cập nhật..." : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Info - Date, Customer Info, Address, Notes */}
      <div className="px-6 py-4 bg-blue-50/30 border-b">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-xs text-gray-500 mb-1">Ngày đặt hàng</p>
            <p className="font-medium text-gray-800">
              {new Date(order.createdAt).toLocaleString("vi-VN")}
            </p>
          </div>
          {order.userId && (
            <>
              <div>
                <p className="text-xs text-gray-500 mb-1">Khách hàng</p>
                <p className="font-medium text-gray-800">
                  {order.userId.firstName} {order.userId.lastName}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Số điện thoại</p>
                <p className="font-medium text-gray-800">
                  {order.userId.phoneNumber || "Chưa cập nhật"}
                </p>
              </div>
            </>
          )}
        </div>
        {order.shippingAddress && (
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-1">Địa chỉ giao hàng</p>
            <p className="font-medium text-gray-800">{order.shippingAddress}</p>
          </div>
        )}
        {order.notes && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-1">Ghi chú</p>
            <p className="font-medium text-gray-800 italic">"{order.notes}"</p>
          </div>
        )}
      </div>

      {/* Order Items - Simple List */}
      <div className="p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          Danh sách sản phẩm
        </h3>
        <div className="space-y-3">
          {order.products.map((item, index) => {
            const product = item.productId || item;
            const productImage = product.image[0] || item.image;
            const productName = product.name || item.name;
            const productPrice = product.price || item.price;

            return (
              <div
                key={index}
                className="flex items-center gap-4 py-3 border-b last:border-0"
              >
                {/* Product Image */}
                <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={productImage || "/placeholder.png"}
                    alt={productName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">
                    {productName}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {formatPrice(productPrice)} x {item.quantity}
                  </p>
                </div>

                {/* Item Total */}
                <div className="text-right">
                  <p className="font-semibold text-gray-800">
                    {formatPrice(item.total)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="space-y-2 text-sm">
            {order.subtotal && (
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính:</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
            )}
            <div className="flex justify-between text-red-600">
              <span>Giảm giá:</span>
              <span>-{formatPrice(order.discount || 0)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
              <span>Tổng tiền:</span>
              <span className="text-green-600">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
