const express = require("express")
const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  addSubcategory,
  removeSubcategory,
  setFeaturedProduct,
} = require("../controllers/categories")
const { checkIfUserIsAnAdminMiddleware } = require("../middleware/adminAuthorisation")

const router = express.Router()

router.use((req, res, next) => {
  console.log("[v0] Category route hit:", req.method, req.originalUrl)
  console.log("[v0] Route params:", req.params)
  next()
})

router.route("/").get(getAllCategories).post(checkIfUserIsAnAdminMiddleware, createCategory)
router
  .route("/:id")
  .patch(checkIfUserIsAnAdminMiddleware, updateCategory)
  .delete(checkIfUserIsAnAdminMiddleware, deleteCategory)
router.route("/:id/subcategory/add").post(checkIfUserIsAnAdminMiddleware, addSubcategory)
router.route("/:id/subcategory/remove").post(checkIfUserIsAnAdminMiddleware, removeSubcategory)
router.route("/:id/subcategory/feature").post(checkIfUserIsAnAdminMiddleware, setFeaturedProduct)

module.exports = router
