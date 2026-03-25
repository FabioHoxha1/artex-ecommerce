import { IoLocationOutline } from "react-icons/io5"
import { FiPhoneCall } from "react-icons/fi"
import { FiMail } from "react-icons/fi"
import { FiInstagram } from "react-icons/fi"
import { BsGithub } from "react-icons/bs"
import { FiTwitter } from "react-icons/fi"
import logoOrange from "../../logoOrange.png"

export const Footer = () => {
  return (
  <footer className="w-[100%] px-[4%] tablet:px-[6%] bg-black text-white flex flex-col items-start gap-1 xs:gap-2 pt-3 xs:pt-4 pb-3 xs:pb-4 mt-3 xs:mt-4">
      <div>
        <img src={logoOrange || "/placeholder.svg"} alt="" className="w-[100px] xs:w-[120px] h-auto" />
        <p className="md:w-[80%] lg:w-[60%] text-sm xs:text-base mt-2">
          Home of the best interior and exterior furnitures.{" "}
        </p>
      </div>
      <article className="lg:flex lg:items-center gap-4 w-full">
        <div className="flex flex-col items-start gap-3 xs:gap-4 md:w-[70%] lg:basis-[30%]">
          <ul className="flex gap-4 xs:gap-6 items-start">
            <IoLocationOutline className="w-5 h-5 xs:w-6 xs:h-6 stroke-primaryColor flex-shrink-0" />
            <li className="text-sm xs:text-base">
              <a href="https://maps.app.goo.gl/seR67DzBTpDyKAwn8" target="_blank" rel="noopener noreferrer" className="hover:underline">
                Pajtoni Center, Autostrada Tr-Dr km1., Tirana, Albania 2076
              </a>
            </li>
          </ul>
          <ul className="flex gap-4 xs:gap-6 items-center">
            <FiMail className="w-5 h-5 xs:w-6 xs:h-6 stroke-primaryColor flex-shrink-0" />
            <li className="text-sm xs:text-base break-all">info@artexcollection.al</li>
          </ul>
          <ul className="flex gap-4 xs:gap-6 items-center">
            <FiPhoneCall className="w-5 h-5 xs:w-6 xs:h-6 stroke-primaryColor flex-shrink-0" />
            <li className="text-sm xs:text-base">+355689008610</li>
          </ul>
        </div>
  <div className="grid grid-cols-2 xs:grid-cols-3 gap-4 mt-3 xs:mt-4 lg:mt-0 w-full md:w-[70%] lg:w-[60%] lg:justify-evenly lg:gap-6">
          <div>
            <h3 className="text-[16px] xs:text-[18px] font-bold">Pages</h3>
            <ul className="flex flex-col items-start gap-1.5 xs:gap-2 mt-3 xs:mt-4 text-sm xs:text-base">
              <li>Homepage</li>
              <li>Shop</li>
              <li>About us</li>
              <li>Contact us</li>
            </ul>
          </div>
          <ul className="flex flex-col items-start gap-1.5 xs:gap-2 mt-3 xs:mt-4 text-sm xs:text-base">
            <li>Privacy policy</li>
            <li>Licenses agreement</li>
            <li>FAQS</li>
            <li>Terms</li>
          </ul>
          <div className="col-span-2 xs:col-span-1">
            <h3 className="text-[16px] xs:text-[18px] font-bold">My Account</h3>
            <ul className="flex flex-col items-start gap-1.5 xs:gap-2 mt-3 xs:mt-4 text-sm xs:text-base">
              <li>My Account</li>
              <li>Order History</li>
              <li>Wishlists</li>
              <li>Checkout</li>
              <li>Cart</li>
            </ul>
          </div>
        </div>
      </article>
      <div className="self-center">
        <ul className="flex items-center gap-3 xs:gap-3 md:gap-5 tablet:gap-5 mx-auto mt-2 xs:mt-2">
          <li className="p-2.5 xs:p-3 rounded-[30%] border-[1px] border-white">
            <a href="https://www.instagram.com/artex.collections/?hl=en" target="_blank" rel="noreferrer noopener">
              <FiInstagram className="w-5 h-5 xs:w-6 xs:h-6" />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  )
}
