"use client"

import { useState, useRef, useEffect } from "react"
import { useCategories } from "../../../hooks/useCategories"
import axios from "axios"
import { toast } from "react-toastify"
import { AiOutlineClose } from "react-icons/ai"
import { FiX } from "react-icons/fi"

export const AddNewProduct = ({ isAddNewProductClicked, setIsAddNewProductClicked }) => {
  const [uploadedImages, setUploadedImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [productTitle, setProductTitle] = useState("")
  const [productDescription, setProductDescription] = useState("")
  const [productDiscountPercentValue, setProductDiscountPercentValue] = useState(0)
  const [productPrice, setProductPrice] = useState("")
  const [productStock, setProductStock] = useState(0)
  const [categories, setCategories] = useState({})
  const [productCategories, setProductCategories] = useState({})
  const [isUploading, setIsUploading] = useState(false)

  const imgRef = useRef(null)
  // server URL
  const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000"
  // Use shared hook to avoid repeated concurrent network requests
  const { categories: fetchedCategories } = useCategories()

  // initialise local state when hook returns categories
  useEffect(() => {
    if (!fetchedCategories || Object.keys(fetchedCategories).length === 0) return
    if (Object.keys(productCategories).length === 0) {
      setProductCategories(fetchedCategories)
      const initialCategories = {}
      Object.keys(fetchedCategories).forEach((key) => {
        initialCategories[key] = []
      })
      setCategories(initialCategories)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedCategories])

  const handleCheckedCategories = (e) => {
    if (e.target.checked) {
      setCategories((categories) => {
        return {
          ...categories,
          [e.target.name]: [...(categories[e.target.name] || []), e.target.value],
        }
      })
    } else {
      if (categories[e.target.name]?.length === 0) {
        setCategories((categories) => {
          delete categories[e.target.name]
          return categories
        })
      }
      setCategories((categories) => {
        const uncheckedCategory = (categories[e.target.name] || []).filter((category) => category !== e.target.value)
        return { ...categories, [e.target.name]: uncheckedCategory }
      })
    }
  }

  const createProduct = async (e) => {
    e.preventDefault()

    if (uploadedImages.length === 0) {
      toast.error("Please upload at least one product image")
      return
    }

    // Map uploaded images to a compatible payload: backend product model expects array of strings.
    // uploadedImages may contain either string URLs (legacy) or objects with multiple sizes returned by the upload endpoint.
    const imagesForPayload = uploadedImages.map((img) => {
      if (!img) return img
      if (typeof img === "string") return img
      // prefer an explicitly generated orig, then a large size, then any available size
      return img.orig || img[1600] || img[1024] || img[640] || img[320] || Object.values(img)[0]
    })

    const formData = {
      title: productTitle,
      description: productDescription,
      images: imagesForPayload,
      categories: categories,
    }
    if (productPrice !== "" && !isNaN(Number(productPrice))) {
      formData.price = Number.parseFloat(productPrice)
    }
    if (productStock !== "" && !isNaN(Number(productStock))) {
      formData.stock = Number.parseInt(productStock)
    }
    if (productDiscountPercentValue !== "" && !isNaN(Number(productDiscountPercentValue))) {
      formData.discountPercentValue = Number(Number.parseFloat(productDiscountPercentValue).toFixed(2))
    }

    const asyncCreateProductToastId = toast.loading("Product data upload in progress")
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

      console.log("[v0] Token found, length:", LoginToken.length)

      await axios.post(`${serverUrl}/api/v1/products`, formData, {
        headers: {
          authorization: `Bearer ${LoginToken}`,
          "Content-Type": "application/json",
        },
      })

      // Reset form
      imgRef.current.value = null
      setUploadedImages([])
      setImagePreviews([])
      setProductTitle("")
      setProductDescription("")
      const resetCategories = {}
      Object.keys(productCategories).forEach((key) => {
        resetCategories[key] = []
      })
      setCategories(resetCategories)
      setProductPrice("")
      setProductStock(0)
      setProductDiscountPercentValue(0)
      for (const key of e.target) {
        key.checked = false
      }
      toast.update(asyncCreateProductToastId, {
        render: "Product data has successfully been uploaded",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      })
    } catch (error) {
      let errMessage
      if (!error.response?.data) errMessage = error.message
      else {
        errMessage = error.response.data.message
      }
      toast.update(asyncCreateProductToastId, {
        render: `${errMessage} : Product data upload failed`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      })
    }
  }

  const handleImageUpload = async (e) => {
    const files = e.currentTarget.files

    if (!files || files.length === 0) {
      toast.error("No images selected")
      return
    }

    const imageFiles = Array.from(files)
    console.log(
      "[v0] Selected files:",
      imageFiles.map((f) => ({ name: f.name, size: f.size, type: f.type })),
    )

    // Validate all files
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

    // Create previews
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

      console.log("[v0] Token found, length:", LoginToken.length)

      const formData = new FormData()
      imageFiles.forEach((file, index) => {
        console.log(`[v0] Appending file ${index}:`, file.name)
        formData.append("images", file)
      })

      console.log("[v0] Sending upload request to:", `${serverUrl}/api/v1/products/upload`)

      const { data } = await axios.post(`${serverUrl}/api/v1/products/upload`, formData, {
        headers: {
          authorization: `Bearer ${LoginToken}`,
        },
      })

      console.log("[v0] Upload response:", data)

      if (data.images && data.images.length > 0) {
        setUploadedImages((prev) => [...prev, ...data.images])
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
      console.error("[v0] Upload error:", error)
      console.error("[v0] Error response:", error.response?.data)
      setImagePreviews((prev) => prev.slice(0, prev.length - newPreviews.length))

      let errMessage
      if (!error.response?.data) errMessage = error.message
      else {
        errMessage = error.response.data.message
      }
      toast.update(asyncImgUploadToastId, {
        render: `${errMessage} : Image upload failed`,
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
    <div
      className={`fixed bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 flex items-center justify-center overflow-y-auto h-[100vh] z-[3000] transition-transform duration-300 ${
        isAddNewProductClicked ? "translate-y-0" : "translate-y-[100%]"
      }`}
    >
      <div className="fixed inset-0 transition-opacity">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
      <div className="bg-white rounded-lg px-4 pt-5 pb-4 overflow-y-auto w-[99%] h-[98%] shadow-xl transform transition-all sm:max-w-3xl sm:w-full relative z-10">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-2">Create a new product</h2>
        <AiOutlineClose
          className="w-8 h-8 fill-[#a68b6a] absolute right-5 cursor-pointer top-5 hover:opacity-70"
          onClick={() => setIsAddNewProductClicked(false)}
        />
        <form action="" className="pt-6" onSubmit={createProduct}>
          {imagePreviews.length > 0 && (
            <div className="mb-6">
              <label className="block font-medium mb-2">Product Images ({imagePreviews.length})</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <div className="w-full h-32 border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                      <img
                        src={preview || "/placeholder.svg"}
                        alt={`Product preview ${index + 1}`}
                        className="w-full h-full object-contain"
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
            <label className="block font-medium mb-2">Title</label>
            <input
              type="text"
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a68b6a] focus:border-transparent"
              value={productTitle}
              onChange={(e) => setProductTitle(e.currentTarget.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2">Description</label>
            <textarea
              rows="4"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a68b6a] focus:border-transparent resize-none"
              value={productDescription}
              onChange={(e) => setProductDescription(e.currentTarget.value)}
              placeholder="Enter product description..."
            />
          </div>

          <div className="mb-4 flex gap-3 items-end justify-between">
            <div className="flex-1">
              <label htmlFor="price" className="block font-medium mb-2">
                Price ($)
              </label>
              <input
                type="number"
                id="price"
                step="0.01"
                min="0"
                value={productPrice}
                onChange={(e) => setProductPrice(e.currentTarget.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a68b6a] focus:border-transparent"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="stock" className="block font-medium mb-2">
                Stock
              </label>
              <input
                type="number"
                id="stock"
                min="0"
                value={productStock}
                onChange={(e) => setProductStock(e.currentTarget.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a68b6a] focus:border-transparent"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="discount" className="block font-medium mb-2">
                Discount (%)
              </label>
              <input
                type="number"
                id="discount"
                min="0"
                max="100"
                step="0.01"
                value={productDiscountPercentValue}
                onChange={(e) => setProductDiscountPercentValue(e.currentTarget.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a68b6a] focus:border-transparent"
              />
            </div>
          </div>

          <section onChange={handleCheckedCategories}>
            <h2 className="text-lg font-bold mb-3">Product Categories</h2>
            {Object.keys(productCategories).length === 0 ? (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                <p className="text-yellow-800 font-medium">No categories available</p>
                <p className="text-sm text-yellow-600 mt-1">
                  Please add categories from the Category Management page before creating products.
                </p>
              </div>
            ) : (
              <div className="mb-4 space-y-4">
                {Object.keys(productCategories).map((categoryTitle) => {
                  return (
                    <div key={categoryTitle} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                      <h3 className="font-semibold text-base mb-3 capitalize">{categoryTitle}</h3>
                      {productCategories[categoryTitle].length === 0 ? (
                        <p className="text-sm text-gray-500 italic">
                          No subcategories available. Add them in Category Management.
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-3">
                          {productCategories[categoryTitle].map((subCategoryTitle) => {
                            return (
                              <label
                                key={subCategoryTitle}
                                className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50"
                              >
                                <input
                                  className="cursor-pointer"
                                  type="checkbox"
                                  name={categoryTitle}
                                  value={subCategoryTitle}
                                />
                                <span className="text-sm capitalize">{subCategoryTitle}</span>
                              </label>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          <div className="mb-6 relative">
            <label className="block font-medium mb-2">Product Images (You can select multiple)</label>
            <input
              type="file"
              ref={imgRef}
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              multiple
              className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#a68b6a] file:text-white hover:file:bg-[#8b7355]"
              onChange={handleImageUpload}
              disabled={isUploading}
            />
            <p className="text-sm text-gray-500 mt-1">
              {isUploading
                ? "Uploading..."
                : "Upload up to 10 images (max 20MB each). First image will be the main display image."}
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setIsAddNewProductClicked(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#a68b6a] text-white rounded-lg hover:bg-[#8b7355]"
              disabled={isUploading}
            >
              Create Product
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
