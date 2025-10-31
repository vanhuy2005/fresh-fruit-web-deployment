import React from "react";
import { images } from "../images";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { API_URL } from "../utils/constants";

const ProductCard = ({ product }) => {
  const { currency, formatPrice, user, refreshCart } = useAppContext();
  const navigate = useNavigate();

  // Add product to cart
  const handleAddToCart = async (e, productId) => {
    e.stopPropagation();

    if (!user) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng!", {
        duration: 2500,
        style: {
          background: "#ef4444",
          color: "#fff",
          fontWeight: "500",
        },
      });
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        toast.error("Vui lòng đăng nhập để mua hàng!", {
          duration: 2500,
          style: {
            background: "#ef4444",
            color: "#fff",
            fontWeight: "500",
          },
        });
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      // Gọi API để thêm sản phẩm vào giỏ hàng
      const response = await axios.post(
        `${API_URL}/cart/items`,
        {
          products: [
            {
              productId: productId,
              quantity: 1,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Đã thêm vào giỏ hàng!", {
          duration: 2000,
          style: {
            background: "#10b981",
            color: "#fff",
            fontWeight: "500",
          },
        });
        refreshCart(); // Instantly update cart count in navbar
      }
    } catch (error) {
      console.error("Error adding to cart:", error);

      if (error.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!", {
          duration: 2500,
          style: {
            background: "#ef4444",
            color: "#fff",
            fontWeight: "500",
          },
        });
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi thêm vào giỏ hàng!",
          {
            duration: 2500,
            style: {
              background: "#ef4444",
              color: "#fff",
              fontWeight: "500",
            },
          }
        );
      }
    }
  };

  return (
    <div
      onClick={() => {
        navigate(`/product/${product._id}`);
        window.scrollTo(0, 0);
      }}
      className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-200 hover:-translate-y-1 cursor-pointer"
    >
      {/* Product Image */}
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <img
          src={product.image[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Discount Badge */}
        {product.offerPrice < product.price && (
          <div className="absolute bottom-1.5 right-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-1.5 py-0.5 rounded-full text-xs font-semibold shadow-md">
            -
            {Math.round(
              ((product.price - product.offerPrice) / product.price) * 100
            )}
            %
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3">
        <div className="mb-2">
          <p className="text-gray-500 text-xs font-medium">
            {product.category}
          </p>
          <h3 className="text-gray-800 font-semibold text-sm leading-tight line-clamp-2 group-hover:text-green-700 transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <img src={images.star_icon} alt="star" className="w-3 h-3" />
            <span className="text-gray-500 text-xs ml-1">
              {product.averageRating.toFixed(1)}
            </span>
          </div>
          <span className="text-gray-500 text-xs">Đã bán {product.sold}</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <p className="text-base font-bold text-green-600">
              {formatPrice(product.offerPrice)} {currency}
            </p>
            {product.offerPrice < product.price && (
              <span className="text-gray-400 text-xs line-through">
                {formatPrice(product.price)} {currency}
              </span>
            )}
          </div>
        </div>

        {/* Cart Controls */}
        {user?.role !== "admin" && (
          <div className="flex items-center justify-center">
            <button
              onClick={(e) => handleAddToCart(e, product._id)}
              className="w-full flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1.5 rounded-md font-medium transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md text-xs border border-gray-200 hover:border-gray-300"
            >
              <img src={images.cart_icon} alt="cart" className="w-3 h-3" />
              Thêm vào giỏ hàng
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
