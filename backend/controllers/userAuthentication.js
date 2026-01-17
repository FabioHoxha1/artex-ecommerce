const User = require("../models/userData")
const jwt = require("jsonwebtoken")
const CustomErrorHandler = require("../errors/customErrorHandler")
const bcryptjs = require("bcryptjs")

const generateToken = (email, verificationStatus, expiryDate) => {
  const token = jwt.sign({ email, verificationStatus }, process.env.SECRET_TOKEN_KEY, { expiresIn: expiryDate })
  return token
}

// verify user's account

//Register
const registerUser = async (req, res) => {
  const { username, password } = req.body
  const email = req.body?.email?.toLowerCase()

  const checkIfEmailExists = await User.findOne({ email })
  const token = generateToken(email, "verified", "30d") // Auto-verify
  const hashedpassword = await bcryptjs.hash(password, 10)

  if (checkIfEmailExists) {
    throw new CustomErrorHandler(400, "Email has already been registered by another user")
  }

  await User.create({
    email,
    username,
    password: hashedpassword,
    verificationStatus: "verified", // Auto-verified
    verificationToken: token,
  })

  res.send("Your account has been created successfully! You can now log in.")
}

//LOGIN
const loginUser = async (req, res) => {
  const { password } = req.body
  const email = req.body?.email?.toLowerCase()

  const checkIfEmailExists = await User.findOne({ email }).lean()

  if (!checkIfEmailExists) {
    throw new CustomErrorHandler(400, "Incorect email or password")
  } else if (checkIfEmailExists && !(await bcryptjs.compare(password, checkIfEmailExists.password))) {
    throw new CustomErrorHandler(400, "Incorect email or password")
  } else if (checkIfEmailExists && (await bcryptjs.compare(password, checkIfEmailExists.password))) {
    const loginToken = generateToken(email, "verified", "30d")

    await User.findByIdAndUpdate({ _id: checkIfEmailExists._id }, { verificationToken: loginToken })

    res.json({
      message: "You have sucessfully logged in",
      userData: { ...checkIfEmailExists, loginToken },
    })
  }
}

// DELETE USERS

const deleteUser = async (req, res) => {
  const { id } = req.params
  if (!id) {
    throw new CustomErrorHandler(401, "parameters missing")
  }
  const user = await User.findByIdAndDelete(id)

  res.status(201).json({})
}

module.exports = { registerUser, loginUser, generateToken, deleteUser }
