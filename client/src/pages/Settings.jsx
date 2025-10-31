import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import { FaUser, FaMapMarkerAlt, FaKey } from "react-icons/fa";
import { API_URL } from "../utils/constants";

const Settings = () => {
  const navigate = useNavigate();
  const { setUser } = useAppContext();
  const [activeTab, setActiveTab] = useState("account");
  const [loading, setLoading] = useState(true);

  // Form states
  const [accountData, setAccountData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    avatar: "",
  });

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        // Lấy user data từ localStorage và parse nó
        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : null;

        console.log("Token:", token);
        console.log("User:", user._id);

        if (!token || !user?._id) {
          console.log("No token or user found");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_URL}/user/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("API Response:", response.data);

        if (response.data.success) {
          const userData = response.data.user;
          setAccountData({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
            phoneNumber: userData.phoneNumber || "",
            avatar: userData.avatar || "",
          });
          setAddressData(userData.address || null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("userId");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const [addressData, setAddressData] = useState(null);

  const [changePassword, setChangePassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Lấy thông tin user từ localStorage
  const userStr = localStorage.getItem("user");
  const currentUser = userStr ? JSON.parse(userStr) : null;

  // Tạo danh sách tabs dựa trên role
  const tabs = [
    { id: "account", name: "Tài khoản", icon: FaUser },
    ...(currentUser?.role !== "admin"
      ? [{ id: "address", name: "Địa chỉ", icon: FaMapMarkerAlt }]
      : []),
    { id: "password", name: "Đổi mật khẩu", icon: FaKey },
  ];

  const handleSaveAccount = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;

      console.log("Save - Token:", token);
      console.log("Save - User:", user);

      if (!token || !user?._id) {
        console.log("Save - No token or user found");
        setLoading(false);
        return;
      }

      const response = await axios.patch(
        `${API_URL}/user/${user._id}`,
        {
          firstName: accountData.firstName,
          lastName: accountData.lastName,
          email: accountData.email,
          phoneNumber: accountData.phoneNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Save - API Response:", response.data);

      if (response.data.success) {
        // Cập nhật lại user trong localStorage
        const updatedUser = {
          ...user,
          firstName: accountData.firstName,
          lastName: accountData.lastName,
          email: accountData.email,
          phoneNumber: accountData.phoneNumber,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        toast.success("Cập nhật thông tin thành công");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      if (error.response?.status === 401) {
        console.log("Save - Unauthorized, clearing tokens");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        toast.error(
          "Có lỗi xảy ra khi cập nhật thông tin: " +
            (error.response?.data?.message || error.message)
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    try {
      if (changePassword.newPassword !== changePassword.confirmPassword) {
        toast.error("Mật khẩu xác nhận không khớp");
        return;
      }

      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Bạn cần đăng nhập lại để thực hiện chức năng này");
        return;
      }

      const response = await axios.patch(
        `${API_URL}/user/changePassword`,
        {
          currentPassword: changePassword.currentPassword,
          newPassword: changePassword.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message);

      if (response.data.success) {
        setChangePassword({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(error.response?.data?.message);
    }
  };

  const handleSaveAddress = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;

      if (!token || !user?._id) {
        toast.error("Bạn cần đăng nhập lại để thực hiện chức năng này");
        return;
      }

      const response = await axios.patch(
        `${API_URL}/user/${user._id}`,
        {
          address: addressData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Cập nhật lại user trong localStorage
        const updatedUser = {
          ...user,
          address: addressData,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser); // Cập nhật context để UI phản ánh ngay
        toast.success("Cập nhật địa chỉ thành công");
      }
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("Có lỗi xảy ra khi cập nhật địa chỉ");
    }
  };

  // Xử lý upload avatar
  const handleAvatarChange = async (file) => {
    if (!file) return;

    try {
      const token = localStorage.getItem("accessToken");
      const userStr = localStorage.getItem("user");
      const user = JSON.parse(userStr);

      if (!token || !user?._id) {
        toast.error("Bạn cần đăng nhập lại để thực hiện chức năng này");
        return;
      }

      // Tạo FormData object để gửi file
      const formData = new FormData();
      formData.append("avatar", file);

      // Gọi API để upload avatar
      const response = await axios.patch(
        `${API_URL}/user/${user._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Avatar Upload Response:", response.data);
      console.log(response.data.success);
      if (response.data.success) {
        // Cập nhật state và localStorage
        setAccountData({
          ...accountData,
          avatar: response.data.data.avatar,
        });
        const updatedUser = {
          ...user,
          avatar: response.data.data.avatar,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        // Cập nhật user trong context để Navbar cập nhật
        setUser(updatedUser);
        toast.success("Cập nhật ảnh đại diện thành công");
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error(
        error.response?.data?.message ||
          "Có lỗi xảy ra khi cập nhật ảnh đại diện"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Cài đặt</h1>
              <p className="text-sm text-gray-500">
                Quản lý thông tin tài khoản và cài đặt
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden sticky top-32">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-green-50 to-emerald-50 border-r-4 border-green-600 text-green-700 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <IconComponent className="text-lg" />
                    <span className="text-sm">{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Account Info Tab */}
            {activeTab === "account" && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Thông tin tài khoản
                  </h2>
                  <p className="text-sm text-gray-500">
                    Quản lý thông tin cá nhân của bạn
                  </p>
                </div>

                <form onSubmit={handleSaveAccount} className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-6 pb-6 border-b">
                    <div className="w-24 h-24 rounded-full overflow-hidden">
                      {accountData.avatar ? (
                        <img
                          src={accountData.avatar}
                          alt="User avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-3xl font-bold">
                          {accountData.firstName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {accountData.firstName} {accountData.lastName}
                      </h3>
                      <input
                        type="file"
                        id="avatar-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleAvatarChange(e.target.files[0])}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          document.getElementById("avatar-upload").click()
                        }
                        className="text-sm text-green-600 hover:text-green-700 font-medium"
                      >
                        Thay đổi ảnh đại diện
                      </button>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={accountData.firstName}
                        onChange={(e) =>
                          setAccountData({
                            ...accountData,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={accountData.lastName}
                        onChange={(e) =>
                          setAccountData({
                            ...accountData,
                            lastName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={accountData.email}
                        onChange={(e) =>
                          setAccountData({
                            ...accountData,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={accountData.phoneNumber}
                        onChange={(e) =>
                          setAccountData({
                            ...accountData,
                            phoneNumber: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-4 border-t">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
                    >
                      {loading ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Address Tab */}
            {activeTab === "address" && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      Địa chỉ của tôi
                    </h2>
                    <p className="text-sm text-gray-500">
                      Quản lý địa chỉ giao hàng
                    </p>
                  </div>
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                    onClick={handleSaveAddress}
                  >
                    {addressData ? "Lưu địa chỉ" : "Thêm địa chỉ"}
                  </button>
                </div>

                <div className="space-y-4">
                  <textarea
                    value={addressData || ""}
                    onChange={(e) => setAddressData(e.target.value)}
                    placeholder="Vui lòng nhập địa chỉ để tiện cho việc giao hàng"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows="3"
                  />
                </div>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === "password" && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Đổi mật khẩu
                  </h2>
                  <p className="text-sm text-gray-500">
                    Cập nhật mật khẩu để bảo vệ tài khoản
                  </p>
                </div>

                <form
                  onSubmit={handleSavePassword}
                  className="space-y-6 max-w-md"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mật khẩu hiện tại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={changePassword.currentPassword}
                      onChange={(e) =>
                        setChangePassword({
                          ...changePassword,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mật khẩu mới <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={changePassword.newPassword}
                      onChange={(e) =>
                        setChangePassword({
                          ...changePassword,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Xác nhận mật khẩu mới{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={changePassword.confirmPassword}
                      onChange={(e) =>
                        setChangePassword({
                          ...changePassword,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <svg
                        className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">
                          Lưu ý bảo mật
                        </h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Không chia sẻ mật khẩu với bất kỳ ai</li>
                          <li>• Sử dụng mật khẩu mạnh và độc nhất</li>
                          <li>• Thay đổi mật khẩu định kỳ</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
                    >
                      Đổi mật khẩu
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Toggle Component
const ToggleItem = ({ label, description, checked, onChange }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
          checked ? "bg-green-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
};

export default Settings;
