const express = require("express")
const {
  createNewAdmin,
  removeAdmin,
  validateUserAsAnAdmin,
  getAdminDatas,
  createFirstAdmin,
  getAllAdmins,
  getAllUsers,
} = require("../controllers/admin")
const { checkIfUserIsAnAdminMiddleware } = require("../middleware/adminAuthorisation")

const router = express.Router()

router.route("/createFirstAdmin").post(createFirstAdmin)

router.route("/checkIfUserIsAdmin").get(checkIfUserIsAnAdminMiddleware, validateUserAsAnAdmin)
router.route("/createNewAdmin").post(checkIfUserIsAnAdminMiddleware, createNewAdmin)
router.route("/getAdminDatas").post(checkIfUserIsAnAdminMiddleware, getAdminDatas)
router.route("/removeAdmin").delete(checkIfUserIsAnAdminMiddleware, removeAdmin)
router.route("/all-admins").get(checkIfUserIsAnAdminMiddleware, getAllAdmins)
router.route("/all-users").get(checkIfUserIsAnAdminMiddleware, getAllUsers)

module.exports = router
