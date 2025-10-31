import deleteProductService from "../../services/adminServices/deleteProduct.service.js";

const deleteProductController = async (req, res) => {
  try {
    const { productId } = req.params;
    const result = await deleteProductService(productId);

    if (result === "Sản phẩm không tồn tại") {
      return res.status(404).json({
        message: result,
        success: false,
      });
    }

    return res.status(200).json({
      message: result,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server",
      error: error.message,
    });
  }
};

export default deleteProductController;
