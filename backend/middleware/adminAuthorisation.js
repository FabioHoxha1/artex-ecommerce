const jwt = require("jsonwebtoken")
const CustomErrorHandler = require("../errors/customErrorHandler")
const Admin = require("../models/admin")
const User = require("../models/userData")

const checkIfUserIsAnAdminMiddleware = async (req, res, next) => {
  console.log("[v0] Admin middleware - checking authorization...")
  console.log("[v0] Auth header:", req.headers.authorization ? "Present" : "Missing")

  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("[v0] Auth failed: No valid auth header")
      const error = new CustomErrorHandler(401, "Unauthorized, please login")
      return next(error)
    }

    const token = authHeader.split(" ")[1]

    if (!token || token === " " || token.trim() === "") {
      console.log("[v0] Auth failed: Empty token")
      const error = new CustomErrorHandler(401, "Unauthorized, please login")
      return next(error)
    }

    // Verify token is valid
    console.log("[v0] Verifying JWT token...")
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN_KEY)
    console.log("[v0] JWT verified, checking user in database...")

    // Check if token exists in database
    const checkIfTokenExist = await User.findOne({ verificationToken: token })

    if (!checkIfTokenExist) {
      console.log("[v0] Auth failed: Token not found in database")
      const error = new CustomErrorHandler(401, "Unauthorized, please login again")
      return next(error)
    }

    if (checkIfTokenExist.adminStatus !== true) {
      console.log("[v0] Auth failed: User is not an admin")
      const error = new CustomErrorHandler(403, "Forbidden, admin access required")
      return next(error)
    }

    const adminData = await Admin.findOne({ userData: checkIfTokenExist._id })

    if (!adminData) {
      console.log("[v0] Auth failed: Admin data not found")
      const error = new CustomErrorHandler(403, "Forbidden, admin access required")
      return next(error)
    }

    console.log("[v0] Admin auth successful!")
    res.locals.actionDoer = { doerRank: adminData.adminRank, doerData: checkIfTokenExist }
    next()
  } catch (error) {
    console.log("[v0] Auth error:", error.name, error.message)
    if (error.name === "JsonWebTokenError") {
      return next(new CustomErrorHandler(401, "Invalid token, please login again"))
    } else if (error.name === "TokenExpiredError") {
      return next(new CustomErrorHandler(401, "Token expired, please login again"))
    }
    return next(error)
  }
}

module.exports = { checkIfUserIsAnAdminMiddleware }
