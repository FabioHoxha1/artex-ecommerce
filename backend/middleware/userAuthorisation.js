const jwt = require("jsonwebtoken")
const CustomErrorHandler = require("../errors/customErrorHandler")
const User = require("../models/userData")

const checkIfUserIsLoggedIn = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new CustomErrorHandler(401, "Unauthorized, please login")
  }

  const token = authHeader.split(" ")[1]

  if (!token || token === " ") {
    throw new CustomErrorHandler(401, "Unauthorized, please login")
  }

  try {
    // Verify token is valid
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN_KEY)

    // Check if token exists in database
    const user = await User.findOne({ verificationToken: token })

    if (!user) {
      throw new CustomErrorHandler(401, "Unauthorized, please login again")
    }

    // Store user data in res.locals for use in controllers
    res.locals.actionDoer = { doerData: user }
    next()
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      throw new CustomErrorHandler(401, "Invalid token, please login again")
    } else if (error.name === "TokenExpiredError") {
      throw new CustomErrorHandler(401, "Token expired, please login again")
    }
    throw error
  }
}

module.exports = { checkIfUserIsLoggedIn }
