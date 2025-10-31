import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import axios from "axios";
import ProductFilter from "../components/ProductFilter";
import { API_URL } from "../utils/constants";

const Allproduct = () => {
  // State cho danh sách sản phẩm
  const [products, setProducts] = useState([]);

  // State cho các tiêu chí lọc, đọc từ localStorage
  const [filterCriteria, setFilterCriteria] = useState(() => {
    const savedCriteria = localStorage.getItem("filterCriteria");
    return savedCriteria ? JSON.parse(savedCriteria) : null;
  });

  // State cho việc hiển thị bộ lọc, đọc từ localStorage
  const [showFilter, setShowFilter] = useState(() => {
    return localStorage.getItem("showFilter") === "true";
  });

  // Effect để fetch và filter products khi component mount và khi filterCriteria thay đổi
  useEffect(() => {
    const savedCriteria = localStorage.getItem("filterCriteria");
    if (savedCriteria) {
      const criteria = JSON.parse(savedCriteria);
      setFilterCriteria(criteria);
    }

    // Fetch tất cả sản phẩm một lần
    const fetchAllProducts = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const url = `${API_URL}/products`;
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (res.data && res.data.data) {
          const allProducts = res.data.data;
          // Nếu có criteria đã lưu, áp dụng filter ngay
          if (savedCriteria) {
            const criteria = JSON.parse(savedCriteria);
            const filteredProducts = allProducts.filter((product) => {
              const matchesOrigin =
                !criteria.origin || product.origin === criteria.origin;
              const matchesCategory =
                !criteria.category || product.category === criteria.category;
              const matchesPrice =
                (!criteria.minPrice ||
                  product.price >= Number(criteria.minPrice)) &&
                (!criteria.maxPrice ||
                  product.price <= Number(criteria.maxPrice));
              return matchesOrigin && matchesCategory && matchesPrice;
            });
            setProducts(filteredProducts);
          } else {
            setProducts(allProducts);
          }
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          window.location.href = "/login";
        } else {
          console.error("Không thể tải danh sách sản phẩm", err);
          setProducts([]);
        }
      }
    };

    fetchAllProducts();
  }, []);

  const fetchProducts = async (criteria = {}) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const url = `${API_URL}/products`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.data && res.data.data) {
        const allProducts = res.data.data;
        // Lọc sản phẩm dựa trên criteria
        if (Object.keys(criteria).length > 0) {
          const filteredProducts = allProducts.filter((product) => {
            const matchesOrigin =
              !criteria.origin || product.origin === criteria.origin;
            const matchesCategory =
              !criteria.category || product.category === criteria.category;
            const matchesPrice =
              (!criteria.minPrice ||
                product.price >= Number(criteria.minPrice)) &&
              (!criteria.maxPrice ||
                product.price <= Number(criteria.maxPrice));
            return matchesOrigin && matchesCategory && matchesPrice;
          });
          setProducts(filteredProducts);
        } else {
          // Nếu không có criteria, kiểm tra xem có criteria đã lưu không
          const savedCriteria = localStorage.getItem("filterCriteria");
          if (savedCriteria) {
            const savedCriteriaObj = JSON.parse(savedCriteria);
            const filteredProducts = allProducts.filter((product) => {
              const matchesOrigin =
                !savedCriteriaObj.origin ||
                product.origin === savedCriteriaObj.origin;
              const matchesCategory =
                !savedCriteriaObj.category ||
                product.category === savedCriteriaObj.category;
              const matchesPrice =
                (!savedCriteriaObj.minPrice ||
                  product.price >= Number(savedCriteriaObj.minPrice)) &&
                (!savedCriteriaObj.maxPrice ||
                  product.price <= Number(savedCriteriaObj.maxPrice));
              return matchesOrigin && matchesCategory && matchesPrice;
            });
            setProducts(filteredProducts);
          } else {
            setProducts(allProducts);
          }
        }
      } else {
        setProducts([]);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
      } else {
        console.error("Không thể tải danh sách sản phẩm", err);
        setProducts([]);
      }
    }
  };

  // Fetch initial products without filter
  useEffect(() => {
    fetchProducts({});
  }, []);

  return (
    <div className="py-12 px-6 md:px-16 lg:px-24 xl:px-32 bg-gradient-to-br from-green-50/40 via-white to-emerald-50/30">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 leading-tight">
          Tất cả
          <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {" "}
            Sản phẩm
          </span>
        </h1>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-6">
          "Khám phá bộ sưu tập đầy đủ của chúng tôi về trái cây tươi và rau củ
          quả"
        </p>
        <div className="flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={() => {
              const newShowFilter = !showFilter;
              setShowFilter(newShowFilter);
              localStorage.setItem("showFilter", newShowFilter);

              if (!newShowFilter) {
                // Nếu đang tắt filter
                setFilterCriteria(null);
                localStorage.removeItem("filterCriteria");
                fetchProducts({});
              } else {
                // Nếu đang bật filter lại, kiểm tra xem có criteria đã lưu không
                const savedCriteria = localStorage.getItem("filterCriteria");
                if (savedCriteria) {
                  const criteria = JSON.parse(savedCriteria);
                  setFilterCriteria(criteria);
                  fetchProducts(criteria);
                }
              }
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border border-green-300 bg-white shadow-sm transition-all duration-200 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-200 select-none ${showFilter ? "bg-green-100 border-green-500" : ""}`}
          >
            <span
              className={`w-10 h-6 flex items-center bg-gray-200 rounded-full p-1 transition-all duration-200 ${showFilter ? "bg-green-400" : ""}`}
            >
              <span
                className={`h-4 w-4 bg-white rounded-full shadow-md transform transition-all duration-200 ${showFilter ? "translate-x-4" : ""}`}
              ></span>
            </span>
            <span className="text-base font-medium text-green-700">Bộ lọc</span>
          </button>
          {showFilter && (
            <div className="mt-2">
              <ProductFilter
                initialValues={filterCriteria}
                onApplyFilter={(criteria) => {
                  console.log("Filter applied with criteria:", criteria);
                  setFilterCriteria(criteria);
                  localStorage.setItem(
                    "filterCriteria",
                    JSON.stringify(criteria)
                  );
                  fetchProducts(criteria);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
            {products
              .filter((product) => product.isActive)
              .map((product, index) => (
                <ProductCard key={product._id || index} product={product} />
              ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-2xl font-bold text-gray-800 mb-2">
              No products available
            </p>
            <p className="text-gray-600 mb-6">Please check back later</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Allproduct;
