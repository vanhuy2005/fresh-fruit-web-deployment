import React from "react";

const OrderStatsCard = ({ label, count, variant = "default" }) => {
  const variants = {
    default: "bg-white border-gray-200 text-gray-600 text-gray-800",
    pending: "bg-yellow-50 border-yellow-200 text-yellow-700 text-yellow-800",
    confirmed: "bg-blue-50 border-blue-200 text-blue-700 text-blue-800",
    processing:
      "bg-purple-50 border-purple-200 text-purple-700 text-purple-800",
    shipped: "bg-indigo-50 border-indigo-200 text-indigo-700 text-indigo-800",
    delivered: "bg-green-50 border-green-200 text-green-700 text-green-800",
    cancelled: "bg-red-50 border-red-200 text-red-700 text-red-800",
  };

  const colors = variants[variant].split(" ");
  const bgColor = colors[0];
  const borderColor = colors[1];
  const textColor = colors[2];
  const countColor = colors[3];

  return (
    <div className={`${bgColor} border-2 ${borderColor} rounded-xl p-4`}>
      <p className={`text-sm ${textColor} mb-1`}>{label}</p>
      <p className={`text-2xl font-bold ${countColor}`}>{count}</p>
    </div>
  );
};

export default OrderStatsCard;
