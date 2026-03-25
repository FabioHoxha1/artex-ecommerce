"use client"

import { useSelector } from "react-redux"

export const OrderSummary = () => {
  const { cart } = useSelector((state) => state.wishlistAndCartSection)

  const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000"

  const getImageUrl = (image) => {
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

  // cart with quantity lesser than zero shouldnt be allowed for quote
  const filteredCart = cart.filter((product) => product.quantity > 0)

  // Calculate total quantity
  const totalQuantity = filteredCart.reduce((acc, item) => acc + (item.quantity || 1), 0)

  return (
    <section className="mt-20 mb-20 lg:mb-0 w-[92%] tablet:w-[88%] mx-auto lg:mx-0  bg-white border-2 border-LightSecondaryColor py-8 lg:order-2 lg:basis-[40%] xl:basis-[35%]">
      <h2 className="text-[28px] font-bold text-center mb-12">Quote Summary</h2>
      <div className="flex flex-col gap-4 w-[90%] max-w-[500px] mx-auto ">
        {filteredCart.map((cartItem) => {
          return (
            <article
              className="flex gap-4 w-[100%] border-b-[1px] justify-between border-LightSecondaryColor pb-4"
              key={cartItem._id}
            >
              <div className="w-[40%] tablet:w-[45%] md:w-[45%]  h-[110px]  tablet:h-[180px] md:h-[160px] bg-neutralColor relative cursor-pointer product-img-container flex justify-center items-center">
                <img
                  src={getImageUrl(cartItem.image) || "/placeholder.svg"}
                  alt={cartItem.title}
                  className="rounded-sm w-[100%]  object-contain h-auto max-h-[90%] max-w-[90%]"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg"
                  }}
                />
              </div>
              <div className="flex flex-col gap-2 w-[55%] text-[16px]">
                <h2 className="text-[18px] font-normal font-RobotoSlab">{cartItem.title}</h2>
                <span className="font-normal text-gray-600">Quantity: {cartItem.quantity}</span>
              </div>
            </article>
          )
        })}
      </div>
      <div className="pt-4 flex flex-col gap-4 border-t-[2px] border-LightSecondaryColor  mt-20 w-[100%] ">
        <div className="flex items-center justify-between mx-[5%]">
          <h3 className="text-sm text-gray-600">Total Items</h3>
          <span className="font-medium">{totalQuantity}</span>
        </div>
        <div className="flex items-center justify-between mx-[5%]">
          <h3 className="text-sm text-gray-600">Products</h3>
          <span className="font-medium">{filteredCart.length}</span>
        </div>
        <div className="flex items-center mx-[5%] justify-between border-t-[1px] border-LightSecondaryColor pt-4 mt-2">
          <p className="text-sm text-gray-600 italic">
            Pricing will be provided after quote review
          </p>
        </div>
      </div>
    </section>
  )
}