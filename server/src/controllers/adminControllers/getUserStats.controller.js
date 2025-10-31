import getUserStatsService from "../../services/adminServices/getUserStats.service.js";

const getUserStatsController = async (req, res) => {
  try {
    const result = await getUserStatsService();

    return res.status(200).json({
      message: "Lấy thống kê user thành công",
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server",
      success: false,
      error: error.message,
    });
  }
};

export default getUserStatsController;
