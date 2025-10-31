import User from "../../models/user.model.js";

const deleteUserService = async (userId) => {
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return 'User not found';
        }
        return 'User deleted successfully';
    } catch (error) {
        return error.message;
    }
};

export default deleteUserService;
