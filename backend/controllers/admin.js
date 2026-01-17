const Admin = require("../models/admin")
const jwt = require("jsonwebtoken")
const CustomErrorHandler = require("../errors/customErrorHandler")
const bcryptjs = require("bcryptjs")
const User = require("../models/userData")
const mongoose = require("mongoose")

const createNewAdmin = async (req, res) => {
  const { adminRank } = req.body
  const email = req.body?.email?.toLowerCase()

  const { doerRank, doerData } = res.locals.actionDoer

  const checkIfEmailExistsinUsers = await User.findOne({ email })
  const checkIfEmailExistsinAdmin = await Admin.findOne({ email })

  if (checkIfEmailExistsinAdmin) {
    throw new CustomErrorHandler(400, "Email  has already been appointed admin status")
  }
  if (!checkIfEmailExistsinUsers) {
    throw new CustomErrorHandler(400, "Incorect credentials")
  } else if (checkIfEmailExistsinUsers && checkIfEmailExistsinUsers.verificationStatus === "pending") {
    throw new CustomErrorHandler(403, "User Email address must be verified before login")
  } else if (doerRank !== 1) {
    throw new CustomErrorHandler(400, "You arent eligible for this action")
  } else {
    // transaction allows for an atomic run where multiple function can be run and if one fail,the operation fails entirely
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      await Admin.create({ userData: checkIfEmailExistsinUsers._id, adminRank })
      await User.findByIdAndUpdate(checkIfEmailExistsinUsers._id, { adminStatus: true })

      await session.commitTransaction()

      res.status(201).json({ message: "User's admin appointment successful" })
    } catch (error) {
      await session.abortTransaction()
      throw new CustomErrorHandler(500, "Something went wrong")
    } finally {
      session.endSession()
    }
  }
}

const removeAdmin = async (req, res) => {
  const email = req.body?.email?.toLowerCase()

  const { doerRank, doerData } = res.locals.actionDoer

  const checkIfEmailExistsinUsers = await User.findOne({ email })
  const checkIfEmailExistsinAdmin = await User.findOne({ email })

  if (!checkIfEmailExistsinAdmin) {
    throw new CustomErrorHandler(400, "Email address is not an admin")
  } else if (!checkIfEmailExistsinUsers) {
    throw new CustomErrorHandler(400, "Incorect credentials")
  } else if (doerRank !== 1) {
    throw new CustomErrorHandler(400, "You arent eligible for this action")
  } else {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      await Admin.findOneAndDelete({ userData: checkIfEmailExistsinUsers._id })
      await User.findByIdAndUpdate(checkIfEmailExistsinUsers._id, { adminStatus: false })

      await session.commitTransaction()

      res.status(201).json({ message: "User admin status has been revoked" })
    } catch (error) {
      await session.abortTransaction()
      throw new CustomErrorHandler(500, "Something went wrong")
    } finally {
      session.endSession()
    }
  }
}

const getAdminDatas = async (req, res) => {
  const adminDatas = await Admin.find({}).populate("userData")
  res.status(200).json({ adminDatas })
}

// invalidate jwt after 6hours of time has elapsed since last activity of admins
const clearAdminJwt = async () => {
  const admins = await Admin.find({})

  for (const key of admins) {
    let {
      userData: { verificationToken },
    } = await key.populate("userData")

    if (new Date() - key.lastLogin > 6 * 60 * 60 * 1000) {
      verificationToken = ""
      await key.save()
    }
  }
}

const validateUserAsAnAdmin = async (req, res) => {
  res.locals = ""

  res.status(200).send("success")
}

const createFirstAdmin = async (req, res) => {
  const { email, password, username } = req.body

  // Check if any admin already exists
  const adminCount = await Admin.countDocuments()
  if (adminCount > 0) {
    throw new CustomErrorHandler(403, "Admin already exists. Use the admin panel to create additional admins.")
  }

  const emailLower = email.toLowerCase()

  // Check if user already exists
  const existingUser = await User.findOne({ email: emailLower })

  if (existingUser) {
    throw new CustomErrorHandler(400, "User with this email already exists")
  }

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    // Hash password
    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password, salt)

    // Create user
    const newUser = await User.create({
      username,
      email: emailLower,
      password: hashedPassword,
      verificationStatus: "verified",
      adminStatus: true,
    })

    // Create admin with rank 1 (super admin)
    await Admin.create({
      userData: newUser._id,
      adminRank: 1,
    })

    await session.commitTransaction()

    res.status(201).json({
      message: "First admin created successfully. You can now login with your credentials.",
      email: emailLower,
    })
  } catch (error) {
    await session.abortTransaction()
    throw new CustomErrorHandler(500, "Failed to create admin: " + error.message)
  } finally {
    session.endSession()
  }
}

const getAllAdmins = async (req, res) => {
  const admins = await Admin.find({}).populate("userData", "username email verificationStatus")

  const adminList = admins.map((admin) => ({
    _id: admin._id,
    username: admin.userData.username,
    email: admin.userData.email,
    adminRank: admin.adminRank,
    verificationStatus: admin.userData.verificationStatus,
  }))

  res.status(200).json({ admins: adminList })
}

const getAllUsers = async (req, res) => {
  const { pageNo = 1, perPage = 10 } = req.query

  const totalUsers = await User.countDocuments()
  const users = await User.find({})
    .select("username email verificationStatus adminStatus orders createdAt")
    .sort({ createdAt: -1 })
    .skip((pageNo - 1) * perPage)
    .limit(Number.parseInt(perPage))

  res.status(200).json({
    users,
    totalUsers,
    currentPage: Number.parseInt(pageNo),
    totalPages: Math.ceil(totalUsers / perPage),
  })
}

module.exports = {
  createNewAdmin,
  removeAdmin,
  getAdminDatas,
  clearAdminJwt,
  validateUserAsAnAdmin,
  createFirstAdmin,
  getAllAdmins,
  getAllUsers,
}
