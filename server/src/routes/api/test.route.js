import express from "express";
import {
  isAdmin,
  isAuthorized,
  isCustomer,
} from "../../middlewares/auth.middleware.js";
const testRoutes = express.Router();

testRoutes.get("/", async (req, res) => {
  res.send("Hello World");
});

testRoutes.use("/auth", isAuthorized, (req, res) => {
  res.send("You are authenticated");
});

testRoutes.use("/admin", isAdmin, (req, res) => {
  res.send("You are an admin");
});

testRoutes.use("/user", isCustomer, (req, res) => {
  res.send("You are a user");
});

export default testRoutes;
