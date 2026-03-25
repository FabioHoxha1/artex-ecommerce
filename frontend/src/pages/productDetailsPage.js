"use client"

import { IoIosArrowBack } from "react-icons/io"
import { useNavigate, useParams } from "react-router-dom"
import { FiHeart } from "react-icons/fi"
import FooterSection from "../components/footerSection"
import { useSelector, useDispatch } from "react-redux"
import { useState, useEffect } from "react"
import { handleCartModification } from "../utils/handleCartModification"
import { handleWishlistModification } from "../utils/handleWishlistModification"
import { isProductInCartFn, isProductInWishlistFn } from "../utils/isSpecificProductInCartAndWishlist.js"
import { ProductLoader } from "../components/loaders/productLoader"
import { motion } from "framer-motion"
import { primaryBtnVariant } from "../utils/animation"

export const ProductDetailsPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { allProductsData, isLoading } = useSelector((state) => state.productsData)
  const { wishlist, cart } = useSelector((state) => state.wishlistAndCartSection)

  const [productQuantity, setProductQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isProductInQuote, setIsProductInQuote] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const { productId } = useParams()
  const currentProduct = allProductsData.find((product) => product._id === productId)
  const { _id, title, description, images, image, categories } = currentProduct || {
    _id: "",
    title: "",
    description: "",
    images: [],
    image: "",
    categories: "",
  }

  const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000"

  const productImages = images && images.length > 0 ? images : image ? [image] : []

  const getImageUrl = (img) => {
    if (!img) return "/placeholder.svg"
    // if img is an object (sizes map), pick a large but optimized source and allow srcset usage on the img element
    if (typeof img === "object") {
      const preferred = img[1024] || img[640] || img.orig || Object.values(img)[0]
      if (!preferred) return "/placeholder.svg"
      if (preferred.startsWith("http") || preferred.startsWith("data:")) return preferred
      return `${serverUrl}${preferred}`
    }
    if (img.startsWith("data:image")) return img
    if (img.startsWith("http")) return img
    return `${serverUrl}${img}`
  }

  const currentImageUrl = getImageUrl(productImages[selectedImageIndex])

  const subCategoriesArr = []
  for (const key in categories) {
    if (categories[key].length > 0) subCategoriesArr.push(...categories[key])
  }

  const handleAddAndRemoveItemInQuoteFn = () => {
    const quantity = Number.parseInt(productQuantity)
    if (quantity < 1 || isNaN(quantity)) {
      alert("Quantity can't be less than 1")
    } else if (!isProductInQuote) {
      handleCartModification(_id, dispatch, quantity, false)
      setProductQuantity(1)
    } else {
      handleCartModification(_id, dispatch, null, isProductInQuote)
    }
  }

  useEffect(() => {
    isProductInWishlistFn(_id, setIsWishlisted, wishlist)
  }, [wishlist, _id])

  useEffect(() => {
    isProductInCartFn(_id, setIsProductInQuote, cart)
  }, [cart, _id])

  const requestQuoteNowFn = () => {
    const quantity = Number.parseInt(productQuantity)
    if (quantity < 1 || isNaN(quantity)) {
      alert("Quantity can't be less than 1")
    } else if (isProductInQuote) {
      handleCartModification(_id, dispatch, quantity, false)
      navigate("/checkout")
    } else {
      handleCartModification(_id, dispatch, quantity, false)
      navigate("/checkout")
    }
  }

  if (isLoading) {
    return <ProductLoader />
  }

  return (
    <div className="w-[100%]">
      <div className="mt-4 w-[100%] h-[54px] bg-neutralColor text-secondaryColor xl:px-[4%] px-[3%] xs:px-[4%] lg:px-[2%] flex items-center justify-between font-bold tablet:px-[6%] font-RobotoCondensed lg:col-span-full lg:row-span-1 overflow-x-auto">
        <div className="flex gap-[4px] items-center text-sm xs:text-base whitespace-nowrap">
          <IoIosArrowBack className="flex-shrink-0" />
          <li onClick={() => navigate("/")} className="hover:underline capitalize">
            Home
          </li>
          <IoIosArrowBack className="flex-shrink-0" />
          <li onClick={() => navigate("/shop")} className="hover:underline capitalize">
            Shop
          </li>
          <IoIosArrowBack className="flex-shrink-0" />
          <span className="capitalize truncate max-w-[120px] xs:max-w-[200px]">{title}</span>
        </div>
      </div>
      <section className="my-10 xs:my-20 mb-20 xs:mb-32 w-[95%] xs:w-[92%] mx-auto gap-6 flex flex-col lg:flex-row lg:gap-2 md:justify-between tablet:w-[88%] lg:w-[96%]">
        <div className="w-[100%] lg:mx-0 lg:basis-[50%] lg:h-max">
          {/* Main Image - Better sizing on mobile */}
          <div className="min-h-[250px] xs:min-h-[320px] tablet:min-h-[450px] md:min-h-[500px] h-auto bg-neutralColor relative flex justify-center items-center p-3 xs:p-4">
            {
              (() => {
                const imgObj = productImages[selectedImageIndex]
                if (imgObj && typeof imgObj === "object") {
                  const src = imgObj[1024] || imgObj[640] || imgObj.orig || Object.values(imgObj)[0]
                  const srcSetParts = []
                  if (imgObj[320]) srcSetParts.push(`${imgObj[320]} 320w`)
                  if (imgObj[640]) srcSetParts.push(`${imgObj[640]} 640w`)
                  if (imgObj[1024]) srcSetParts.push(`${imgObj[1024]} 1024w`)
                  const srcSet = srcSetParts.join(", ")
                  return (
                    <img
                      src={src || "/placeholder.svg"}
                      srcSet={srcSet || undefined}
                      sizes="100vw"
                      alt={title}
                      className="w-full h-full object-contain max-w-full bg-neutralColor"
                      style={{
                        imageRendering: "high-quality",
                      }}
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg"
                      }}
                    />
                  )
                }
                return (
                  <img
                    src={currentImageUrl || "/placeholder.svg"}
                    alt={title}
                    className="w-full h-full object-contain max-w-full bg-neutralColor"
                    style={{
                      imageRendering: "high-quality",
                    }}
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg"
                    }}
                  />
                )
              })()
            }
            <div
              className={`absolute p-2 xs:p-3 bg-[#ffffff] shadow-[0px_2px_8px_0px_#00000085] ease-in transition-colors cursor-pointer duration-300 rounded-[50%] top-[3%] xs:top-[5%] right-[3%] xs:right-[5%] z-[100] ${
                isWishlisted && "bg-[#a68b6a]"
              }`}
            >
              <FiHeart
                className={`w-5 h-5 xs:w-6 xs:h-6 ${
                  isWishlisted && "fill-[#a68b6a] duration-200 ease-linear transition-colors stroke-white"
                }`}
                onClick={() => handleWishlistModification(_id, dispatch)}
              />
            </div>
          </div>

          {productImages.length > 1 && (
            <div className="mt-3 xs:mt-4 flex gap-2 xs:gap-3 overflow-x-auto pb-2 px-1">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 xs:w-20 xs:h-20 border-2 rounded-lg overflow-hidden transition-all ${
                    selectedImageIndex === index
                      ? "border-[#a68b6a] ring-2 ring-[#a68b6a] ring-offset-1 xs:ring-offset-2"
                      : "border-gray-300 hover:border-[#a68b6a]"
                  }`}
                >
                  <img
                    src={getImageUrl(img) || "/placeholder.svg"}
                    alt={`${title} ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg"
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:basis-[40%] mt-8 xs:mt-16 lg:mt-0 flex flex-col gap-4 xs:gap-6">
          <h2 className="text-[22px] xs:text-[28px] font-bold tracking-[0.5px] capitalize">{title}</h2>


          {description && (
            <div>
              <h2 className="font-bold text-[16px] xs:text-[20px] tracking-[0.5px]">Description</h2>
              <p className="leading-[150%] tracking-[0.5px] text-sm xs:text-base">
                {description}
              </p>
            </div>
          )}
          <div className="flex items-center gap-3 xs:gap-4 flex-wrap">
            <h3 className="font-bold text-[16px] xs:text-[20px] tracking-[0.5px]">Quantity :</h3>
            <input
              className="w-[80px] xs:w-[20%] h-[40px] focus:outline-secondaryColor border-[1px] border-secondaryColor pl-3 rounded-sm text-secondaryColor"
              type="number"
              min="1"
              value={productQuantity}
              onChange={(e) => setProductQuantity(e.target.value)}
            />
          </div>
          <div>
            <h3 className="font-bold text-[16px] xs:text-[20px] tracking-[0.5px]">Sub-Categories :</h3>
            <div className="flex font-medium text-[14px] xs:text-[18px] flex-wrap">
              {subCategoriesArr.map((category) => category).join(", ")}
            </div>
          </div>
          <div className="flex gap-3 xs:gap-6 flex-col xs:flex-row">
            <motion.button
              whileHover={{ backgroundColor: "#8b7355", borderWidth: "0px", color: "#ffffff" }}
              transition={{ duration: 0.4 }}
              className="text-secondaryColor w-full xs:basis-[45%] md:basis-[35%] lg:basis-[40%] bg-transparent border-[1px] border-secondaryColor font-semibold h-[46px] xs:h-[50px] text-sm xs:text-base"
              onClick={handleAddAndRemoveItemInQuoteFn}
            >
              {isProductInQuote ? "Remove from Quote" : "Add to Quote"}
            </motion.button>

            <motion.button
              initial="initial"
              whileTap="click"
              variants={primaryBtnVariant}
              className="text-white bg-primaryColor hover:bg-darkPrimaryColor font-semibold w-full xs:basis-[45%] lg:basis-[40%] md:basis-[35%] h-[46px] xs:h-[50px] block text-sm xs:text-base"
              onClick={requestQuoteNowFn}
            >
              Request Quote
            </motion.button>
          </div>
        </div>
      </section>
      <FooterSection />
    </div>
  )
}