"use client"

import { IoIosArrowBack } from "react-icons/io"
import { useNavigate } from "react-router-dom"
import { CheckoutForm } from "./checkoutForm"
import { OrderSummary } from "./orderSummary"
import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import { isTokenValidBeforeHeadingToRoute } from "../../utils/isTokenValidBeforeHeadingToARoute"
import axios from "axios"
import { toast } from "react-toastify"
import { FullpageSpinnerLoader } from "../../components/loaders/spinnerIcon"
import { clearCart } from "../../features/wishlistAndCartSlice"

export const CheckoutPage = ({ setIsCartSectionActive }) => {
  const { cart } = useSelector((state) => state.wishlistAndCartSection)

  const {
    isTokenValidLoader,
    userData: { email, username, country, city, address, postalCode, phoneNumber },
  } = useSelector((state) => state.userAuth)

  const [checkoutFormData, setCheckoutFormData] = useState({
    username: username || "",
    email: email,
    country: country || "",
    city: city || "",
    address: address || "",
    postalCode: postalCode || "",
    phoneNumber: phoneNumber || "",
  })

  // on reload, set the data after it has gotten userData from localstorage
  useEffect(() => {
    setCheckoutFormData((prevData) => {
      return { ...prevData, username: username }
    })
    setCheckoutFormData((prevData) => {
      return { ...prevData, email: email }
    })
    setCheckoutFormData((prevData) => {
      return { ...prevData, phoneNumber: phoneNumber }
    })
  }, [email, username, phoneNumber])

  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    if (cart.length <= 0) {
      navigate("/")
      setIsCartSectionActive(true)
    }
  }, [cart.length, navigate, setIsCartSectionActive])

  useEffect(() => {
    isTokenValidBeforeHeadingToRoute(dispatch, navigate)
  }, [dispatch, navigate])

  const quoteDetails = {
    products: cart.map((products) => {
      return { productId: products._id, quantity: products.quantity }
    }),
    username: checkoutFormData.username,
    address: checkoutFormData.address,
    email: checkoutFormData.email,
    country: checkoutFormData.country,
    city: checkoutFormData.city,
    postalCode: checkoutFormData.postalCode,
    phoneNumber: checkoutFormData.phoneNumber,
    status: "pending",
  }

  const submitQuoteFn = async (e) => {
    const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000"
    e.preventDefault()

    const LoginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || ""

    try {
      await axios.post(
        `${serverUrl}/api/v1/orders/placeOrders`,
        { orderDetails: { ...quoteDetails, deliveryStatus: "quote_requested", paymentStatus: "quote", totalAmount: 0 } },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${LoginToken}`,
          },
        },
      )

      toast("Quote request has been submitted successfully! We will contact you soon.", {
        type: "success",
        autoClose: 3000,
        position: "top-center",
      })

      localStorage.setItem("cart", JSON.stringify([]))

      dispatch(clearCart())

      setCheckoutFormData((prevData) => {
        return {
          ...prevData,
          username: "",
          email: email,
          country: "",
          city: "",
          address: "",
          postalCode: "",
          phoneNumber: "",
        }
      })

      setTimeout(() => {
        navigate("/profilePage/myOrders")
      }, 2000)
    } catch (error) {
      console.log("[v0] Quote submission error:", error)
      toast(error.response?.data?.message || error.message || "Failed to submit quote request", {
        type: "error",
        autoClose: 4000,
        position: "top-center",
      })
    }
  }

  if (isTokenValidLoader) {
    return <FullpageSpinnerLoader />
  } else {
    return (
      <>
        <div className="mt-4 w-[100%] h-[54px] bg-neutralColor text-secondaryColor tablet:px-[6%] xl:px-[4%] px-[4%] lg:px-[2%]  flex items-center justify-between font-bold  font-RobotoCondensed lg:col-span-full lg:row-span-1">
          <div className="flex gap-[4px] items-center text-[15px]">
            <IoIosArrowBack />
            <li onClick={() => navigate("/")} className="hover:underline capitalize">
              Home
            </li>
            <IoIosArrowBack />
            <li onClick={() => navigate("/shop")} className="hover:underline capitalize">
              Shop
            </li>
            <IoIosArrowBack />
            <span className=" capitalize">Request Quote</span>
          </div>
        </div>
        <div className="flex flex-col-reverse lg:flex-row lg:flex lg:w-[96%] xl:w-[92%] lg:mx-auto lg:justify-between mb-20 lg:items-start">
          <CheckoutForm {...{ submitQuoteFn, checkoutFormData, setCheckoutFormData }} />
          <OrderSummary />
        </div>
      </>
    )
  }
}