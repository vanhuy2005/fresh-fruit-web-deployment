import { addProductToCartService } from "../../services/cartServices/addProductToCart.service.js";

const addProductToCartController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { products } = req.body;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthenticated",
                success: false,
            });
        }

        if (!products || !Array.isArray(products)) {
            return res.status(400).json({
                message: "Products array is required",
                success: false,
            });
        }

        if (products.length === 0) {
            return res.status(400).json({
                message: "Products array cannot be empty",
                success: false,
            });
        }

        for (const product of products) {
            if (!product.productId) {
                return res.status(400).json({
                    message: "Product ID is required for all products",
                    success: false,
                });
            }
            if (!product.quantity || product.quantity < 1) {
                return res.status(400).json({
                    message: "Quantity must be at least 1 for all products",
                    success: false,
                });
            }
        }

        const result = await addProductToCartService(userId, products);

        return res.status(200).json({
            message: result.message,
            success: true,
            data: result.cart
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error adding products to cart',
            success: false,
            error: error.message,
        });
    }
};

export default addProductToCartController;
