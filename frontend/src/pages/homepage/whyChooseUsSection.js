import { FaTruck } from "react-icons/fa"
import { AiOutlineSafety } from "react-icons/ai"
import { BiUserVoice } from "react-icons/bi"
import { TbDiscount2 } from "react-icons/tb"

export const WhyChooseUsSection = () => {
  return (
    <div className="py-16 xs:py-20 md:py-24 bg-neutralColor">
      <div className="w-[95%] max-w-[1400px] mx-auto">
        <h2 className="text-[28px] xs:text-[36px] md:text-[44px] lg:text-[48px] text-center font-bold px-4 text-primaryColor mb-10 xs:mb-12 md:mb-16">
          Why choose us
        </h2>
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-10 xs:gap-12 md:gap-6 lg:gap-8">
          <div className="flex flex-col items-center text-center flex-1">
            <div className="bg-primaryColor p-6 xs:p-8 md:p-6 lg:p-8 rounded-full mb-4">
              <FaTruck className="fill-secondaryColor w-7 h-7 xs:w-9 xs:h-9 md:w-8 md:h-8 lg:w-10 lg:h-10" />
            </div>
            <h4 className="text-[20px] xs:text-[24px] md:text-[20px] lg:text-[22px] font-bold font-RobotoCondensed text-primaryColor mb-3">
              Free Shipping
            </h4>
            <p className="leading-[140%] text-sm xs:text-base md:text-sm lg:text-base text-gray-600 max-w-[280px]">
              We offer free shipping on all orders, so you can shop with confidence knowing that there are no hidden
              costs.
            </p>
          </div>

          <div className="flex flex-col items-center text-center flex-1">
            <div className="bg-primaryColor p-6 xs:p-8 md:p-6 lg:p-8 rounded-full mb-4">
              <BiUserVoice className="fill-secondaryColor w-7 h-7 xs:w-9 xs:h-9 md:w-8 md:h-8 lg:w-10 lg:h-10" />
            </div>
            <h4 className="text-[20px] xs:text-[24px] md:text-[20px] lg:text-[22px] font-bold font-RobotoCondensed text-primaryColor mb-3">
              Customer Service
            </h4>
            <p className="leading-[140%] text-sm xs:text-base md:text-sm lg:text-base text-gray-600 max-w-[280px]">
              Our customer service team is available to help you with any issues or concerns. We're here to make sure
              you are completely satisfied.
            </p>
          </div>

          <div className="flex flex-col items-center text-center flex-1">
            <div className="bg-primaryColor p-6 xs:p-8 md:p-6 lg:p-8 rounded-full mb-4">
              <TbDiscount2 className="fill-secondaryColor w-7 h-7 xs:w-9 xs:h-9 md:w-8 md:h-8 lg:w-10 lg:h-10" />
            </div>
            <h4 className="text-[20px] xs:text-[24px] md:text-[20px] lg:text-[22px] font-bold font-RobotoCondensed text-primaryColor mb-3">
              Exclusive Offers
            </h4>
            <p className="leading-[140%] text-sm xs:text-base md:text-sm lg:text-base text-gray-600 max-w-[280px]">
              We're constantly updating our inventory with exclusive offers and products that you won't find anywhere
              else.
            </p>
          </div>

          
        </div>
      </div>
    </div>
  )
}
