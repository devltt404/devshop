import express from "express";

//Routes imports
import serverConfig from "../configs/server.config.js";
import authRoutes from "./api/auth.route.js";
import cartRoutes from "./api/cart.route.js";
import categoryRoutes from "./api/category.route.js";
import productRoutes from "./api/product.route.js";
import testRoutes from "./api/test.route.js";

const apiRoutes = express.Router();

apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/category", categoryRoutes);
apiRoutes.use("/product", productRoutes);
apiRoutes.use("/cart", cartRoutes);

if (serverConfig.env === "dev") {
  apiRoutes.use("/test", testRoutes);
}

export default apiRoutes;