"use client"

import { FaTrash } from "react-icons/fa"
import { useSelector, useDispatch } from "react-redux"
import { useState, useEffect } from "react"
import { handleWishlistModification } from "../../utils/handleWishlistModification"
import { handleCartModification } from "../../utils/handleCartModification"
import { isProductInCartFn } from "../../utils/isSpecificProductInCartAndWishlist.js"
import { useNavigate } from "react-router-dom"

export const SingleProductSection = ({ wishlistData, setIsWishlistActive }) => {
  const [isProductInQuote, setIsProductInQuote] = useState(false)
  const { cart } = useSelector((state) => state.wishlistAndCartSection)

  const { title, image, _id } = wishlistData
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000"

  const getImageUrl = () => {
    if (!image) return "/placeholder.svg"
    if (typeof image === "object") {
      const preferred = image[640] || image[1024] || image.orig || Object.values(image)[0]
      if (!preferred) return "/placeholder.svg"
      if (preferred.startsWith("http") || preferred.startsWith("data:")) return preferred
      return `${serverUrl}${preferred}`
    }
    if (image.startsWith("data:image")) return image
    if (image.startsWith("http")) return image
    return `${serverUrl}${image}`
  }

  const imageUrl = getImageUrl()

  useEffect(() => {
    isProductInCartFn(_id, setIsProductInQuote, cart)
  }, [cart, _id])

  return (
    <div className="flex gap-4 border-b-[1px] border-LightSecondaryColor pb-4">
      <div
        className="w-[40%] cursor-pointer h-[144px] bg-neutralColor relative cursor-pointer product-img-container flex justify-center items-center"
        onClick={() => {
          navigate(`/product/${_id}`)
          setIsWishlistActive(false)
        }}
      >
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          className="rounded-sm w-[100%] h-auto max-h-[90%] max-w-[90%] object-contain"
          onError={(e) => {
            e.target.src = "/placeholder.svg"
          }}
        />
      </div>
      <div className="flex flex-col gap-2 w-[50%] text-base">
        <h2 className="md:text-[18px] font-medium font-RobotoSlab capitalize">{title}</h2>
        <button
          className="w-[90%] h-[40px] tablet:w-[80%] md:w-[80%] text-sm  rounded-sm border-[1px] border-primaryColor text-primaryColor px-2"
          onClick={() => handleCartModification(_id, dispatch, null, isProductInQuote)}
        >
          {isProductInQuote ? "Remove from quote" : "Add to quote"}
        </button>
      </div>
      <FaTrash
        className="w-4 h-5 stroke-secondaryColor cursor-pointer"
        onClick={() => {
          handleWishlistModification(_id, dispatch)
        }}
      />
    </div>
  )
}