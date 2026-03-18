"use client"

import { useRef, useState, useEffect } from "react"
import { createPortal } from "react-dom"
import axios from "axios"
import { useCategories } from "../../../hooks/useCategories"
import { toast } from "react-toastify"
import { AiOutlineClose } from "react-icons/ai"
import { FiX } from "react-icons/fi"
import { FullpageSpinnerLoader } from "../../../components/loaders/spinnerIcon"

export const EditAndupdateProductModal = ({
  isEditAndUpdateModalOn,
  setIsEditAndUpdateModal,
  productDetails,
  setProductDetails,
  setIsFetchingUpdatedDataLoading,
  isFetchingUpdatedDataLoading,
}) => {
  const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000"
  const [imagePreviews, setImagePreviews] = useState([])
  const [productCategories, setProductCategories] = useState({})
  const [isUploading, setIsUploading] = useState(false)

  const { _id, title, description, stock, price, discountPercentValue, categories, images } = productDetails

  useEffect(() => {
    if (images && images.length > 0) {
      const previews = images.map((img) => (img.startsWith("/uploads/") ? `${serverUrl}${img}` : img))
      setImagePreviews(previews)
    } else {
      setImagePreviews([])
    }
  }, [images, serverUrl])

  // use shared categories hook to prevent multiple concurrent requests
  const { categories: fetchedCategories } = useCategories()

  useEffect(() => {
    if (fetchedCategories && Object.keys(fetchedCategories).length > 0) {
      setProductCategories(fetchedCategories)
    } else {
      setProductCategories({})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedCategories])

  const imgRef = useRef(null)

  const handleCheckedCategories = (e) => {
    const categoryName = e.target.name
    const subCategoryValue = e.target.value

    if (e.target.checked) {
      setProductDetails((prevData) => {
        const currentCategories = prevData.categories[categoryName] || []
        return {
          ...prevData,
          categories: {
            ...prevData.categories,
            [categoryName]: [...currentCategories, subCategoryValue],
          },
        }
      })
    } else {
      setProductDetails((prevData) => {
        const updatedSubCategories = (prevData.categories[categoryName] || []).filter(
          (subCategory) => subCategory !== subCategoryValue,
        )
        if (updatedSubCategories.length === 0) {
          const { [categoryName]: removed, ...remainingCategories } = prevData.categories
          return { ...prevData, categories: remainingCategories }
        }
        return {
          ...prevData,
          categories: {
            ...prevData.categories,
            [categoryName]: updatedSubCategories,
          },
        }
      })
    }
  }

  const UpdateProduct = async (e) => {
    e.preventDefault()

    if (!images || images.length === 0) {
      toast.error("Please upload at least one product image")
      return
    }

    setIsFetchingUpdatedDataLoading(true)

const formData = {
  title,
  categories,
  images,
}

// Only add optional fields if they have values
if (description && description.trim() !== "") {
  formData.description = description
}

if (price !== "" && price !== null && price !== undefined && !isNaN(Number(price))) {
  formData.price = Number.parseFloat(price)
}

if (stock !== "" && stock !== null && stock !== undefined && !isNaN(Number(stock))) {
  formData.stock = Number.parseInt(stock)
}

if (discountPercentValue !== "" && discountPercentValue !== null && discountPercentValue !== undefined && !isNaN(Number(discountPercentValue))) {
  formData.discountPercentValue = Number(Number.parseFloat(discountPercentValue).toFixed(2))
}

    const asyncCreateProductToastId = toast.loading("Product data upload in progress")

    try {
      const LoginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || " "

      await axios.patch(`${serverUrl}/api/v1/products/editAndupdateProduct/${_id}`, formData, {
        headers: {
          authorization: `Bearer ${LoginToken}`,
          "Content-Type": "application/json",
        },
      })

      imgRef.current.value = null
      const resetCategories = {}
      Object.keys(productCategories).forEach((key) => {
        resetCategories[key] = []
      })
      setProductDetails({
        title: "",
        description: "",
        stock: "",
        price: "",
        discountPercentValue: "",
        categories: resetCategories,
        images: [],
      })
      setImagePreviews([])

      for (const key of e.target) {
        key.checked = false
      }

      toast.update(asyncCreateProductToastId, {
        render: "Product data has successfully been updated",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      })

      setIsFetchingUpdatedDataLoading(false)
      setIsEditAndUpdateModal(false)
    } catch (error) {
      let errMessage
      if (!error?.response?.data) errMessage = error?.message
      else {
        errMessage = error?.response?.data?.message
      }
      toast.update(asyncCreateProductToastId, {
        render: `${errMessage} : Product data update failed`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      })
      setIsFetchingUpdatedDataLoading(false)
    }
  }

  const handleImageUpload = async (e) => {
    const files = e.currentTarget.files

    if (!files || files.length === 0) {
      toast.error("No images selected")
      return
    }

    const imageFiles = Array.from(files)

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
      const LoginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || " "
      const formData = new FormData()
      imageFiles.forEach((file) => {
        formData.append("images", file)
      })

      const { data } = await axios.post(`${serverUrl}/api/v1/products/upload`, formData, {
        headers: {
          authorization: `Bearer ${LoginToken}`,
          // Don't set Content-Type - let axios handle it for multipart/form-data
        },
      })

      if (data.images && data.images.length > 0) {
        setProductDetails((prevData) => ({
          ...prevData,
          images: [...(prevData.images || []), ...data.images],
        }))

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
      let errMessage
      if (!error?.response?.data) errMessage = error?.message
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
    setProductDetails((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, i) => i !== index),
    }))
  }

  const modalContent = (
    <>
      {isFetchingUpdatedDataLoading && <FullpageSpinnerLoader />}
      <div
        className={`fixed bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 flex items-center justify-center overflow-y-auto h-[100vh] z-[3000] transition-all duration-300 ${
          isEditAndUpdateModalOn ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div className="bg-white rounded-lg px-4 pt-5 pb-4 overflow-y-auto w-[99%] h-[98%] shadow-xl transform transition-all sm:max-w-3xl sm:w-full relative z-10">
          <h2 className="text-xl sm:text-2xl font-bold text-center">Update existing product</h2>
          <AiOutlineClose
            className="w-9 h-9 fill-[#a68b6a] absolute right-5 cursor-pointer top-5"
            onClick={() => setIsEditAndUpdateModal(false)}
          />
          <form action="" className="pt-8" onSubmit={UpdateProduct}>
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

            <div className="mb-6">
              <label className="block font-medium mb-2">Title</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={title || ""}
                onChange={(e) => {
                  setProductDetails((prevData) => {
                    return { ...prevData, title: e.target.value }
                  })
                }}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block font-medium mb-2">Description</label>
              <textarea
                rows="4"
                className="w-full p-2 border border-gray-300 rounded-lg resize-none"
                value={description || ""}
                onChange={(e) => {
                  setProductDetails((prevData) => {
                    return { ...prevData, description: e.target.value }
                  })
                }}
                placeholder="Enter product description..."
              />
            </div>
            <div className="mb-6 flex gap-[2%] items-end justify-between">
              <div className="w-1/3">
                <label htmlFor="price" className="font-bold">
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="price"
                  value={price || ""}
                  onChange={(e) => {
                    setProductDetails((prevData) => {
                      return { ...prevData, price: Number(e.target.value) }
                    })
                  }}
                  className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="w-1/3">
                <label htmlFor="stock" className="font-bold">
                  Stock
                </label>
                <input
                  type="number"
                  id="stock"
                  value={stock || ""}
                  onChange={(e) => {
                    setProductDetails((prevData) => {
                      return { ...prevData, stock: Number(e.target.value) }
                    })
                  }}
                  className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="w-1/3">
                <label htmlFor="discount" className="font-bold">
                  Discount(%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="discount"
                  value={discountPercentValue || ""}
                  onChange={(e) => {
                    setProductDetails((prevData) => {
                      return { ...prevData, discountPercentValue: Number(e.target.value) }
                    })
                  }}
                  className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <section>
              <h2 className="text-lg font-bold mb-2">Select product categories</h2>
              {Object.keys(productCategories).length === 0 ? (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                  No categories available. Add categories from the Category Management page.
                </div>
              ) : (
                <div className="mb-6">
                  <div className="flex flex-wrap">
                    {Object.keys(productCategories).map((categoryTitle, index) => {
                      return (
                        <div key={index} className="pb-2 border border-gray-300 p-2">
                          <h2 className="font-medium text-[18px] mb-2">{categoryTitle} :</h2>
                          <div className="flex ml-4 gap-4 flex-wrap items-center">
                            {productCategories[categoryTitle].map((subCategoryTitle) => {
                              return (
                                <label key={subCategoryTitle} htmlFor="">
                                  {subCategoryTitle}
                                  <input
                                    className="ml-1"
                                    type="checkbox"
                                    name={categoryTitle}
                                    onChange={handleCheckedCategories}
                                    checked={categories[categoryTitle]?.includes(subCategoryTitle) || false}
                                    value={subCategoryTitle}
                                  />
                                </label>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </section>
            <div className="mb-10 relative">
              <div>
                <label className="block font-bold mb-2">Add More Images</label>
                <input
                  type="file"
                  ref={imgRef}
                  accept="image/*"
                  multiple
                  className="w-full p-4 border border-gray-300 rounded-lg"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {isUploading ? "Uploading..." : "Select multiple images to add. First image is the main display."}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <button
                type="submit"
                className="text-white bg-[#a68b6a] hover:bg-[#8b7355] w-[40%] max-w-[150px] p-2 rounded-lg"
                disabled={isUploading}
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )

  // Avoid mounting the heavy edit modal unless it's open or an update is in progress.
  // This prevents many hidden instances in the DOM for each product row and reduces
  // layout work that can cause flicker on the product management page.
  if (!isEditAndUpdateModalOn && !isFetchingUpdatedDataLoading) return null

  return createPortal(modalContent, document.body)
}
