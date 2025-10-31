import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_URL } from "../utils/constants";

const SellerAddProduct = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editProductId = searchParams.get("edit");
  const { axios, user, token } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const [images, setImages] = useState([null, null, null, null]);
  const [productName, setProductName] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [origin, setOrigin] = useState("");

  const categories = ["Trái cây", "Rau củ"];

  const origins = ["Trong nước", "Nước ngoài"];

  // Xử lý nhập liệu cho giá
  const handlePriceInput = (value, setter) => {
    // Kiểm tra xem giá trị có phù hợp với pattern: chỉ số và tối đa một dấu chấm
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      // Nếu giá trị chỉ là dấu chấm, thêm số 0 vào trước
      if (value === ".") {
        setter("0.");
      } else {
        setter(value);
      }
    }
  };

  // Xử lý nhập liệu cho thông tin dinh dưỡng
  const handleNutritionInput = (e, field) => {
    const value = e.target.value;

    // Kiểm tra xem giá trị có phù hợp với pattern: chỉ số và tối đa một dấu chấm
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      // Nếu giá trị chỉ là dấu chấm, thêm số 0 vào trước
      if (value === ".") {
        setNutritionInfo({ ...nutritionInfo, [field]: "0." });
      } else {
        setNutritionInfo({ ...nutritionInfo, [field]: value });
      }
    }
  };

  // Load product data when component mounts
  useEffect(() => {
    const loadProductData = async () => {
      // Check if we're in edit mode by URL parameter
      //   console.log("Edit Product ID from URL:", editProductId);
      if (editProductId) {
        // console.log("IF :", editProductId);
        // console.log("User:", user);
        // console.log("Token:", token);

        if (!user || user.role !== "admin" || !token) {
          // console.log("Admin login required");
          toast.error("Admin login required");
          navigate("/seller/products");
          return;
        }

        try {
          const { data } = await axios.get(
            `${API_URL}/admin/product/${editProductId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log("Origin: ", data.product.origin);
          if (data.success) {
            setIsEditing(true);
            setProductToEdit(data.product);

            // Set form data
            setProductName(data.product.name || "");
            setStock(data.product.stock || "");
            setCategory(data.product.category || "");
            setOrigin(data.product.origin || "");
            setPrice(data.product.price || "");
            setOfferPrice(data.product.offerPrice || "");

            // console.log("Product Data:", data.product);
            // Handle images
            console.log(data.product.image.length);
            if (data.product.image && data.product.image.length > 0) {
              const newImages = [...images];
              data.product.image.forEach((url, index) => {
                newImages[index] = url;
              });
              setImages(newImages);
            }
          } else {
            toast.error("Lỗi else");
          }
        } catch (err) {
          toast.error(err.response?.data?.message || "Lỗi catch");
          navigate("/seller/products");
        }
      }
    };

    loadProductData();
  }, [editProductId, navigate, token, user, axios]);

  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...images];
      newImages[index] = file;
      setImages(newImages);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", productName);
      formData.append("stock", stock);
      formData.append("category", category);
      formData.append("origin", origin);
      formData.append("price", price);
      formData.append("offerPrice", offerPrice);

      // Only append new image files, not existing URLs
      images.forEach((image) => {
        if (image instanceof File) {
          formData.append("image", image);
        }
      });

      const token = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };

      let response;
      if (isEditing && productToEdit) {
        response = await axios.patch(
          `${API_URL}/admin/product/${productToEdit._id}`,
          formData,
          { headers }
        );
      } else {
        response = await axios.post(`${API_URL}/admin/product`, formData, {
          headers,
        });
      }

      const { data } = response;

      if (data.success) {
        toast.success(data.message);
        if (isEditing) {
          // After successful update, go back to products page
          navigate("/seller/products");
        } else {
          // Clear form for new product
          setImages([null, null, null, null]);
          setProductName("");
          setStock("");
          setCategory("");
          setOrigin("");
          setPrice("");
          setOfferPrice("");
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="py-8 px-6 md:px-12 bg-white min-h-[calc(100vh-73px)]">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">
        {isEditing ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
      </h2>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {/* Product Images */}
        <div>
          <label className="text-base font-semibold text-gray-700 mb-3 block">
            Hình ảnh sản phẩm *
          </label>
          <div className="flex flex-wrap items-center gap-4">
            {images.map((image, index) => (
              <label
                key={index}
                htmlFor={`image${index}`}
                className="cursor-pointer"
              >
                <input
                  accept="image/*"
                  type="file"
                  id={`image${index}`}
                  hidden
                  onChange={(e) => handleImageChange(index, e)}
                />
                <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-green-500 transition-colors overflow-hidden bg-gray-50">
                  {image ? (
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl text-gray-400">+</span>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Product Name */}
        <div>
          <label
            htmlFor="product-name"
            className="text-base font-semibold text-gray-700 mb-2 block"
          >
            Tên sản phẩm *
          </label>
          <input
            id="product-name"
            type="text"
            placeholder="Nhập tên sản phẩm"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full outline-none py-2.5 px-4 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
            required
          />
        </div>

        {/* Product Stock */}
        <div>
          <label
            htmlFor="product-description"
            className="text-base font-semibold text-gray-700 mb-2 block"
          >
            Số lượng tồn kho
          </label>
          <textarea
            id="product-description"
            rows={1}
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full outline-none py-2.5 px-4 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 resize-none transition-all"
            placeholder="Nhập số lượng tồn kho"
          />
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="text-base font-semibold text-gray-700 mb-2 block"
          >
            Danh mục *
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full outline-none py-2.5 px-4 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
            required
          >
            <option value="">Chọn danh mục</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Origin */}
        <div>
          <label
            htmlFor="origin"
            className="text-base font-semibold text-gray-700 mb-2 block"
          >
            Nguồn gốc
          </label>
          <select
            id="origin"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full outline-none py-2.5 px-4 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
          >
            <option value="">Chọn nguồn gốc</option>
            {origins.map((origin, index) => (
              <option key={index} value={origin}>
                {origin}
              </option>
            ))}
          </select>
        </div>

        {/* Price Section */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="product-price"
              className="text-base font-semibold text-gray-700 mb-2 block"
            >
              Giá gốc *
            </label>
            <input
              id="product-price"
              type="text"
              placeholder="0"
              value={price}
              onChange={(e) => handlePriceInput(e.target.value, setPrice)}
              className="w-full outline-none py-2.5 px-4 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
              required
            />
          </div>
          <div>
            <label
              htmlFor="offer-price"
              className="text-base font-semibold text-gray-700 mb-2 block"
            >
              Giá bán *
            </label>
            <input
              id="offer-price"
              type="text"
              placeholder="0"
              value={offerPrice}
              onChange={(e) => handlePriceInput(e.target.value, setOfferPrice)}
              className="w-full outline-none py-2.5 px-4 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex items-center gap-4">
          {isEditing && (
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-gray-100 text-gray-700 px-12 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all"
            >
              HỦY
            </button>
          )}
          <button
            type="submit"
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-12 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
          >
            {isEditing ? "CẬP NHẬT SẢN PHẨM" : "THÊM SẢN PHẨM"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellerAddProduct;
