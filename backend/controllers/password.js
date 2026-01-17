const User = require("../models/userData")
const bcryptjs = require("bcryptjs")
const CustomErrorHandler = require("../errors/customErrorHandler")
const { generateToken } = require("./userAuthentication")

const handleForgotPasswordClick = async (req, res) => {
  const email = req.body?.email?.toLowerCase()

  const checkIfEmailExists = await User.findOne({ email })

  if (!checkIfEmailExists) {
    throw new CustomErrorHandler(400, "Email address hasnt been registered")
  } else if (checkIfEmailExists.verificationStatus !== "verified") {
    throw new CustomErrorHandler(403, "User account must be verified")
  }

  const token = generateToken(email, "verified", "1hr")
  await User.findByIdAndUpdate(checkIfEmailExists._id, { verificationToken: token }, { new: true }).exec()

  res.status(200).json({
    message: "Password reset token generated",
    resetToken: token,
    note: "Use this token to reset your password",
  })
}

// This will be used for updating the old password in the frontend
const changePassword = async (req, res) => {
  const token = req.headers.token
  const { password } = req.body
  const checkIfTokenExist = await User.findOne({ verificationToken: token })

  if (!checkIfTokenExist) {
    throw new CustomErrorHandler(400, "not authorized")
  } else {
    const hashedpassword = await bcryptjs.hash(password, 10)

    await User.findByIdAndUpdate(
      checkIfTokenExist._id,
      { password: hashedpassword, verificationToken: "" },
      { new: true },
    ).exec()
    res.status(201).send("password sucessfully changed")
  }
}

module.exports = { changePassword, handleForgotPasswordClick }
