const express = require("express")
const {
  getAllProducts,
  uploadProductImages,
  createProducts,
  getAspecificProduct,
  deleteAspecificProduct,
  searchProducts,
  updateAspecificProduct,
  sortByLowStockProducts,
} = require("../controllers/products")
const { checkIfUserIsAnAdminMiddleware } = require("../middleware/adminAuthorisation")
const upload = require("../middleware/uploadMiddleware")

const router = express.Router()

router.route("/").post(checkIfUserIsAnAdminMiddleware, createProducts).get(getAllProducts)

router.route("/upload").post(
  checkIfUserIsAnAdminMiddleware,
  (req, res, next) => {
    upload.array("images", 10)(req, res, (err) => {
      if (err) {
        console.error("[v0] Multer error:", err)
        // Let the error handler middleware deal with it
        return next(err)
      }
      next()
    })
  },
  uploadProductImages,
)

router.route("/getProduct/:id").get(getAspecificProduct)
router.route("/deleteProduct/:id").delete(checkIfUserIsAnAdminMiddleware, deleteAspecificProduct)
router.route("/editAndupdateProduct/:id").patch(checkIfUserIsAnAdminMiddleware, updateAspecificProduct)
router.route("/searchProducts").get(searchProducts)
router.route("/sortByLowStockProducts").get(sortByLowStockProducts)

module.exports = router
