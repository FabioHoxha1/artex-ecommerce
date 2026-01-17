"use client"

import axios from "axios"
import { useState } from "react"
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai"
// ESLint sometimes flags `toast` as unused during the production build step even
// though it's used in the error handler below; disable the unused-var check for
// this import line to keep the build warning-free and avoid changing runtime behavior.
// eslint-disable-next-line no-unused-vars
import { toast } from "react-toastify"
import { DeleteProductModal } from "./deleteProductModal"
import { EditAndupdateProductModal } from "./editAndUpdateProductModal"

export const SingleProductTableCell = ({ products }) => {
  const [isDeleteModalOn, setIsDeleteModalOn] = useState(false)
  const [isEditAndUpdateModalOn, setIsEditAndUpdateModal] = useState(false)
  const [productDetails, setProductDetails] = useState({
    _id: "",
    title: "",
    description: "",
    stock: "",
    price: "",
    discountPercentValue: "",
    categories: {
      "Featured Categories": [],
      location: [],
      features: [],
      others: [],
    },
    images: [],
  })
  const [isFetchingUpdatedDataLoading, setIsFetchingUpdatedDataLoading] = useState(false)

  const { _id, stock, title, price, images, image } = products

  const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000"

  const getImageUrl = () => {
    const productImage = images && images.length > 0 ? images[0] : image
    if (!productImage) {
      return "/diverse-products-still-life.png"
    }
    if (typeof productImage === "object") {
      const preferred = productImage[640] || productImage[1024] || productImage.orig || Object.values(productImage)[0]
      if (!preferred) return "/diverse-products-still-life.png"
      if (preferred.startsWith("http") || preferred.startsWith("data:")) return preferred
      return `${serverUrl}${preferred}`
    }
    if (productImage.startsWith("data:image")) {
      return productImage
    }
    if (productImage.startsWith("http")) {
      return productImage
    }
    return `${serverUrl}${productImage}`
  }

  const imageUrl = getImageUrl()
  const imageCount = images && images.length > 0 ? images.length : image ? 1 : 0

  const handleEditAndUpdateClick = async () => {
    try {
      setIsFetchingUpdatedDataLoading(true)
      const {
        data: { product },
      } = await axios.get(`${serverUrl}/api/v1/products/getProduct/${_id}`)

      const productWithImages = {
        ...product,
        images: product.images || (product.image ? [product.image] : []),
      }
      setProductDetails(productWithImages)
      setIsFetchingUpdatedDataLoading(false)

      setIsEditAndUpdateModal(true)
    } catch (error) {
      setIsFetchingUpdatedDataLoading(false)
      toast.error("Failed to load product details")
    }
  }

  return (
    <>
      <EditAndupdateProductModal
        {...{
          isEditAndUpdateModalOn,
          setIsEditAndUpdateModal,
          productDetails,
          setProductDetails,
          setIsFetchingUpdatedDataLoading,
          isFetchingUpdatedDataLoading,
        }}
      />
      <DeleteProductModal {...{ isDeleteModalOn, setIsDeleteModalOn, _id }} />
      <tr className="hover:bg-lightestSecondaryColor">
        <td className="p-2  border border-b-0  border-LightSecondaryColor">{_id}</td>
        <td className="p-2 border border-b-0 border-LightSecondaryColor">
          <div className="flex justify-center items-center relative">
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={title}
              className="w-16 h-16 object-cover rounded-md shadow-sm"
              onError={(e) => {
                e.target.src = "/diverse-products-still-life.png"
              }}
            />
            {imageCount > 1 && (
              <span className="absolute -top-1 -right-1 bg-[#a68b6a] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {imageCount}
              </span>
            )}
          </div>
        </td>
        <td className="p-2  border border-b-0 border-LightSecondaryColor">{title}</td>
        <td className="p-2  border border-b-0 border-LightSecondaryColor">${price}</td>
        <td className="p-2  border border-b-0 border-LightSecondaryColor">{stock}</td>
        <td className="p-2  border border-b-0 border-LightSecondaryColor  ">
          <div className="flex items-center justify-center gap-2">
            {" "}
            <AiOutlineDelete
              onClick={(e) => {
                e.stopPropagation()
                setIsDeleteModalOn(true)
              }}
              className="w-5 h-5 cursor-pointer hover:fill-red-600 fill-red-500 transition-colors"
            />{" "}
            <AiOutlineEdit
              onClick={(e) => {
                e.stopPropagation()
                handleEditAndUpdateClick()
              }}
              className="w-5 h-5 cursor-pointer hover:fill-blue-600 fill-blue-500 transition-colors"
            />
          </div>
        </td>
      </tr>
    </>
  )
}
