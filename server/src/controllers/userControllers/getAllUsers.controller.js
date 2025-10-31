import getAllUserService from "../../services/userServices/getAllUsers.service.js";

const getAllUserController = async (req, res) => {
    try {
        const users = await getAllUserService();
        return res.status(200).json({
            message: 'Danh sách toàn bộ users',
            success: true,
            users: users,
        });
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};  

export default getAllUserController;
