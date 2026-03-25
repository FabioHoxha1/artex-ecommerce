const ContactMessage = require("../models/contactMessage")
const CustomErrorHandler = require("../errors/customErrorHandler")

// Submit a contact message (public endpoint)
const submitContactMessage = async (req, res) => {
  const { name, email, message } = req.body

  if (!name || !email || !message) {
    throw new CustomErrorHandler(400, "Please provide name, email, and message")
  }

  const contactMessage = await ContactMessage.create({
    name,
    email,
    message,
  })

  res.status(201).json({
    success: true,
    message: "Your message has been sent successfully. We will get back to you soon!",
  })
}

// Get all contact messages (admin only)
const getAllContactMessages = async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query

  const filter = {}
  if (status && ["unread", "read", "replied"].includes(status)) {
    filter.status = status
  }

  const totalMessages = await ContactMessage.countDocuments(filter)
  const messages = await ContactMessage.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number.parseInt(limit))

  const unreadCount = await ContactMessage.countDocuments({ status: "unread" })

  res.status(200).json({
    success: true,
    messages,
    totalMessages,
    unreadCount,
    currentPage: Number.parseInt(page),
    totalPages: Math.ceil(totalMessages / limit),
  })
}

// Get a single contact message (admin only)
const getContactMessage = async (req, res) => {
  const { id } = req.params

  const message = await ContactMessage.findById(id)

  if (!message) {
    throw new CustomErrorHandler(404, "Message not found")
  }

  res.status(200).json({
    success: true,
    message,
  })
}

// Update message status (admin only)
const updateMessageStatus = async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  if (!status || !["unread", "read", "replied"].includes(status)) {
    throw new CustomErrorHandler(400, "Please provide a valid status (unread, read, or replied)")
  }

  const message = await ContactMessage.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  )

  if (!message) {
    throw new CustomErrorHandler(404, "Message not found")
  }

  res.status(200).json({
    success: true,
    message,
  })
}

// Delete a contact message (admin only)
const deleteContactMessage = async (req, res) => {
  const { id } = req.params

  const message = await ContactMessage.findByIdAndDelete(id)

  if (!message) {
    throw new CustomErrorHandler(404, "Message not found")
  }

  res.status(200).json({
    success: true,
    message: "Message deleted successfully",
  })
}

module.exports = {
  submitContactMessage,
  getAllContactMessages,
  getContactMessage,
  updateMessageStatus,
  deleteContactMessage,
}