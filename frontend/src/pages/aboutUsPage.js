"use client"

import { IoIosArrowBack } from "react-icons/io"
import { useNavigate } from "react-router-dom"
import FooterSection from "../components/footerSection"
import { WhyChooseUsSection } from "./homepage/whyChooseUsSection"
import FurnitureVector from "../assets/Home-furniture-set.jpg"
import { FaDownload, FaFilePdf, FaBook } from "react-icons/fa"

export const AboutUsPage = () => {
  const navigate = useNavigate()

  const catalogueUrl = "https://drive.google.com/file/d/1LMMsIVwgDKWQm1vRWuU_IqL0dTAca_49/view?usp=drivesdk"

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
          <span className=" capitalize">About</span>
        </div>
      </div>

      {/* Our Story Section */}
      <section className="w-full  mt-4 tablet:px-[6%] xl:px-[4%] px-[4%] lg:px-[2%] flex flex-col md:flex-row gap-4  pt-20 pb-10">
        <div>
          <h2 className="text-[28px] md:text-[32px] lg:text-[36px] mb-2">Our Story</h2>
          <p className="leading-[180%] first-letter:float-left first-letter:mr-4 first-letter:text-7xl  first-letter:text-secondaryColor first-letter:font-bold">
            Welcome to our e-furniture store, Artex, where we offer a wide selection of high-quality, affordable
            furniture for every room in your home. Our online platform allows you to shop for furniture at your
            convenience, with easy-to-use filters that help you find the perfect piece for your style and budget. We
            believe that everyone deserves to have a beautiful, comfortable home, and we're committed to making that a
            reality for our customers. Our furniture is designed and crafted by experts using only the best components,
            ensuring that you get furniture that is both stylish and durable. At Artex, we're passionate about creating
            beautiful spaces and providing excellent customer service, and we look forward to helping you create your
            dream home.
          </p>
        </div>
        <div className=" flex justify-center items-center">
          <img className="" src={FurnitureVector || "/placeholder.svg"} alt="" />
        </div>
      </section>

      {/* Catalogue Download Section */}
      <section className="w-full tablet:px-[6%] xl:px-[4%] px-[4%] lg:px-[2%] py-16 bg-neutralColor">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              {/* Left Side - Visual */}
              <div className="bg-gradient-to-br from-primaryColor to-darkPrimaryColor p-8 md:p-12 flex flex-col justify-center items-center text-white relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                
                <div className="relative z-10 text-center">
                  <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                    <FaBook className="w-10 h-10 md:w-12 md:h-12 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-3">Product Catalogue</h3>
                  <p className="text-white text-opacity-90 text-sm md:text-base">
                    2026 Collection
                  </p>
                </div>
              </div>

              {/* Right Side - Content */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <FaFilePdf className="w-6 h-6 text-red-500" />
                  <span className="text-sm text-gray-500 font-medium">PDF Document</span>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-secondaryColor mb-4">
                  Download Our Complete Catalogue
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Explore our full range of premium furniture collections. Our catalogue features detailed specifications, 
                  dimensions, and beautiful imagery to help you find the perfect pieces for your space.
                </p>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-gray-700">
                    <span className="w-2 h-2 bg-primaryColor rounded-full"></span>
                    Complete product specifications
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <span className="w-2 h-2 bg-primaryColor rounded-full"></span>
                    High-quality product images
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <span className="w-2 h-2 bg-primaryColor rounded-full"></span>
                    Latest furniture collections
                  </li>
                </ul>

                <a
                  href={catalogueUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-primaryColor hover:bg-darkPrimaryColor text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg group"
                >
                  <FaDownload className="w-5 h-5 group-hover:animate-bounce" />
                  <span>Download Catalogue</span>
                </a>

                <p className="text-xs text-gray-400 mt-4 text-center md:text-left">
                  Opens in Google Drive
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WhyChooseUsSection />
      <FooterSection />
    </>
  )
}