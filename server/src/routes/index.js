import express from "express";

//Routes imports
import serverConfig from "../configs/server.config.js";
import authRoutes from "./api/auth.route.js";
import cartRoutes from "./api/cart.route.js";
import categoryRoutes from "./api/category.route.js";
import orderRoutes from "./api/order.route.js";
import paymentRoutes from "./api/payment.route.js";
import productRoutes from "./api/product.route.js";
import testRoutes from "./api/test.route.js";
import userRoutes from "./api/user.route.js";

const apiRoutes = express.Router();

apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/categories", categoryRoutes);
apiRoutes.use("/products", productRoutes);
apiRoutes.use("/cart", cartRoutes);
apiRoutes.use("/payment", paymentRoutes);
apiRoutes.use("/orders", orderRoutes);
apiRoutes.use("/users", userRoutes);

if (!serverConfig.isPro) {
  apiRoutes.use("/test", testRoutes);
}

export default apiRoutes;
