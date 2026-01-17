const User = require("../models/userData")
const CustomErrorHandler = require("../errors/customErrorHandler")
const Product = require("../models/products")

const updateUserProfile = async (req, res) => {
  const { username, address, country, city, postalCode } = req.body
  const userId = res.locals.actionDoer.doerData._id

  if (!userId) {
    throw new CustomErrorHandler(401, "Unauthorized - Please login")
  }

  const updateData = {}
  if (username) updateData.username = username
  if (address) updateData.address = address
  if (country) updateData.country = country
  if (city) updateData.city = city
  if (postalCode) updateData.postalCode = postalCode

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true }).select(
    "-password -verificationToken",
  )

  if (!updatedUser) {
    throw new CustomErrorHandler(404, "User not found")
  }

  res.status(200).json({
    message: "Profile updated successfully",
    user: updatedUser,
  })
}

const getUserProfile = async (req, res) => {
  const userId = res.locals.actionDoer.doerData._id

  if (!userId) {
    throw new CustomErrorHandler(401, "Unauthorized - Please login")
  }

  const user = await User.findById(userId).select("-password -verificationToken")

  if (!user) {
    throw new CustomErrorHandler(404, "User not found")
  }

  const userObject = user.toObject()

  if (userObject.orders && userObject.orders.length > 0) {
    const ordersWithProductDetails = await Promise.all(
      userObject.orders.map(async (order) => {
        const productsWithDetails = await Promise.all(
          order.products.map(async (product) => {
            const productDetails = await Product.findById(product.productId).select("title images price")

            return {
              productId: product.productId,
              quantity: product.quantity,
              title: productDetails?.title || "Product not found",
              image: productDetails?.images?.[0] || "/placeholder.svg",
              price: productDetails?.price || 0,
            }
          }),
        )
        return {
          ...order,
          products: productsWithDetails,
        }
      }),
    )
    userObject.orders = ordersWithProductDetails
  }

  res.status(200).json({ user: userObject })
}

const getDashboardStats = async (req, res) => {
  const totalUsers = await User.countDocuments()
  const verifiedUsers = await User.countDocuments({ verificationStatus: "verified" })

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const recentUsers = await User.find({ createdAt: { $gte: thirtyDaysAgo } })
    .select("username email createdAt")
    .sort({ createdAt: -1 })
    .limit(10)

  const usersWithOrders = await User.find({ "orders.0": { $exists: true } }).select("orders")

  let totalOrders = 0
  let totalSales = 0

  usersWithOrders.forEach((user) => {
    user.orders.forEach((order) => {
      totalOrders++
      totalSales += order.totalAmount || 0
    })
  })

  res.status(200).json({
    totalUsers,
    verifiedUsers,
    totalOrders,
    totalSales,
    recentUsers,
  })
}

module.exports = { updateUserProfile, getUserProfile, getDashboardStats }
