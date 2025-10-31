import deleteUserService from "../../services/userServices/deleteUser.service.js";

const deleteUserController = async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await deleteUserService(userId);

        if (result === 'User not found') {
            return res.status(404).json({
                message: result
            });
        }

        return res.status(200).json({
            message: result,
            success: true,
        });

    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error
        });
    }
};

export default deleteUserController;
