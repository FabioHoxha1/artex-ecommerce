const express = require("express")
const {
  submitContactMessage,
  getAllContactMessages,
  getContactMessage,
  updateMessageStatus,
  deleteContactMessage,
} = require("../controllers/contact")
const { checkIfUserIsAnAdminMiddleware } = require("../middleware/adminAuthorisation")

const router = express.Router()

// Public route - anyone can submit a contact message
router.route("/submit").post(submitContactMessage)

// Admin routes - require admin authentication
router.route("/").get(checkIfUserIsAnAdminMiddleware, getAllContactMessages)
router.route("/:id").get(checkIfUserIsAnAdminMiddleware, getContactMessage)
router.route("/:id/status").patch(checkIfUserIsAnAdminMiddleware, updateMessageStatus)
router.route("/:id").delete(checkIfUserIsAnAdminMiddleware, deleteContactMessage)

module.exports = router