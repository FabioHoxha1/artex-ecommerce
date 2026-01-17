"use client"

import { motion } from "framer-motion"
import { primaryBtnVariant } from "../../utils/animation"
import { useDispatch, useSelector } from "react-redux"
import { useState, useEffect } from "react"
import { updateUserProfile } from "../../features/authSlice/updateUserProfile"
import { toast } from "react-toastify"

export const AccountSettings = () => {
  const dispatch = useDispatch()
  const { userData, isLoading } = useSelector((state) => state.userAuth)

  const [formData, setFormData] = useState({
    username: "",
    address: "",
    country: "",
    city: "",
    postalCode: "",
  })

  useEffect(() => {
    if (userData) {
      setFormData({
        username: userData.username || "",
        address: userData.address || "",
        country: userData.country || "",
        city: userData.city || "",
        postalCode: userData.postalCode || "",
      })
    }
  }, [userData])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
  await dispatch(updateUserProfile(formData)).unwrap()
  toast.success("Profile updated successfully!")
    } catch (error) {
      console.log("[v0] Profile update error:", error)
      toast.error(error || "Failed to update profile")
    }
  }

  return (
    <div className="w-[100] tablet:px-[6%] mb-20 xl:px-[4%] px-[4%] lg:px-[2%]">
      <h2 className="text-2xl text-center">Account settings</h2>
      <form
        onSubmit={handleSubmit}
        className="mt-20 mx-auto  lg:basis-[50%] xl:basis-[60%] lg:order-1 lg:mx-0  max-w-[500px] xl:max-w-[600px]"
      >
        <article>
          <h2 className="text-[24px] font-bold  mb-6">Contact Information</h2>
          <section className="flex flex-col gap-4 w-[100%] mx-auto">
            <div className="w-[100%] ">
              <label htmlFor="username" className="font-medium text-[18px]">
                Username
              </label>{" "}
              <br />
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="pl-3 w-[100%] h-[52px] focus-border-[1px] rounded focus:outline-none border-[1px] border-secondaryColor"
                placeholder="username"
              />
            </div>
            <div className="w-[100%] flex justify-between">
              <div className=" p-4 w-[49%] flex-col rounded-sm bg-neutralColor flex items-start md:justify-between gap-6">
                <div>
                  <h4 className="mb-4">Password</h4>
                  <span className="mt-4">Password changes are handled separately for security</span>
                </div>
              </div>
              <div className=" p-4 w-[49%] flex-col bg-neutralColor flex rounded-sm items-start md:justify-between gap-6">
                <div>
                  <h4 className="mb-4">Email address</h4>
                  <span>{userData?.email || "No email"}</span>
                </div>
              </div>
            </div>
          </section>
        </article>
        <article className="mt-6">
          <h2 className="text-[24px] font-bold  mb-6">Billing Address</h2>
          <section className="flex flex-col gap-4 w-[100%] mx-auto">
            <div className="w-[100%] ">
              <label htmlFor="address" className="font-medium  text-[18px]">
                Address
              </label>{" "}
              <br />
              <input
                type="text"
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="pl-3 w-[100%] h-[52px] focus-border-[1px] rounded focus:outline-none border-[1px] border-secondaryColor"
                placeholder="Address"
              />
            </div>
            <div className="w-[100%] ">
              <label htmlFor="country" className="font-medium  text-[18px]">
                Country
              </label>{" "}
              <br />
              <select
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="pl-3 w-[100%] h-[52px] focus-border-[1px] rounded focus:outline-none border-[1px] border-secondaryColor"
              >
                <option value="">Select country</option>
                <option value="Albania">Albania</option>
                <option value="United States">United States</option>
              </select>
            </div>
            <div className="w-[100%] flex justify-between gap-[5%] items-center">
              <div className="w-[100%]">
                <label htmlFor="city" className="font-medium  text-[18px]">
                  City
                </label>{" "}
                <br />
                <input
                  type="text"
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="pl-3 w-[100%] h-[52px] focus-border-[1px] rounded focus:outline-none border-[1px] border-secondaryColor"
                  placeholder="city"
                />
              </div>
              <div className="w-[100%]">
                <label htmlFor="postalCode" className="font-medium  text-[18px]">
                  Postal code
                </label>{" "}
                <br />
                <input
                  type="tel"
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="pl-3 w-[100%] h-[52px] focus-border-[1px] rounded focus:outline-none border-[1px] border-secondaryColor"
                  placeholder="Zip code"
                />
              </div>
            </div>
          </section>
        </article>
        <article className="mt-6">
          <h2 className="text-[24px] font-bold  mb-6">Payment method</h2>
          <p className="font-medium text-[18px] text-primaryColor ">There is no payment functionalities yet*</p>
        </article>
        <motion.button
          type="submit"
          disabled={isLoading}
          initial="initial"
          whileTap="click"
          variants={primaryBtnVariant}
          className="my-12 w-[100%] mx-auto block h-[52px] bg-primaryColor text-white font-medium rounded disabled:opacity-50"
        >
          {isLoading ? "Updating..." : "Update Changes"}
        </motion.button>
      </form>
    </div>
  )
}
