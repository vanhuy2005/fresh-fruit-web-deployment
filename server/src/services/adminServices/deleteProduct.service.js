import Product from "../../models/product.model.js";

const deleteProductService = async (productId) => {
  try {
    const product = await Product.findById(productId);
    if (!product) return "Sản phẩm không tồn tại";

    await Product.findByIdAndDelete(productId);
    return "Xóa sản phẩm thành công";
    
  } catch (error) {
    return error.message;
  }
};

export default deleteProductService;
