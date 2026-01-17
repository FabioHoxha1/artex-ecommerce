const { default: mongoose } = require("mongoose")
const CustomErrorHandler = require("../errors/customErrorHandler")

const errorHandler = (err, req, res, next) => {
  console.error("[v0] Error caught in handler:", {
    name: err.name,
    code: err.code,
    message: err.message,
  })

  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File size exceeds 20MB limit" })
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({ message: "Too many files. Maximum 10 images allowed." })
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({ message: `Unexpected file field: ${err.field}. Expected field name: 'images'` })
    }
    return res.status(400).json({ message: err.message || "File upload error" })
  }

  if (err.message && err.message.includes("Only image files are allowed")) {
    return res.status(400).json({ message: err.message })
  }

  if (err instanceof CustomErrorHandler) {
    res.status(err.statusCode).json({ message: err.message })
  } else if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).json({ message: err._message || err.message })
  } else {
    console.error("[v0] Unhandled error:", err)
    res.status(500).json({ message: err.message || "Something went wrong" })
  }
}

module.exports = errorHandler
