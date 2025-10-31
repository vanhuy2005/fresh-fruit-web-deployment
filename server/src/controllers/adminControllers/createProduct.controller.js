import createProductService from "../../services/adminServices/createProduct.service.js";

const createProductController = async (req, res) => {
  try {
    const productData = req.body;
    const files = req.files;

    const product = await createProductService(productData, files);

    if (typeof product === "string") {
      return res.status(400).json({
        message: product,
        success: false,
      });
    }

    return res.status(201).json({
      message: "Tạo sản phẩm thành công",
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server",
      error: error.message,
    });
  }
};

export default createProductController;
