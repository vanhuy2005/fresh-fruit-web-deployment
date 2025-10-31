import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import { API_URL } from "../utils/constants";

const RelatedProducts = ({ currentProduct }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!currentProduct?.category) return;

      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("accessToken");
        const { data } = await axios.get(`${API_URL}/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (data.success && data.data) {
          // Lọc sản phẩm cùng category và loại bỏ sản phẩm hiện tại
          const filtered = data.data.filter(
            (product) =>
              product.category === currentProduct.category &&
              product._id !== currentProduct._id
          );

          // Giới hạn số lượng sản phẩm liên quan (ví dụ: 5 sản phẩm)
          setRelatedProducts(filtered.slice(0, 5));
        }
      } catch (err) {
        setError("Không thể tải sản phẩm liên quan");
        console.error("Error fetching related products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [currentProduct]);

  if (loading) {
    return (
      <div className="py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin text-4xl">🔄</div>
        </div>
      </div>
    );
  }

  if (error) {
    return null; // Ẩn phần related products nếu có lỗi
  }

  if (relatedProducts.length === 0) {
    return null; // Ẩn phần related products nếu không có sản phẩm liên quan
  }

  return (
    <div className="py-12 border-t border-gray-100">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Sản phẩm liên quan
          </h2>
          <p className="text-gray-600">
            Các sản phẩm tương tự có thể bạn sẽ thích
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {relatedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;
