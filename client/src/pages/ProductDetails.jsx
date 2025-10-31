import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import RelatedProducts from "../components/RelatedProducts";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import ReviewModal from "../components/ui/ReviewModal";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { API_URL } from "../utils/constants";

const ProductDetails = () => {
  const { user, refreshCart } = useAppContext();
  const navigate = useNavigate();
  const params = useParams();
  const productId = params.productId || params.id;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Format price with thousand separator
  const formatPrice = (price) => {
    if (!price && price !== 0) return "";
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Fetching product with ID:", productId);
        const res = await axios.get(`${API_URL}/product/${productId}`);
        console.log("API product data:", res.data);
        setProduct(res.data.product);
        if (res.data.product?.image && res.data.product.image.length) {
          setThumbnail(res.data.product.image[0]);
        } else {
          setThumbnail(null);
        }
      } catch (err) {
        setError("Không thể tải dữ liệu sản phẩm.");
      } finally {
        setLoading(false);
      }
    };
    if (productId) fetchProduct();
    else {
      console.log("No productId found in params:", params);
    }
  }, [productId]);

  // Thêm vào giỏ hàng
  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      navigate("/login");
      return;
    }

    if (quantity < 1) {
      toast.error("Số lượng không hợp lệ!");
      return;
    }

    setIsAddingToCart(true);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `${API_URL}/cart/items`,
        {
          products: [
            {
              productId: productId,
              quantity: quantity,
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
        toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`, {
          duration: 2000,
          style: {
            background: "#10b981",
            color: "#fff",
            fontWeight: "500",
          },
        });
        refreshCart(); // Cập nhật số lượng giỏ hàng trong navbar
      }
    } catch (error) {
      console.error("Error adding to cart:", error);

      if (error.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!", {
          duration: 2500,
        });
        navigate("/login");
      } else {
        toast.error(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi thêm vào giỏ hàng!"
        );
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Mua ngay
  const handleBuyNow = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để mua hàng!");
      navigate("/login");
      return;
    }

    if (quantity < 1) {
      toast.error("Số lượng không hợp lệ!");
      return;
    }

    setIsAddingToCart(true);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        navigate("/login");
        return;
      }

      // Thêm vào giỏ hàng trước
      const response = await axios.post(
        `${API_URL}/cart/items`,
        {
          products: [
            {
              productId: productId,
              quantity: quantity,
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
        refreshCart(); // Cập nhật giỏ hàng
        // Navigate ngay sang trang giỏ hàng
        navigate("/cart");
      }
    } catch (error) {
      console.error("Error buying now:", error);

      if (error.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        navigate("/login");
      } else {
        toast.error(
          error.response?.data?.message || "Có lỗi xảy ra khi mua hàng!"
        );
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Gửi đánh giá
  const handleSubmitReview = async (rating) => {
    setIsSubmittingReview(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `${API_URL}/product/${productId}/review`,
        { rating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Đánh giá sản phẩm thành công!", {
          duration: 2000,
          style: {
            background: "#10b981",
            color: "#fff",
          },
        });
        setShowReviewModal(false);
        // Refresh product data để cập nhật rating
        const res = await axios.get(`${API_URL}/product/${productId}`);
        setProduct(res.data.product);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      if (error.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        navigate("/login");
      } else {
        toast.error(
          error.response?.data?.message || "Có lỗi xảy ra khi đánh giá!"
        );
      }
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Render stars
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300" />);
      }
    }
    return stars;
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  if (!product) return <div>Không tìm thấy sản phẩm.</div>;

  return (
    <div className="py-8 px-6 md:px-16 lg:px-24 xl:px-32 bg-gray-50">
      {/* Product Details Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Images Section */}
          <div className="flex gap-4 lg:w-1/2">
            {/* Thumbnails */}
            <div className="flex flex-col gap-3">
              {(product.image || []).map((image, index) => (
                <div
                  key={index}
                  onClick={() => setThumbnail(image)}
                  className={`border-2 w-20 h-20 rounded-lg overflow-hidden cursor-pointer transition-all ${
                    thumbnail === image
                      ? "border-green-500 shadow-md"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 border-2 border-gray-200 rounded-2xl overflow-hidden bg-white flex items-center justify-center p-6">
              <img
                src={thumbnail}
                alt="Selected product"
                className="w-full h-full object-contain max-h-[500px]"
              />
            </div>
          </div>

          {/* Product Info Section */}
          <div className="lg:w-1/2 flex flex-col">
            {/* Product Name */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              {product.name}
            </h1>

            {/* Rating Section */}
            <div className="mb-4 flex items-center gap-4">
              <div className="flex items-center gap-1">
                {renderStars(product.averageRating || 0)}
              </div>
              <span className="text-lg font-semibold text-gray-800">
                {product.averageRating?.toFixed(1) || "0.0"}
              </span>
              <span className="text-sm text-gray-500">
                ({product.reviewCount || 0} đánh giá)
              </span>
            </div>

            {/* Price Section */}
            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-sm text-gray-500">Giá gốc:</span>
                <span className="text-gray-400 line-through text-sm">
                  {formatPrice(product.price)} VNĐ
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-medium text-gray-700">
                  Giá bán:
                </span>
                <span className="text-3xl font-bold text-green-600">
                  {formatPrice(product.offerPrice || product.price)} VNĐ
                </span>
              </div>
            </div>

            {/* Product Origin and Type */}
            <div className="mb-6 space-y-3">
              {product.origin && (
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-gray-700">
                    Nguồn gốc:
                  </span>
                  <span className="text-gray-600">{product.origin}</span>
                </div>
              )}
              {product.category && (
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-gray-700">
                    Danh mục:
                  </span>
                  <span className="text-gray-600">{product.category}</span>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-800 mb-3">
                Số lượng
              </h3>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 text-lg font-bold"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="text-lg font-semibold w-8 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 text-lg font-bold"
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock, q + 1))
                  }
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
                <span className="ml-4 text-gray-500 text-sm">
                  Còn lại:{" "}
                  <span className="font-semibold">{product.stock}</span> sản
                  phẩm có sẵn
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            {user?.role !== "admin" && (
              <>
                <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || product.stock < 1}
                    className="flex-1 py-3.5 px-6 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg transition-all duration-300 border border-gray-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAddingToCart ? "Đang thêm..." : "Thêm vào giỏ hàng"}
                  </button>
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    disabled={isAddingToCart || product.stock < 1}
                    className="flex-1 py-3.5 px-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isAddingToCart ? "Đang xử lý..." : "Mua ngay"}
                  </button>
                </div>

                {/* Review Button - Only for logged in users */}
                {user && (
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(true)}
                    className="mt-3 w-full py-3 px-6 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 font-semibold rounded-lg transition-all duration-300 border-2 border-yellow-200 hover:border-yellow-300 flex items-center justify-center gap-2"
                  >
                    <FaStar className="text-yellow-500" />
                    Đánh giá sản phẩm
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={handleSubmitReview}
        productName={product?.name}
        isSubmitting={isSubmittingReview}
      />

      {/* Related Products Section */}
      <RelatedProducts currentProduct={product} />
    </div>
  );
};
export default ProductDetails;
