"use client"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { primaryBtnVariant } from "../../utils/animation"
import { BiUser } from "react-icons/bi"

export const NavTabs = ({ isLoggedIn, userData }) => {
  const navigate = useNavigate()

  return (
    <motion.ul
      initial={{ y: -20 }}
      animate={{ y: 0 }}
      exit={{ y: -20, zIndex: -1, transition: { duration: 0.1, ease: "easeOut" } }}
      transition={{ type: "spring", stiffness: 100, dampness: 20 }}
      className="flex flex-col z-50 border-t-[1px] border-LightSecondaryColor absolute top-[100%] bg-white  left-0 right-0 pt-[8px] pb-8  tracking-[0.25px] text-lg  font-medium md:static md:bg-transparent md:border-none md:px-2 md:flex-row md:p-0  md:gap-4 lg:gap-5 md:shadow-none shadow-[0_3px_8px_rgba(0,0,0,0.2)]"
    >
      <li className="md:hover:bg-transparent hover:bg-neutralColor py-[6px] md:py-0">
        <Link to="/" className="px-[4%] w-[100%] h-[100%] inline-block  tablet:px-[6%]   md:px-0 ">
          Home
        </Link>
      </li>
      <li className="md:hover:bg-transparent hover:bg-neutralColor py-[6px] md:py-0">
        <Link to="/shop" className="px-[4%] w-[100%] h-[100%] inline-block  tablet:px-[6%]   md:px-0 ">
          Shop
        </Link>
      </li>
      <li className=" py-[6px]  md:hover:bg-transparent hover:bg-neutralColor md:py-0">
        <Link to="/aboutUs" className="px-[4%] w-[100%] h-[100%] inline-block  tablet:px-[6%]   md:px-0 ">
          About us
        </Link>
      </li>
      <li className=" md:hover:bg-transparent md:py-0 py-[6px] hover:bg-neutralColor  ">
        <Link to="/contactUs" className="px-[4%] w-[100%] h-[100%] inline-block  tablet:px-[6%]   md:px-0 ">
          Contact
        </Link>
      </li>
      <li className=" md:hover:bg-transparent md:py-0 py-[6px] hover:bg-neutralColor  ">
        <Link to="/projects" className="px-[4%] w-[100%] h-[100%] inline-block  tablet:px-[6%]   md:px-0 ">
          Projects
        </Link>
      </li>

      <div className="flex flex-col gap-2 mt-[8px] mx-[4%] tablet:mx-[6%] md:hidden">
        {isLoggedIn ? (
          <>
            <motion.button
              initial="initial"
              whileTap="click"
              variants={primaryBtnVariant}
              onClick={() => navigate("/profilePage/accountInformation")}
              className="h-[40px] flex items-center justify-center gap-2 rounded-sm text-[#ffffff] bg-primaryColor"
            >
              <BiUser className="w-5 h-5" />
              My Profile
            </motion.button>
            {userData?.adminStatus && (
              <motion.button
                initial="initial"
                whileTap="click"
                variants={primaryBtnVariant}
                onClick={() => navigate("/administrator")}
                className="h-[40px] flex items-center justify-center gap-2 rounded-sm text-[#ffffff] bg-secondaryColor"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Admin Panel
              </motion.button>
            )}
          </>
        ) : (
          <motion.button
            initial="initial"
            whileTap="click"
            variants={primaryBtnVariant}
            onClick={() => navigate("/login")}
            className="w-[125px] h-[40px] rounded-sm text-[#ffffff] bg-primaryColor"
          >
            Login/Register
          </motion.button>
        )}
      </div>
    </motion.ul>
  )
}