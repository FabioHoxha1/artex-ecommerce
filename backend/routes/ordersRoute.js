const express = require("express")
const { postUserOrders, getAllOrders, updateOrderStatus, getOrderStats } = require("../controllers/Orders")
const { checkIfUserIsAnAdminMiddleware } = require("../middleware/adminAuthorisation")
const { checkIfUserIsLoggedIn } = require("../middleware/userAuthorisation")

const router = express.Router()

router.route("/placeOrders").post(checkIfUserIsLoggedIn, postUserOrders)
router.route("/admin/orders").get(checkIfUserIsAnAdminMiddleware, getAllOrders)
router.route("/admin/orders/stats").get(checkIfUserIsAnAdminMiddleware, getOrderStats)
router.route("/admin/orders/:userId/:orderId").patch(checkIfUserIsAnAdminMiddleware, updateOrderStatus)

module.exports = router
