const User = require("../models/userData")
const CustomErrorHandler = require("../errors/customErrorHandler")
const Product = require("../models/products")

const postUserOrders = async (req, res) => {
  const { orderDetails } = req.body
  const { products } = orderDetails

  const email = req.body?.orderDetails?.email?.toLowerCase()

  if (!orderDetails.phoneNumber) {
    throw new CustomErrorHandler(400, "Phone number is required")
  }

  let isOrderAboveLimit = false
  for (const key of products) {
    const findProducts = await Product.findById(key.productId)
    if (!findProducts) {
      throw new CustomErrorHandler(404, `Product with ID ${key.productId} not found`)
    }
    if (key.quantity > findProducts.stock) {
      isOrderAboveLimit = true
    }
  }

  const checkIfEmailExists = await User.findOne({ email })
  if (!checkIfEmailExists) {
    throw new CustomErrorHandler(403, "Email address associated with the account must be used ")
  } else if (isOrderAboveLimit) {
    throw new CustomErrorHandler(403, "One or more product quantities selected is more than the amount in stock")
  } else {
    try {
      // Update stock for all products
      for (const key of products) {
        const findProducts = await Product.findById(key.productId)
        const newStock = findProducts.stock - key.quantity

        await Product.findByIdAndUpdate(key.productId, { stock: newStock }, { new: true })
      }

      const orderWithStatus = {
        ...orderDetails,
        deliveryStatus: "pending",
        paymentStatus: "pending",
      }

      await User.findOneAndUpdate({ email }, { $push: { orders: orderWithStatus } }, { new: true })

      res.status(201).json({ message: "Order placed successfully", success: true })
    } catch (error) {
      console.error("Error during order processing:", error)
      throw new CustomErrorHandler(500, "Error processing order. Please try again or contact support.")
    }
  }
}

const getAllOrders = async (req, res) => {
  const { pageNo = 1, perPage = 10 } = req.query

  const users = await User.find({ "orders.0": { $exists: true } })
    .select("username email orders")
    .sort({ "orders.date": -1 })

  // Flatten all orders from all users and populate product details
  const allOrders = []
  for (const user of users) {
    for (const order of user.orders) {
      // Populate product details for each product in the order
      const productsWithDetails = await Promise.all(
        order.products.map(async (product) => {
          const productDetails = await Product.findById(product.productId).select("title images price")
          return {
            productId: product.productId,
            quantity: product.quantity,
            title: productDetails?.title || "Unknown Product",
            image: productDetails?.images?.[0] || "",
            price: productDetails?.price || 0,
          }
        }),
      )

      allOrders.push({
        ...order.toObject(),
        products: productsWithDetails,
        userId: user._id,
        userEmail: user.email,
        orderId: order._id,
      })
    }
  }

  // Sort by date (newest first)
  allOrders.sort((a, b) => new Date(b.date) - new Date(a.date))

  const totalOrders = allOrders.length
  const startIndex = (pageNo - 1) * perPage
  const paginatedOrders = allOrders.slice(startIndex, startIndex + Number.parseInt(perPage))

  res.status(200).json({
    orders: paginatedOrders,
    totalOrders,
    currentPage: Number.parseInt(pageNo),
    totalPages: Math.ceil(totalOrders / perPage),
  })
}

const updateOrderStatus = async (req, res) => {
  const { userId, orderId } = req.params
  const { deliveryStatus, paymentStatus } = req.body

  if (!userId || !orderId) {
    throw new CustomErrorHandler(400, "User ID and Order ID are required")
  }

  const user = await User.findById(userId)
  if (!user) {
    throw new CustomErrorHandler(404, "User not found")
  }

  const order = user.orders.id(orderId)
  if (!order) {
    throw new CustomErrorHandler(404, "Order not found")
  }

  const previousDeliveryStatus = order.deliveryStatus
  const previousPaymentStatus = order.paymentStatus

  // Check if order is being cancelled (either delivery or payment status changed to cancelled)
  const isBeingCancelled =
    (deliveryStatus === "cancelled" && previousDeliveryStatus !== "cancelled") ||
    (paymentStatus === "cancelled" && previousPaymentStatus !== "cancelled")

  // Restore stock if order is being cancelled for the first time
  if (isBeingCancelled && previousDeliveryStatus !== "cancelled" && previousPaymentStatus !== "cancelled") {
    try {
      for (const item of order.products) {
        const product = await Product.findById(item.productId)
        if (product) {
          const restoredStock = product.stock + item.quantity
          await Product.findByIdAndUpdate(item.productId, { stock: restoredStock }, { new: true })
        }
      }
    } catch (error) {
      console.error("Error restoring stock:", error)
      throw new CustomErrorHandler(500, "Error restoring stock. Please try again.")
    }
  }

  if (deliveryStatus) {
    order.deliveryStatus = deliveryStatus
  }
  if (paymentStatus) {
    order.paymentStatus = paymentStatus
  }

  await user.save()

  res.status(200).json({
    message: isBeingCancelled ? "Order cancelled and stock restored successfully" : "Order status updated successfully",
    order,
  })
}

const getOrderStats = async (req, res) => {
  const users = await User.find({ "orders.0": { $exists: true } }).select("orders")

  let totalOrders = 0
  let totalSales = 0
  let pendingOrders = 0
  let deliveredOrders = 0

  users.forEach((user) => {
    user.orders.forEach((order) => {
      totalOrders++
      totalSales += order.totalAmount || 0
      if (order.deliveryStatus === "pending") pendingOrders++
      if (order.deliveryStatus === "delivered") deliveredOrders++
    })
  })

  res.status(200).json({
    totalOrders,
    totalSales,
    pendingOrders,
    deliveredOrders,
  })
}

module.exports = { postUserOrders, getAllOrders, updateOrderStatus, getOrderStats }
