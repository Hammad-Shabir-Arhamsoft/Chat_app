import { Router } from "express"
import { login, signUp } from "../controller/auth/user.js";

const router = Router();
router.route("/sign-up").post(signUp)
router.route("/sign-in").post(login)
export default router