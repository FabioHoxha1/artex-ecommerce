const Category = require("../models/category")
const CustomErrorHandler = require("../errors/customErrorHandler")

const getAllCategories = async (req, res) => {
  const categories = await Category.find({})

  // Transform to the format expected by frontend
  const formattedCategories = {}
  categories.forEach((cat) => {
    formattedCategories[cat.name] = cat.subcategories
  })

  res.status(200).json({
    message: "success",
    categories: formattedCategories,
    rawCategories: categories, // Include full category objects with _id
  })
}

const createCategory = async (req, res) => {
  const { name, subcategories } = req.body

  if (!name) {
    throw new CustomErrorHandler(400, "Category name is required")
  }

  const existingCategory = await Category.findOne({ name })
  if (existingCategory) {
    throw new CustomErrorHandler(400, "Category with this name already exists")
  }

  const category = await Category.create({ name, subcategories: subcategories || [] })
  res.status(201).json({ message: "success", category })
}

const updateCategory = async (req, res) => {
  const { id } = req.params
  const { name, subcategories } = req.body

  if (!id) {
    throw new CustomErrorHandler(400, "Category ID is required")
  }

  const category = await Category.findByIdAndUpdate(id, { name, subcategories }, { new: true, runValidators: true })

  if (!category) {
    throw new CustomErrorHandler(404, "Category not found")
  }

  res.status(200).json({ message: "success", category })
}

const deleteCategory = async (req, res) => {
  const { id } = req.params

  if (!id) {
    throw new CustomErrorHandler(400, "Category ID is required")
  }

  const category = await Category.findByIdAndDelete(id)

  if (!category) {
    throw new CustomErrorHandler(404, "Category not found")
  }

  res.status(200).json({ message: "success", category })
}

const addSubcategory = async (req, res) => {
  const { id } = req.params
  const { subcategory } = req.body

  if (!id || !subcategory) {
    throw new CustomErrorHandler(400, "Category ID and subcategory are required")
  }

  const category = await Category.findById(id)

  if (!category) {
    throw new CustomErrorHandler(404, "Category not found")
  }

  if (!category.subcategories.includes(subcategory)) {
    category.subcategories.push(subcategory)
    await category.save()
  }

  res.status(200).json({ message: "success", category })
}

const setFeaturedProduct = async (req, res) => {
  console.log("[v0] setFeaturedProduct controller called")
  console.log("[v0] Params:", req.params)
  console.log("[v0] Body:", req.body)

  const { id } = req.params
  const { subcategory, productId } = req.body

  if (!id || !subcategory || !productId) {
    console.log("[v0] Missing required fields:", { id, subcategory, productId })
    throw new CustomErrorHandler(400, "Category id, subcategory and productId are required")
  }

  const category = await Category.findById(id)
  if (!category) {
    console.log("[v0] Category not found:", id)
    throw new CustomErrorHandler(404, "Category not found")
  }

  // Ensure subcategory exists
  if (!category.subcategories.includes(subcategory)) {
    console.log("[v0] Subcategory not found:", subcategory)
    console.log("[v0] Available subcategories:", category.subcategories)
    throw new CustomErrorHandler(400, "Subcategory does not exist on this category")
  }

  if (!category.featuredProducts) {
    category.featuredProducts = new Map()
  }

  // Set the featured product for this subcategory
  category.featuredProducts.set(subcategory, productId)

  // Mark the path as modified to ensure Mongoose saves the Map
  category.markModified("featuredProducts")

  await category.save()

  console.log("[v0] Featured product set successfully:", { subcategory, productId })
  res.status(200).json({ message: "success", category })
}

const removeSubcategory = async (req, res) => {
  const { id } = req.params
  const { subcategory } = req.body

  if (!id || !subcategory) {
    throw new CustomErrorHandler(400, "Category ID and subcategory are required")
  }

  const category = await Category.findById(id)

  if (!category) {
    throw new CustomErrorHandler(404, "Category not found")
  }

  category.subcategories = category.subcategories.filter((sub) => sub !== subcategory)
  await category.save()

  res.status(200).json({ message: "success", category })
}

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  addSubcategory,
  removeSubcategory,
  setFeaturedProduct,
}
