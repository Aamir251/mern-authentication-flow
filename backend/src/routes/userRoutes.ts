import express from "express";
import { registerUser, loginUser, protectedPage, renewAccessToken, getCurrentUser } from "../controller/userController";
import {checkAuthentication} from "../middleware/checkAuthentication";

const router = express.Router()

router.post("/login", loginUser)
router.get("/currentUser", getCurrentUser)
router.post("/register", registerUser)
router.get("/protected",checkAuthentication, protectedPage)
router.post("/renewAccessToken", renewAccessToken);

export default router;