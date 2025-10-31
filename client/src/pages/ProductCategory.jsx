import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import { useParams, useNavigate } from "react-router-dom";
import { categories } from "../images";
import ProductCard from "../components/ProductCard";
import { API_URL } from "../utils/constants";

const ProductCategory = () => {
  const navigate = useNavigate();
  const { setSearchQuery } = useAppContext();
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Clear search query when entering category page
  useEffect(() => {
    setSearchQuery("");
  }, [category, setSearchQuery]);

  // Fetch products from API with token
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_URL}/products`);
        if (!res.data || !res.data.data) {
          throw new Error("Không thể tải dữ liệu sản phẩm");
        }
        setProducts(res.data.data);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Không thể tải sản phẩm. Vui lòng thử lại.";
        setError(errorMessage);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, navigate]);

  // Find category info
  const searchCategory = categories.find(
    (item) => item.path.toLowerCase() === category?.toLowerCase()
  );

  // Filter products by category with exact matching and normalize category names
  const filteredProducts = products
    .filter((product) => {
      if (!product.category || !category) return false;

      // Tìm category info để lấy text (tên tiếng Việt)
      const categoryInfo = categories.find(
        (cat) => cat.path.toLowerCase() === category.toLowerCase()
      );
      const normalizedProductCategory = product.category.toLowerCase().trim();
      const normalizedCategory = category.toLowerCase().trim();
      const normalizedCategoryText = categoryInfo?.text.toLowerCase().trim();

      // So sánh với cả path và text của category
      return (
        normalizedProductCategory === normalizedCategory ||
        normalizedProductCategory === normalizedCategoryText
      );
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  // If category is not found in our predefined categories, redirect to home
  useEffect(() => {
    if (!loading && !searchCategory) {
      navigate("/");
    }
  }, [loading, searchCategory, navigate]);

  return (
    <div className="min-h-screen mt-16 px-6 md:px-16 lg:px-24 xl:px-32 pb-12">
      {searchCategory && (
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
            <img
              src={searchCategory.image}
              alt={searchCategory.text}
              className="w-24 h-24 object-contain rounded-xl shadow-md bg-gradient-to-br from-white to-gray-50 p-3"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {searchCategory.text}
              </h1>
              <p className="text-gray-600 mt-1">{searchCategory.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "sản phẩm" : "sản phẩm"} hiện
                có
              </p>
            </div>
          </div>
          <div className="w-full h-0.5 bg-gradient-to-r from-green-400 via-emerald-400 to-green-400"></div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center">
            <div className="text-4xl mb-4 animate-spin inline-block">🔄</div>
            <p className="text-xl font-semibold text-gray-700">
              Đang tải danh sách sản phẩm...
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <p className="text-2xl font-bold text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-xl mr-4"
            >
              Thử lại
            </button>
            <button
              onClick={() => navigate("/")}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5 mt-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-2xl font-bold text-gray-800 mb-2">
              Không tìm thấy sản phẩm nào
            </p>
            <p className="text-gray-600 mb-6">
              Chúng tôi không thể tìm thấy bất kỳ sản phẩm nào trong danh mục
              này
            </p>
            <button
              onClick={() => {
                window.history.back();
              }}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-xl"
            >
              Quay lại
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCategory;
