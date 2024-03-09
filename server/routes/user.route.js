import express from "express";
import { deleteUser, getUser, getUsers, logout, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/verifyUser.js";

const router = express.Router();

router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.get("/getusers", verifyToken, getUsers);
router.get("/:userId", getUser);
router.post("/logout",logout);

export default router;