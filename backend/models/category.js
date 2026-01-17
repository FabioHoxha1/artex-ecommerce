const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
    },
    subcategories: {
      type: [String],
      default: [],
    },
    // Map subcategory name -> featured product id (string)
    featuredProducts: {
      type: Map,
      of: String,
      default: {},
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Category", categorySchema)
