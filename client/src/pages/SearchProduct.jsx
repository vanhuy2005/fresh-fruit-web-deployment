import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { API_URL } from "../utils/constants";

const SearchProduct = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("name");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${API_URL}/product/search?name=${searchQuery}`
        );

        setProducts(response.data.data || []);
        if (!response.data.success) {
          setError(response.data.message);
        }
      } catch (error) {
        // console.error("Error fetching products:", error);
        setError(error.response?.data?.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchProducts();
    } else {
      setProducts([]);
      setError("Vui lòng nhập tên sản phẩm cần tìm");
    }
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Kết quả tìm kiếm cho "{searchQuery}"
          </h1>
          {products.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              Tìm thấy {products.length} sản phẩm
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              Không tìm thấy sản phẩm nào phù hợp với "{searchQuery}"
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Vui lòng thử lại với từ khóa khác
            </p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchProduct;
