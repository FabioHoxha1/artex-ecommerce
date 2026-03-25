"use client"

import { FaTrash } from "react-icons/fa"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { handleCartModification } from "../../utils/handleCartModification"
import { setCart } from "../../features/wishlistAndCartSlice"
import { useNavigate } from "react-router-dom"

export const SingleProductSection = ({ cartData, setIsCartSectionActive }) => {
  const { title, image, _id } = cartData
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { cart } = useSelector((state) => state.wishlistAndCartSection)
  const [productQuantityInQuote, setProductQuantityInQuote] = useState(1)

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

  // on load of the app set quantity to persisted quantity
  useEffect(() => {
    for (const key of cart) {
      if (key._id === _id) {
        setProductQuantityInQuote(key.quantity)
      }
    }
  }, [cart, _id])

  // on quantity change
  useEffect(() => {
    const newCart = [...cart]
    let changed = false

    for (const key of newCart) {
      if (key._id === _id) {
        const index = newCart.indexOf(key)
        const newQty = Number.parseInt(productQuantityInQuote) || 0
        if (newCart[index].quantity !== newQty) {
          newCart[index] = { ...key, quantity: newQty }
          changed = true
        }
      }
    }

    if (changed) {
      dispatch(setCart(newCart))
    }
  }, [productQuantityInQuote, cart, dispatch, _id])

  return (
    <div className="flex gap-4 border-b-[1px] border-LightSecondaryColor pb-4">
      <div
        className="w-[40%] h-[120px] tablet:h-[160px] md:h-[160px] bg-neutralColor relative cursor-pointer product-img-container flex justify-center items-center"
        onClick={() => {
          navigate(`/product/${_id}`)
          setIsCartSectionActive(false)
        }}
      >
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          className="rounded-sm w-[100%]  object-contain h-auto max-h-[90%] max-w-[90%]"
          onError={(e) => {
            e.target.src = "/placeholder.svg"
          }}
        />
      </div>
      <div className="flex flex-col gap-3 w-[45%] text-base">
        <h2 className="  md:text-[18px] font-normal font-RobotoSlab capitalize">{title}</h2>
        <div className="flex items-center gap-1 cursor-pointer">
          <FaTrash className="w-4 h-[0.9em] fill-primaryColor" />{" "}
          <h3
            className="font-semibold text-primaryColor"
            onClick={() => handleCartModification(_id, dispatch, null, true)}
          >
            Remove
          </h3>
        </div>
      </div>
      <input
        className="w-[20%] h-[40px] focus:outline-secondaryColor border-[2px] border-secondaryColor mx-auto rounded-sm text-secondaryColor pl-3"
        type="number"
        name=""
        id=""
        min="1"
        value={productQuantityInQuote}
        onChange={(e) => setProductQuantityInQuote(e.target.value)}
      />
    </div>
  )
}