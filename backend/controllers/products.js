const Product = require("../models/products")
const CustomErrorHandler = require("../errors/customErrorHandler")
const fs = require("fs")
const path = require("path")
const sharp = require("sharp")

const createProducts = async (req, res) => {
  if (req.body.discountPercentValue) {
    // Round discount percent to 2 decimals to avoid floating-point drift
    req.body.discountPercentValue = Number(Number.parseFloat(req.body.discountPercentValue).toFixed(2))
  }
  if (req.body.price) {
    req.body.price = Number.parseFloat(req.body.price)
  }
  if (req.body.stock) {
    req.body.stock = Number.parseInt(req.body.stock)
  }

  if (req.body.image && !req.body.images) {
    req.body.images = [req.body.image]
    delete req.body.image
  }

  // Ensure images is an array
  if (!req.body.images || !Array.isArray(req.body.images)) {
    throw new CustomErrorHandler(400, "At least one product image is required")
  }

  const product = await Product.create(req.body)
  res.status(201).json(product)
}

const getAllProducts = async (req, res) => {
  const products = await Product.find({})

  res.status(200).json({ message: "success", products })
}

const uploadProductImages = async (req, res) => {
  console.log("[v0] Upload request received")
  console.log("[v0] req.files:", req.files)
  console.log("[v0] req.file:", req.file)

  const uploadsDir = path.join(__dirname, "..", "uploads")
  const SIZES = [320, 640, 1024, 1600]

  // Handle multiple files: process each with sharp into multiple WebP sizes + optimized orig
  if (req.files && req.files.length > 0) {
    const processedImages = []
    for (const file of req.files) {
      try {
        const originalPath = path.join(uploadsDir, file.filename)
        const baseName = path.parse(file.filename).name
        const sizesMap = {}

        for (const w of SIZES) {
          const outName = `${baseName}-${w}.webp`
          const outPath = path.join(uploadsDir, outName)
          await sharp(originalPath)
            .rotate()
            .resize({ width: w, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(outPath)
          sizesMap[w] = `/uploads/${outName}`
        }

        // also write a compressed jpeg as the 'orig' fallback
        const origName = `${baseName}-orig.jpg`
        const origPath = path.join(uploadsDir, origName)
        await sharp(originalPath).rotate().jpeg({ quality: 85 }).toFile(origPath)
        sizesMap.orig = `/uploads/${origName}`

        // remove the raw uploaded original to save space
        try {
          fs.unlinkSync(originalPath)
        } catch (err) {
          console.warn("[v0] could not remove original upload", originalPath, err.message)
        }

        processedImages.push(sizesMap)
      } catch (err) {
        console.error('[v0] image processing error for file', file.filename, err)
      }
    }
    console.log("[v0] Processed images:", processedImages)
    return res.status(201).json({ images: processedImages })
  }

  // Handle single file (backward compatibility)
  if (req.file) {
    const file = req.file
    try {
      const originalPath = path.join(uploadsDir, file.filename)
      const baseName = path.parse(file.filename).name
      const sizesMap = {}
      for (const w of SIZES) {
        const outName = `${baseName}-${w}.webp`
        const outPath = path.join(uploadsDir, outName)
        await sharp(originalPath).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 80 }).toFile(outPath)
        sizesMap[w] = `/uploads/${outName}`
      }
      const origName = `${baseName}-orig.jpg`
      const origPath = path.join(uploadsDir, origName)
      await sharp(originalPath).rotate().jpeg({ quality: 85 }).toFile(origPath)
      sizesMap.orig = `/uploads/${origName}`
      try {
        fs.unlinkSync(originalPath)
      } catch (err) {
        console.warn("[v0] could not remove original upload", originalPath, err.message)
      }
      console.log("[v0] Uploaded single image processed:", sizesMap)
      return res.status(201).json({ image: { src: sizesMap }, images: [sizesMap] })
    } catch (err) {
      console.error('[v0] single image processing error', err)
      throw new CustomErrorHandler(500, 'Image processing failed')
    }
  }

  console.log("[v0] No files found in request")
  throw new CustomErrorHandler(400, "No image was uploaded. Please select at least one image file.")
}

const getAspecificProduct = async (req, res) => {
  const { id } = req.params

  if (!id) {
    throw new CustomErrorHandler(401, "parameters missing")
  }
  const checkIfProductExist = await Product.findById({ _id: id }).select({
    _id: 1,
    title: 1,
    description: 1,
    stock: 1,
    price: 1,
    discountPercentValue: 1,
    categories: 1,
    images: 1, // Select images array instead of image
  })
  if (!checkIfProductExist) {
    throw new CustomErrorHandler(404, "Products not found")
  }
  res.status(200).json({ message: "success", product: checkIfProductExist })
}

const deleteAspecificProduct = async (req, res) => {
  const { id } = req.params

  if (!id) {
    throw new CustomErrorHandler(401, "parameters missing")
  }

  const product = await Product.findById(id)
  if (!product) {
    throw new CustomErrorHandler(404, "Products not found")
  }

  if (product.images && product.images.length > 0) {
    product.images.forEach((imagePath) => {
      if (imagePath && imagePath.startsWith("/uploads/")) {
        const fullPath = path.join(__dirname, "..", imagePath)
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath)
        }
      }
    })
  }

  await Product.findByIdAndDelete(id)
  res.status(201).json({ message: "success", product })
}

const updateAspecificProduct = async (req, res) => {
  const updatedData = req.body
  const { id } = req.params
  if (!id || !updatedData) {
    throw new CustomErrorHandler(401, "parameters missing")
  }

  if (updatedData.discountPercentValue !== undefined) {
    // Round discount percent to 2 decimals to avoid floating-point drift
    updatedData.discountPercentValue = Number(Number.parseFloat(updatedData.discountPercentValue).toFixed(2))
  }
  if (updatedData.price !== undefined) {
    updatedData.price = Number.parseFloat(updatedData.price)
  }
  if (updatedData.stock !== undefined) {
    updatedData.stock = Number.parseInt(updatedData.stock)
  }

  if (updatedData.images && updatedData.images.length > 0) {
    const oldProduct = await Product.findById(id)
    if (oldProduct && oldProduct.images) {
      // Find images that are being removed
      const removedImages = oldProduct.images.filter((img) => !updatedData.images.includes(img))
      // Delete removed image files
      removedImages.forEach((imagePath) => {
        if (imagePath && imagePath.startsWith("/uploads/")) {
          const fullPath = path.join(__dirname, "..", imagePath)
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath)
          }
        }
      })
    }
  }

  const Updatedproduct = await Product.findByIdAndUpdate(id, updatedData, { runValidators: true, new: true })

  res.status(201).json({ message: "product successfully updated", product: Updatedproduct })
}

const searchProducts = async (req, res) => {
  const { title, pageNo, perPage } = req.query
  if (!title || !pageNo || !perPage) {
    throw new CustomErrorHandler(400, "parameters missing")
  }

  const searchLength = await Product.countDocuments({ title: { $regex: title, $options: "i" } })
  const searchedProducts = await Product.find({ title: { $regex: title, $options: "i" } })
    .skip((pageNo - 1) * perPage)
    .limit(perPage)

  res.status(201).json({ product: searchedProducts, productsLength: searchLength })
}

const sortByLowStockProducts = async (req, res) => {
  const { pageNo, perPage } = req.query
  if (!pageNo || !perPage) {
    throw new CustomErrorHandler(400, "parameters missing")
  }
  const productsLength = await Product.countDocuments()

  const sortedProducts = await Product.find({})
    .sort({ stock: 1 })
    .skip((pageNo - 1) * perPage)
    .limit(perPage)

  res.status(201).json({ products: sortedProducts, productsLength })
}

module.exports = {
  getAllProducts,
  createProducts,
  uploadProductImages,
  getAspecificProduct,
  deleteAspecificProduct,
  updateAspecificProduct,
  searchProducts,
  sortByLowStockProducts,
}
