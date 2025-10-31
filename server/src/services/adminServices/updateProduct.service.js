import Product from "../../models/product.model.js";
import { uploadToCloudinary } from "../../utils/cloudinary.js";

const updateProductService = async (productId, updateData, updateFiles) => {
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return 'Không tìm thấy sản phẩm';
        }

        if (updateData.name && updateData.name !== product.name) {
            const existingProduct = await Product.findOne({ name: updateData.name.trim() });
            if (existingProduct) {
                return `Sản phẩm với tên ${updateData.name} đã tồn tại`;
            }
        }

        for (const key in updateData) {
            const value = updateData[key];
            if (key === 'price' && value <= 0) {
                return 'Giá trị sản phẩm phải lớn hơn 0';
            }
            if (key === 'offerPrice' && value >= (updateData.price ?? product.price)) {
                return 'Giá khuyến mãi phải nhỏ hơn giá gốc';
            }
            if (key === 'stock' && value < 0) {
                return 'Số lượng tồn kho không thể là số âm';
            }
            if (key === 'nutritionInfo' && typeof value === 'object') {
                product.nutritionInfo = {
                    ...product.nutritionInfo,
                    ...value,
                }
            }
            else {
                product[key] = value;
            }
        }

        if (updateFiles && updateFiles.length > 0) {
            product.image = await Promise.all(
                updateFiles.map((file) => uploadToCloudinary(file.path))
            );
        }

        await product.save();
        return product;
    }
    catch (error) {
        return error.message;
    }
};

export default updateProductService;
