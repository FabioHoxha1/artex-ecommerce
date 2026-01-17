const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product's title is required"],
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      default: null,
    },
    stock: {
      type: Number,
      default: function () {
        return !this.stock && 0
      },
    },
    discountPercentValue: {
      type: Number,
      default: function () {
        return !this.discountPercentValue && 0
      },
    },
    images: {
      type: [String],
      required: [true, "At least one product image is required"],
      validate: {
        validator: (v) => v && v.length > 0,
        message: "At least one product image is required",
      },
    },
    categories: {
      type: Map,
      of: [String],
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

productSchema.virtual("image").get(function () {
  return this.images && this.images.length > 0 ? this.images[0] : null
})

module.exports = mongoose.model("Product", productSchema)
