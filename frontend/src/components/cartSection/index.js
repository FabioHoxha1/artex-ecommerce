"use client"

import { IoCloseOutline } from "react-icons/io5"
import { SingleProductSection } from "./singleProductSection"
import { persistor } from "../../store.js"
import { ProductLoader } from "../loaders/productLoader"
import { PersistGate } from "redux-persist/integration/react"
import { useSelector } from "react-redux"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { primaryBtnVariant } from "../../utils/animation"

export const Cart = ({ isCartSectionActive, setIsCartSectionActive }) => {
  const [productTotalQuantity, setProductTotalQuantity] = useState(0)

  const { cart } = useSelector((state) => state.wishlistAndCartSection)
  const { isLoading } = useSelector((state) => state.productsData)

  // Calculate total quantity of items in quote
  useEffect(() => {
    let total = 0
    for (const item of cart) {
      total += item.quantity || 1
    }
    setProductTotalQuantity(total)
  }, [cart])

  const navigate = useNavigate()

  const proceedToQuotePage = () => {
    setIsCartSectionActive(false)
    navigate("/checkout")
  }

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: isCartSectionActive ? "0%" : "100%" }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className={`fixed top-0 left-0 bottom-0 w-[100%] h-[100vh] z-[1500] bg-opacity-60 bg-[#000000] translate-x-[100%]  ${
        isCartSectionActive && "translate-x-[0%]"
      }`}
    >
      <section className="flex flex-col z-[2000] overflow-y-auto absolute top-0 bg-white items-start w-[98%] right-0 bottom-0 pt-4 pb-12 gap-7 tracking-[0.25px] text-lg h-[100%] lg:max-w-[520px] md:max-w-[480px] tablet:max-w-[480px]">
        <h1 className=" text-center mt-[0.5em] w-[100%] text-[1.75rem] border-b-[2px] border-LightSecondaryColor pb-4 font-bold">
          My Quote
        </h1>
        <IoCloseOutline
          className="absolute top-6 right-6 w-9 h-9 cursor-pointer"
          onClick={() => setIsCartSectionActive(false)}
        />
        {isLoading ? (
          <ProductLoader />
        ) : (
          <PersistGate loading={<ProductLoader />} persistor={persistor}>
            {cart.length < 1 ? (
              <div className="flex justify-center items-center w-[100%] h-[50vh]">
                {" "}
                <h2 className="font-bold text-xl">Your Quote is currently empty</h2>{" "}
              </div>
            ) : (
              <div className="w-[100%] flex flex-col px-[5%] gap-4">
                {cart.map((cartData) => {
                  return <SingleProductSection {...{ cartData, setIsCartSectionActive }} key={cartData._id} />
                })}
              </div>
            )}
            <div className="pt-4 flex flex-col gap-4 border-t-[2px] border-LightSecondaryColor mt-20 w-[100%]">
              <div className="flex items-center mx-[5%] justify-between border-b-[1px] border-LightSecondaryColor pb-4">
                <h2 className="font-normal text-[18px] md:text-[20px]">Total Items</h2>
                <span className="text-lg tracking-wide font-bold">{productTotalQuantity}</span>
              </div>
              <div className="flex items-center mx-[5%] justify-between">
                <h2 className="font-normal text-[18px] md:text-[20px]">Products</h2>
                <span className="text-lg tracking-wide font-bold">{cart.length}</span>
              </div>
              <div className=" mx-[5%] mt-6">
                <motion.button
                  variants={primaryBtnVariant}
                  initial="initial"
                  whileTap="click"
                  className="bg-primaryColor hover:bg-darkPrimaryColor text-[#ffffff] w-[100%] h-[54px] rounded-md transition-colors duration-300"
                  onClick={proceedToQuotePage}
                >
                  Request Quote
                </motion.button>
              </div>
            </div>
          </PersistGate>
        )}
      </section>
    </motion.div>
  )
}