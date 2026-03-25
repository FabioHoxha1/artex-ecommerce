"use client"

import { useState } from "react"
import { IoIosArrowBack } from "react-icons/io"
import { useNavigate } from "react-router-dom"
import FooterSection from "../components/footerSection"
import axios from "axios"
import { toast } from "react-toastify"

export const ContactUsPage = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000"

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all fields")
      return
    }

    setIsSubmitting(true)

    try {
      const { data } = await axios.post(`${serverUrl}/api/v1/contact/submit`, formData)

      toast.success(data.message || "Your message has been sent successfully!")

      // Reset form
      setFormData({
        name: "",
        email: "",
        message: "",
      })
    } catch (error) {
      console.error("Contact form error:", error)
      toast.error(error.response?.data?.message || "Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="mt-12 w-[100%] h-[54px] bg-neutralColor text-secondaryColor tablet:px-[6%] xl:px-[4%] px-[4%] lg:px-[2%]  flex items-center justify-between font-bold  font-RobotoCondensed lg:col-span-full lg:row-span-1">
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
          <span className=" capitalize">Contact us</span>
        </div>
      </div>

      <section className="w-[100%] mt-20 mb-28 tablet:px-[6%] xl:px-[4%] px-[4%] lg:px-[2%] flex justify-center items-center ">
        <form className="w-[92%] max-w-[500px] flex flex-col gap-4 " onSubmit={handleSubmit}>
          <h2 className="text-[36px] text-center mb-4 lg:text-[44px] font-bold">Contact Us</h2>
          <p className="text-center text-gray-600 mb-6">
            Have a question or need assistance? Send us a message and we'll get back to you as soon as possible.
          </p>
          <div>
            <label htmlFor="name" className="font-medium text-gray-700">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              className="border border-LightSecondaryColor pl-4 focus:outline-primaryColor focus:border-primaryColor rounded w-full mt-2 h-[52px] transition-colors"
              placeholder="Your name"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              className="border border-LightSecondaryColor pl-4 focus:outline-primaryColor focus:border-primaryColor rounded w-full mt-2 h-[52px] transition-colors"
              placeholder="your.email@example.com"
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="font-medium text-gray-700">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              name="message"
              id="message"
              value={formData.message}
              onChange={handleInputChange}
              className="border border-LightSecondaryColor p-4 focus:outline-primaryColor focus:border-primaryColor mt-2 rounded w-full transition-colors resize-none"
              placeholder="How can we help you?"
              cols="30"
              rows="8"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`my-4 w-[100%] mx-auto block h-[52px] bg-primaryColor hover:bg-darkPrimaryColor text-white font-medium rounded transition-colors duration-300 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </section>
      <FooterSection />
    </>
  )
}