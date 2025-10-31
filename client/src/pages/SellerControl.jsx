import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import NavBar from "../components/home/NavBar";
import SellerAddProduct from "./SellerAddProduct";
import SellerStoreControl from "./SellerStoreControl";
import SellerOrders from "./SellerOrders";
import toast from "react-hot-toast";
import { MdAddCircleOutline, MdOutlineInventory2 } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import { API_URL } from "../utils/constants";

const SellerControl = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsSeller, user, axios } = useAppContext();

  // Determine active page from URL
  const getActivePage = () => {
    if (location.pathname.includes("/seller/products")) return "products";
    if (location.pathname.includes("/seller/orders")) return "orders";
    return "add-product";
  };

  const [activePage, setActivePage] = useState(getActivePage());

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.post(
        `${API_URL}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        setIsSeller(false);
        toast.success(data.message);
        navigate("/seller/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleNavigation = (page, path) => {
    setActivePage(page);
    navigate(path);
  };

  const sidebarLinks = [
    {
      name: "Thêm sản phẩm",
      key: "add-product",
      path: "/seller",
      icon: <MdAddCircleOutline className="w-5 h-5" />,
    },
    {
      name: "Danh sách sản phẩm",
      key: "products",
      path: "/seller/products",
      icon: <MdOutlineInventory2 className="w-5 h-5" />,
    },
    {
      name: "Đơn hàng",
      key: "orders",
      path: "/seller/orders",
      icon: <BsBoxSeam className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NavBar chung */}
      <NavBar />

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)]">
          <div className="py-6">
            {sidebarLinks.map((item) => (
              <button
                key={item.key}
                onClick={() => handleNavigation(item.key, item.path)}
                className={`w-full text-left py-3 px-6 transition-all ${
                  activePage === item.key
                    ? "bg-green-50 text-green-600 border-r-4 border-green-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-current">{item.icon}</span>
                  <span>{item.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activePage === "add-product" && <SellerAddProduct />}
          {activePage === "products" && <SellerStoreControl />}
          {activePage === "orders" && <SellerOrders />}
        </div>
      </div>
    </div>
  );
};

export default SellerControl;
