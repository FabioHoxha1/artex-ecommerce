"use client"

import { useState, useRef, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { AiOutlineClose } from "react-icons/ai"
import { FiX } from "react-icons/fi"

export const EditProjectModal = ({ project, onClose, onUpdated }) => {
  const [uploadedImages, setUploadedImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [projectTitle, setProjectTitle] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [projectClient, setProjectClient] = useState("")
  const [projectLocation, setProjectLocation] = useState("")
  const [completionDate, setCompletionDate] = useState("")
  const [featured, setFeatured] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const imgRef = useRef(null)
  const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000"

  // Initialize form with existing project data
  useEffect(() => {
    if (project) {
      setProjectTitle(project.title || "")
      setProjectDescription(project.description || "")
      setProjectClient(project.client || "")
      setProjectLocation(project.location || "")
      setFeatured(project.featured || false)
      if (project.completionDate) {
        setCompletionDate(new Date(project.completionDate).toISOString().split("T")[0])
      }
      if (project.images && project.images.length > 0) {
        setUploadedImages(project.images)
        setImagePreviews(
          project.images.map((img) => {
            if (img.startsWith("http")) return img
            return `${serverUrl}${img}`
          })
        )
      }
    }
  }, [project, serverUrl])

  const handleSave = async (e) => {
    e.preventDefault()

    if (uploadedImages.length === 0) {
      toast.error("Please have at least one project image")
      return
    }

    setIsSaving(true)
    const toastId = toast.loading("Updating project...")

    try {
      const userData = localStorage.getItem("UserData")
      if (!userData) {
        throw new Error("Please login first")
      }
      const parsedUserData = JSON.parse(userData)
      const LoginToken = parsedUserData?.loginToken

      if (!LoginToken) {
        throw new Error("Login token not found. Please login again.")
      }

      const imagesForPayload = uploadedImages.map((img) => {
        if (!img) return img
        if (typeof img === "string") return img
        return img.orig || img[1600] || img[1024] || img[640] || img[320] || Object.values(img)[0]
      })

      const updateData = {
        title: projectTitle,
        description: projectDescription,
        client: projectClient,
        location: projectLocation,
        featured: featured,
        images: imagesForPayload,
      }

      if (completionDate) {
        updateData.completionDate = new Date(completionDate)
      }

      await axios.patch(`${serverUrl}/api/v1/projects/${project._id}`, updateData, {
        headers: {
          authorization: `Bearer ${LoginToken}`,
          "Content-Type": "application/json",
        },
      })

      toast.update(toastId, {
        render: "Project updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      })

      onUpdated()
      onClose()
    } catch (error) {
      const errMessage = error.response?.data?.message || error.message
      toast.update(toastId, {
        render: `${errMessage}: Failed to update project`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleImageUpload = async (e) => {
    const files = e.currentTarget.files

    if (!files || files.length === 0) {
      toast.error("No images selected")
      return
    }

    const imageFiles = Array.from(files)

    if (uploadedImages.length + imageFiles.length > 4) {
      toast.error("Projects can have a maximum of 4 images")
      return
    }

    for (const imageFile of imageFiles) {
      if (imageFile.size > 20 * 1024 * 1024) {
        toast.error(`Image ${imageFile.name} exceeds 20MB limit`)
        return
      }
      if (!imageFile.type.startsWith("image/")) {
        toast.error(`${imageFile.name} is not a valid image file`)
        return
      }
    }

    const newPreviews = []
    for (const file of imageFiles) {
      const preview = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.readAsDataURL(file)
      })
      newPreviews.push(preview)
    }
    setImagePreviews((prev) => [...prev, ...newPreviews])

    setIsUploading(true)
    const asyncImgUploadToastId = toast.loading(`Uploading ${imageFiles.length} image(s)...`)

    try {
      const userData = localStorage.getItem("UserData")
      if (!userData) {
        throw new Error("Please login first")
      }
      const parsedUserData = JSON.parse(userData)
      const LoginToken = parsedUserData?.loginToken

      if (!LoginToken) {
        throw new Error("Login token not found. Please login again.")
      }

      const formData = new FormData()
      imageFiles.forEach((file) => {
        formData.append("images", file)
      })

      const { data } = await axios.post(`${serverUrl}/api/v1/projects/upload`, formData, {
        headers: {
          authorization: `Bearer ${LoginToken}`,
        },
      })

      if (data.images && data.images.length > 0) {
        const newImagePaths = data.images.map((img) => {
          return img.orig || img[1600] || img[1024] || img[640] || img[320] || Object.values(img)[0]
        })
        setUploadedImages((prev) => [...prev, ...newImagePaths])
        toast.update(asyncImgUploadToastId, {
          render: `${data.images.length} image(s) uploaded successfully`,
          type: "success",
          isLoading: false,
          autoClose: 3000,
        })
      } else {
        throw new Error("No images returned from server")
      }
    } catch (error) {
      setImagePreviews((prev) => prev.slice(0, prev.length - newPreviews.length))

      const errMessage = error.response?.data?.message || error.message
      toast.update(asyncImgUploadToastId, {
        render: `${errMessage}: Image upload failed`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      })
    } finally {
      setIsUploading(false)
      if (imgRef.current) {
        imgRef.current.value = null
      }
    }
  }

  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[3000] overflow-y-auto">
      <div className="fixed inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
      <div className="bg-white rounded-lg px-4 pt-5 pb-4 overflow-y-auto w-[99%] max-h-[98%] shadow-xl transform transition-all sm:max-w-3xl sm:w-full relative z-10 my-4">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-2">Edit Project</h2>
        <AiOutlineClose
          className="w-8 h-8 fill-[#a68b6a] absolute right-5 cursor-pointer top-5 hover:opacity-70"
          onClick={onClose}
        />
        <form className="pt-6" onSubmit={handleSave}>
          {imagePreviews.length > 0 && (
            <div className="mb-6">
              <label className="block font-medium mb-2">Project Images ({imagePreviews.length}/4)</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <div className="w-full h-32 border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                      <img
                        src={preview || "/placeholder.svg"}
                        alt={`Project preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-1 left-1 bg-[#a68b6a] text-white text-xs px-2 py-0.5 rounded">
                        Main
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="block font-medium mb-2">Project Title *</label>
            <input
              type="text"
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a68b6a] focus:border-transparent"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.currentTarget.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2">Description</label>
            <textarea
              rows="4"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a68b6a] focus:border-transparent resize-none"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.currentTarget.value)}
            />
          </div>

          <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-2">Client Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a68b6a] focus:border-transparent"
                value={projectClient}
                onChange={(e) => setProjectClient(e.currentTarget.value)}
              />
            </div>
            <div>
              <label className="block font-medium mb-2">Location</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a68b6a] focus:border-transparent"
                value={projectLocation}
                onChange={(e) => setProjectLocation(e.currentTarget.value)}
              />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-2">Completion Date</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a68b6a] focus:border-transparent"
                value={completionDate}
                onChange={(e) => setCompletionDate(e.currentTarget.value)}
              />
            </div>
            <div className="flex items-center pt-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-5 h-5 cursor-pointer accent-[#a68b6a]"
                />
                <span className="font-medium">Featured Project</span>
              </label>
            </div>
          </div>

          <div className="mb-6 relative">
            <label className="block font-medium mb-2">Add More Images</label>
            <input
              type="file"
              ref={imgRef}
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              multiple
              className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#a68b6a] file:text-white hover:file:bg-[#8b7355]"
              onChange={handleImageUpload}
              disabled={isUploading || uploadedImages.length >= 4}
            />
            <p className="text-sm text-gray-500 mt-1">
              {isUploading
                ? "Uploading..."
                : uploadedImages.length >= 4
                  ? "Maximum 4 images reached"
                  : `Upload up to ${4 - uploadedImages.length} more image(s).`}
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#a68b6a] text-white rounded-lg hover:bg-[#8b7355]"
              disabled={isUploading || isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}