const mongoose = require("mongoose")

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
    },
    description: {
      type: String,
      default: "",
    },
    client: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    completionDate: {
      type: Date,
      default: null,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    images: {
      type: [String],
      required: [true, "At least one project image is required"],
      validate: {
        validator: (v) => v && v.length > 0 && v.length <= 4,
        message: "Projects must have between 1 and 4 images",
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

projectSchema.virtual("image").get(function () {
  return this.images && this.images.length > 0 ? this.images[0] : null
})

module.exports = mongoose.model("Project", projectSchema)