import express from "express";
import upload from "../middlewares/multer.ts";
import { isAuthenticated } from "../middlewares/isAuthenticated.ts";
import { addMenu, editMenu } from "../controller/menu.controller.ts";
const router = express.Router();
router.route("/").post(isAuthenticated, upload.single("image"), addMenu);
router.route("/:id").put(isAuthenticated, upload.single("image"),editMenu);


export default router;