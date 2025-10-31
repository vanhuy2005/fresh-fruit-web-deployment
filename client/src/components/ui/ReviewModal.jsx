import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

const ReviewModal = ({
  isOpen,
  onClose,
  onSubmit,
  productName,
  isSubmitting,
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = () => {
    if (rating === 0) {
      return;
    }
    onSubmit(rating);
  };

  const handleClose = () => {
    setRating(0);
    setHoveredRating(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Đánh giá sản phẩm
        </h3>
        <p className="text-sm text-gray-600 mb-6">{productName}</p>

        {/* Star Rating */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Chọn số sao đánh giá:
          </label>
          <div className="flex items-center justify-center gap-3 py-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                <FaStar
                  className={`w-12 h-12 transition-colors ${
                    star <= (hoveredRating || rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-gray-600 mt-2">
            {rating > 0 ? (
              <span className="font-semibold text-yellow-600">
                {rating} sao
                {rating === 5 && " - Xuất sắc"}
                {rating === 4 && " - Tốt"}
                {rating === 3 && " - Trung bình"}
                {rating === 2 && " - Kém"}
                {rating === 1 && " - Rất kém"}
              </span>
            ) : (
              "Chưa chọn đánh giá"
            )}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
            className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Đang gửi..." : "Đánh giá"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
