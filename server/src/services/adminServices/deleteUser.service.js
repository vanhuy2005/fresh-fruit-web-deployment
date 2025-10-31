import User from "../../models/user.model.js";

const deleteUserService = async (userId) => {
  try {
    if (!userId) {
      return "ID user không được để trống";
    }

    const user = await User.findById(userId);
    if (!user) {
      return "User không tồn tại";
    }

    if (user.role === 'admin') {
      return "Không thể xóa tài khoản admin";
    }

    await User.findByIdAndDelete(userId);
    return "Xóa user thành công";
  } catch (error) {
    return error.message;
  }
};

export default deleteUserService;
