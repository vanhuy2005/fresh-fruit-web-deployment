import User from "../../models/user.model.js";

const getAllUsersService = async () => {
  try {
    const users = await User.find({}, { password: 0, __v: 0 })
      .sort({ createdAt: -1 });
    
    return users;
  } catch (error) {
    return error.message;
  }
};

export default getAllUsersService;
