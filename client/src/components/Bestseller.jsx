import React from "react";
import { useAppContext } from "../context/AppContext";
import ProductCard from "./ProductCard";

const Bestseller = () => {
  const { products, loading } = useAppContext();

  // Get top 5 bestseller products (sold > 1, sorted by sold count)
  const bestsellerProducts = products
    .filter((product) => (product.sold || 0) > 1)
    .sort((a, b) => (b.sold || 0) - (a.sold || 0))
    .slice(0, 5);

  // Loading state
  if (loading) {
    return (
      <div className="py-12 px-6 md:px-16 lg:px-24 xl:px-32 bg-gradient-to-br from-green-50/40 via-white to-emerald-50/30">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 leading-tight">
            Our
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {" "}
              Best Sellers
            </span>
          </h2>
        </div>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  // Empty state
  if (bestsellerProducts.length === 0) {
    return (
      <div className="py-12 px-6 md:px-16 lg:px-24 xl:px-32 bg-gradient-to-br from-green-50/40 via-white to-emerald-50/30">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 leading-tight">
            Our
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {" "}
              Best Sellers
            </span>
          </h2>
        </div>
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🌟</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Chưa có sản phẩm bán chạy
          </h3>
          <p className="text-gray-500">
            Sản phẩm cần có số lượng bán nhiều hơn 1 để được hiển thị ở đây
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-6 md:px-16 lg:px-24 xl:px-32 bg-gradient-to-br from-green-50/40 via-white to-emerald-50/30">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 leading-tight">
          Sản phẩm
          <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {" "}
            Bán Chạy Nhất
          </span>
        </h2>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
          Top {bestsellerProducts.length} sản phẩm bán chạy nhất của chúng tôi
        </p>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {bestsellerProducts.map((product, index) => (
            <div key={product._id} className="relative">
              {/* Rank Badge */}
              <div className="absolute top-2 left-2 z-10 w-7 h-7 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                <span className="text-white font-bold text-xs">
                  #{index + 1}
                </span>
              </div>
              <ProductCard product={product} showBestsellerBadge={true} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bestseller;
