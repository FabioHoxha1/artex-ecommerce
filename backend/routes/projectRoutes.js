const express = require("express")
const {
  getAllProjects,
  createProject,
  uploadProjectImages,
  getProjectById,
  deleteProject,
  updateProject,
} = require("../controllers/projects")
const { checkIfUserIsAnAdminMiddleware } = require("../middleware/adminAuthorisation")
const upload = require("../middleware/uploadMiddleware")

const router = express.Router()

router.route("/").post(checkIfUserIsAnAdminMiddleware, createProject).get(getAllProjects)

router.route("/upload").post(
  checkIfUserIsAnAdminMiddleware,
  (req, res, next) => {
    upload.array("images", 4)(req, res, (err) => {
      if (err) {
        console.error("[v0] Multer error:", err)
        return next(err)
      }
      next()
    })
  },
  uploadProjectImages,
)

router.route("/:id").get(getProjectById).delete(checkIfUserIsAnAdminMiddleware, deleteProject).patch(checkIfUserIsAnAdminMiddleware, updateProject)

module.exports = router