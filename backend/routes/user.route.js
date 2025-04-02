import express from "express"
import { deletemessages, getMatchingJobs, getMessages, getusers, login, logout, profileView, register, updateProfile } from "../controllers/user.controller.js"
import isAuthenticated from "../middlewares/isAuthenticated.js"
import { singleUpload } from "../middlewares/mutler.js"
 
const router = express.Router()

router.route("/register").post(singleUpload,register)
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/getusers").get(isAuthenticated, getusers)
router.route("/profile/matching-jobs").get(isAuthenticated, getMatchingJobs)
router.route("/profile/:id").get(isAuthenticated, profileView)
router.route("/profile/update").post(isAuthenticated,singleUpload,updateProfile)
router.route("/delallmsgsper").delete(isAuthenticated, deletemessages)
router.route("/chat/messages").get(isAuthenticated, getMessages)

export default router

