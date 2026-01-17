"use client"
import { Link } from "react-router-dom"
import { FiHeart } from "react-icons/fi"
import { BsEye } from "react-icons/bs"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { handleWishlistModification } from "../utils/handleWishlistModification"
import { handleCartModification } from "../utils/handleCartModification"
import { isProductInCartFn, isProductInWishlistFn } from "../utils/isSpecificProductInCartAndWishlist.js"
import { motion } from "framer-motion"
import { primaryBtnVariant } from "../utils/animation"
import { cartTextChangeVariant } from "../utils/animation"
// removed unused useInView import

export const SingleProductBox = ({ productsData }) => {
  const { _id, title, price, images, image, discountPercentValue } = productsData
  const hasPrice = typeof price === "number" && !isNaN(price)
  const hasDiscount = typeof discountPercentValue === "number" && !isNaN(discountPercentValue) && discountPercentValue > 0
  const displayPrice = hasPrice ? price : undefined
  const displayDiscount = hasDiscount ? discountPercentValue : undefined
  const discountedPrice = hasPrice && hasDiscount ? price - (price * discountPercentValue) / 100 : undefined

  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isProductInCart, setIsProductInCart] = useState(false)

  const dispatch = useDispatch()
  const { wishlist, cart } = useSelector((state) => state.wishlistAndCartSection)

  const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000"

  const getImageUrl = () => {
    const productImage = images && images.length > 0 ? images[0] : image
    if (!productImage) return "/placeholder.svg"
    // if the stored image is an object (sizes map), prefer a medium size
    if (typeof productImage === "object") {
      const preferred = productImage[640] || productImage[1024] || productImage.orig || Object.values(productImage)[0]
      if (!preferred) return "/placeholder.svg"
      if (preferred.startsWith("http") || preferred.startsWith("data:")) return preferred
      return `${serverUrl}${preferred}`
    }
    if (productImage.startsWith("data:image")) return productImage
    if (productImage.startsWith("http")) return productImage
    return `${serverUrl}${productImage}`
  }

  const imageUrl = getImageUrl()
  const imageCount = images && images.length > 0 ? images.length : image ? 1 : 0

  useEffect(() => {
    isProductInWishlistFn(_id, setIsWishlisted, wishlist)
    // include _id so the effect re-runs when product id or wishlist changes
  }, [wishlist, _id])
  useEffect(() => {
    isProductInCartFn(_id, setIsProductInCart, cart)
    // include _id so the effect re-runs when product id or cart changes
  }, [cart, _id])

  return (
    <article className="flex w-[100%] tablet:mx-0 md:mx-0 mx-auto flex-col bg-[#ffffff] relative">
      <div
        className={`absolute p-2 xs:p-3 bg-[#ffffff] shadow-[0px_3px_8px_0px_rgba(0,0,0,0.2)] rounded-[50%] ease-in transition-colors cursor-pointer duration-300 top-[3%] right-[3%] z-[100] ${
          isWishlisted && "bg-lightPrimaryColor"
        }`}
        onClick={() => handleWishlistModification(_id, dispatch)}
      >
        <FiHeart
          className={`w-5 h-5 xs:w-6 xs:h-6 ${
            isWishlisted && "fill-lightPrimaryColor duration-200 ease-linear transition-colors stroke-white"
          }`}
        />
      </div>

      {displayDiscount && (
        <div className="flex justify-center items-center absolute w-12 xs:w-16 px-2 xs:px-3 h-6 xs:h-8 z-[100] top-[4%] xs:top-[6%] hover:opacity-100 bg-lightPrimaryColor text-white shadow-[0px_3px_8px_0px_rgba(0,0,0,0.2)] text-xs xs:text-base">
          <span>{discountPercentValue}%</span>
        </div>
      )}

      {imageCount > 1 && (
        <div className="absolute bottom-[38%] xs:bottom-[35%] left-[3%] xs:left-[5%] bg-black/60 text-white text-[10px] xs:text-xs px-1.5 xs:px-2 py-0.5 xs:py-1 rounded z-[100]">
          +{imageCount} photos
        </div>
      )}

      <div className="w-[100%] h-[200px] xs:h-[250px] md:h-[290px] bg-neutralColor relative cursor-pointer product-img-container flex justify-center items-center rounded-md ease-in transition-all duration-100">
        {
          (() => {
            const productImage = images && images.length > 0 ? images[0] : image
            if (productImage && typeof productImage === "object") {
              const src = productImage[640] || productImage[1024] || productImage.orig || Object.values(productImage)[0]
              const srcSetParts = []
              if (productImage[320]) srcSetParts.push(`${productImage[320]} 320w`)
              if (productImage[640]) srcSetParts.push(`${productImage[640]} 640w`)
              if (productImage[1024]) srcSetParts.push(`${productImage[1024]} 1024w`)
              const srcSet = srcSetParts.join(", ")
              return (
                <img
                  src={src || "/placeholder.svg"}
                  srcSet={srcSet || undefined}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  alt={title}
                  className="rounded-md max-w-[90%] h-auto max-h-[90%] object-contain"
                  style={{ imageRendering: "high-quality" }}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg"
                  }}
                />
              )
            }
            return (
              <img
                src={imageUrl || "/placeholder.svg"}
                alt={title}
                className="rounded-md max-w-[90%] h-auto max-h-[90%] object-contain"
                style={{ imageRendering: "high-quality" }}
                loading="lazy"
                onError={(e) => {
                  e.target.src = "/placeholder.svg"
                }}
              />
            )
          })()
        }
        <div className="product-img-overlay rounded-md absolute top-0 left-0 z-50 bg-[rgba(0,0,0,0.2)] w-[100%] h-[100%] opacity-0 transition-opacity ease-in duration-[0.5]"></div>
        <motion.button
          initial="initial"
          whileTap="click"
          variants={primaryBtnVariant}
          className="absolute left-[10%] xs:left-[20%] md:left-[20%] w-[80%] xs:w-[60%] md:w-[60%] top-[40%] bg-primaryColor hover:bg-darkPrimaryColor text-white hidden cursor-pointer rounded-md h-[40px] xs:h-[48px] gap-1 justify-center z-[100] items-center product-details-link transition ease-in duration-[0.5] text-sm xs:text-base"
        >
          <BsEye />
          <Link to={`/product/${_id}`}>
            <span> view details</span>
          </Link>
        </motion.button>
      </div>
      <h4 className="text-[16px] xs:text-[18px] md:text-[20px] font-normal capitalize mt-3 xs:mt-4 line-clamp-2">
        {title}
      </h4>
      {displayDiscount !== undefined && displayPrice !== undefined ? (
        <div className="flex gap-2 xs:gap-3 mt-[0.125rem] mb-3 xs:mb-4 flex-wrap">
          <h3 className="font-bold text-[16px] xs:text-[18px] md:text-[20px] tracking-wide">
            {discountedPrice.toFixed(2)}
          </h3>
          <h3 className="font-medium text-[14px] xs:text-[16px] md:text-[18px] tracking-wide text-lightBlack line-through">
            {price.toFixed(2)}
          </h3>
        </div>
      ) : displayPrice !== undefined ? (
        <h3 className="font-bold text-[16px] xs:text-[18px] md:text-[20px] mt-[0.125rem] mb-3 xs:mb-4 tracking-wide">
          {price.toFixed(2)}
        </h3>
      ) : null}
      <motion.button
        initial="initial"
        whileTap="click"
        variants={primaryBtnVariant}
        className="w-[100%] h-[44px] xs:h-[48px] md:h-[52px] mx-auto rounded-md text-[#ffffff] bg-primaryColor hover:bg-darkPrimaryColor transition-colors duration-300 text-sm xs:text-base"
        onClick={() => handleCartModification(_id, dispatch, null, isProductInCart)}
      >
        <motion.span
          className="w-[100%] h-[100%] flex items-center justify-center"
          initial="initial"
          whileTap="animate"
          variants={cartTextChangeVariant}
        >
          {" "}
          {isProductInCart ? "Remove from cart" : "Add to cart"}
        </motion.span>
      </motion.button>
  </article>
  )
}
