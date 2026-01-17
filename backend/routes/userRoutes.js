const express = require("express")
const { updateUserProfile, getUserProfile, getDashboardStats } = require("../controllers/users")
const { checkIfUserIsAnAdminMiddleware } = require("../middleware/adminAuthorisation")
const { checkIfUserIsLoggedIn } = require("../middleware/userAuthorisation")

const router = express.Router()

router.route("/profile").get(checkIfUserIsLoggedIn, getUserProfile)
router.route("/profile").patch(checkIfUserIsLoggedIn, updateUserProfile)

router.route("/admin/dashboard-stats").get(checkIfUserIsAnAdminMiddleware, getDashboardStats)

module.exports = router
