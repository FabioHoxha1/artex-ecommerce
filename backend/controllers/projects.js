const Project = require("../models/project")
const CustomErrorHandler = require("../errors/customErrorHandler")
const fs = require("fs")
const path = require("path")
const sharp = require("sharp")

const createProject = async (req, res) => {
  if (req.body.image && !req.body.images) {
    req.body.images = [req.body.image]
    delete req.body.image
  }

  // Ensure images is an array with 1-4 images
  if (!req.body.images || !Array.isArray(req.body.images)) {
    throw new CustomErrorHandler(400, "At least one project image is required")
  }

  if (req.body.images.length > 4) {
    throw new CustomErrorHandler(400, "Projects can have a maximum of 4 images")
  }

  const project = await Project.create(req.body)
  res.status(201).json(project)
}

const getAllProjects = async (req, res) => {
  const { featured } = req.query
  const query = featured === "true" ? { featured: true } : {}
  const projects = await Project.find(query).sort({ createdAt: -1 })

  res.status(200).json({ message: "success", projects })
}

const uploadProjectImages = async (req, res) => {
  const uploadsDir = path.join(__dirname, "..", "uploads")
  const SIZES = [320, 640, 1024, 1600]

  // Handle multiple files: process each with sharp into multiple WebP sizes + optimized orig
  if (req.files && req.files.length > 0) {
    if (req.files.length > 4) {
      throw new CustomErrorHandler(400, "Projects can have a maximum of 4 images")
    }

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
        console.error("[v0] image processing error for file", file.filename, err)
      }
    }
    return res.status(201).json({ images: processedImages })
  }

  throw new CustomErrorHandler(400, "No images were uploaded. Please select 1-4 image files.")
}

const getProjectById = async (req, res) => {
  const { id } = req.params

  if (!id) {
    throw new CustomErrorHandler(401, "Project ID is required")
  }

  const project = await Project.findById(id)
  if (!project) {
    throw new CustomErrorHandler(404, "Project not found")
  }

  res.status(200).json({ message: "success", project })
}

const deleteProject = async (req, res) => {
  const { id } = req.params

  if (!id) {
    throw new CustomErrorHandler(401, "Project ID is required")
  }

  const project = await Project.findById(id)
  if (!project) {
    throw new CustomErrorHandler(404, "Project not found")
  }

  // Delete associated images
  if (project.images && project.images.length > 0) {
    project.images.forEach((imagePath) => {
      if (imagePath && imagePath.startsWith("/uploads/")) {
        const fullPath = path.join(__dirname, "..", imagePath)
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath)
        }
      }
    })
  }

  await Project.findByIdAndDelete(id)
  res.status(200).json({ message: "success", project })
}

const updateProject = async (req, res) => {
  const updatedData = req.body
  const { id } = req.params

  if (!id || !updatedData) {
    throw new CustomErrorHandler(401, "Project ID and update data are required")
  }

  if (updatedData.images && updatedData.images.length > 4) {
    throw new CustomErrorHandler(400, "Projects can have a maximum of 4 images")
  }

  // Handle image cleanup when images are removed
  if (updatedData.images && updatedData.images.length > 0) {
    const oldProject = await Project.findById(id)
    if (oldProject && oldProject.images) {
      const removedImages = oldProject.images.filter((img) => !updatedData.images.includes(img))
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

  const updatedProject = await Project.findByIdAndUpdate(id, updatedData, { runValidators: true, new: true })

  res.status(200).json({ message: "Project successfully updated", project: updatedProject })
}

module.exports = {
  createProject,
  getAllProjects,
  uploadProjectImages,
  getProjectById,
  deleteProject,
  updateProject,
}