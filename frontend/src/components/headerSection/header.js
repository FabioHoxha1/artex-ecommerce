"use client"
import { useEffect, useState } from "react"
import { GiHamburgerMenu } from "react-icons/gi"
import { IoCloseOutline } from "react-icons/io5"
import { FiHeart } from "react-icons/fi"
import { AiOutlineShoppingCart } from "react-icons/ai"
import { BiSearch } from "react-icons/bi"
import { NavTabs } from "./navTabs"
import { useNavigate, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import { BiUser } from "react-icons/bi"
import { IoChevronDown } from "react-icons/io5"
import { toast } from "react-toastify"
import logoDark from "../../logoDark.png"
import { motion, AnimatePresence } from "framer-motion"

export const Header = ({ setIsWishlistActive, setIsCartSectionActive, isLargeScreen }) => {
  const [displayVerticalNavBar, setDisplayVerticalNavBar] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)

  const [isSearchClicked, setIsSearchClicked] = useState(false)
  const [totalProductQuantityCart, setTotalProductQuantityCart] = useState(0)

  const { allProductsData, isLoading, loadingOrErrorMessage } = useSelector((state) => state.productsData)
  const { isLoggedIn, userData } = useSelector((state) => state.userAuth)
  const { wishlist, cart } = useSelector((state) => state.wishlistAndCartSection)

  const navigate = useNavigate()
  const navigateToSearchPage = useNavigate()
  const location = useLocation()

  const handleSearching = (e) => {
    const searchValue = e.currentTarget.previousElementSibling.value

    if (isLoading && loadingOrErrorMessage === "Loading") {
      toast("Hold on,while product is loading", {
        type: "warning",
        autoClose: 3000,
      })
    }
    if (isLoading && loadingOrErrorMessage !== "Loading") {
      toast("Products couldnt be loaded", {
        type: "error",
        autoClose: 3000,
      })
    } else if (allProductsData.length > 0) {
      navigateToSearchPage(
        {
          pathname: "/shop",
          search: `?searchedProduct=${searchValue}`,
        },
        {
          state: location.pathname,
        },
      )
      setIsSearchClicked(false)
    }
  }

  useEffect(() => {
    setIsSearchClicked(false)
    setDisplayVerticalNavBar(false)
    setShowUserDropdown(false)
  }, [location.pathname])

  useEffect(() => {
    isLargeScreen && setDisplayVerticalNavBar(false)
  }, [isLargeScreen])

  useEffect(() => {
    let total = 0
    for (const key of cart) {
      total += key.quantity
    }
    setTotalProductQuantityCart(total)
  }, [cart])

  const handleUserIconClick = () => {
    if (isLoggedIn) {
      setShowUserDropdown(!showUserDropdown)
    } else {
      navigate("/login")
    }
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showUserDropdown && !e.target.closest(".user-dropdown-container")) {
        setShowUserDropdown(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [showUserDropdown])

  return (
    <header className="h-[60px] xs:h-[70px] md:h-[80px] sticky top-0 z-[1000] bg-[#ffffff]">
      <nav className="w-[100%] h-[100%] font-Roboto px-[3%] xs:px-[4%] tablet:px-[6%] lg:px-[2%] xl:px-[4%] font-medium flex items-center justify-between shadow-[0px_0px_4px_0px_rgba(14,19,24,0.7)] ">
        <img
          src={logoDark || "/placeholder.svg"}
          alt=""
          className="w-[120px] xs:w-[140px] md:w-[160px] cursor-pointer h-auto max-w-[160px]"
          onClick={() => navigate("/")}
        />
        {isLargeScreen && <NavTabs />}
        <div className="flex items-center gap-2 xs:gap-3 tablet:gap-4 xl:gap-6 2xl:gap-7 md:gap-4 md:basis-[25%] lg:basis-auto text-[18px]">
          <div className="xl:flex xl:items-center cursor-pointer" onClick={() => setIsSearchClicked(!isSearchClicked)}>
            <div className="relative p-2 xs:p-3 bg-neutralColor rounded-[50%]">
              <BiSearch className="w-4 h-4 xs:w-5 xs:h-5 stroke-secondaryColor" />
            </div>
            <span className="text-[18px] hidden cursor-pointer xl:block">&nbsp; Search</span>
          </div>
          {isLargeScreen && (
            <div
              className="xl:flex xl:items-center cursor-pointer relative user-dropdown-container"
              onClick={handleUserIconClick}
            >
              <div className="relative p-3 bg-neutralColor rounded-[50%]">
                <BiUser className="w-5 h-5 stroke-secondaryColor" />
              </div>
              {isLoggedIn ? (
                <div className="flex items-center">
                  <span className="text-[18px] hidden cursor-pointer xl:block">&nbsp;{userData.username}</span>
                  <IoChevronDown className="hidden xl:block ml-1" />
                </div>
              ) : (
                <span className="text-[18px] hidden cursor-pointer xl:block">&nbsp;Login/Register</span>
              )}
              {isLoggedIn && showUserDropdown && (
                <div
                  className="absolute top-[100%] right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-50 border border-gray-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className="px-4 py-3 hover:bg-neutralColor cursor-pointer flex items-center gap-2 transition-colors"
                    onClick={() => {
                      navigate("/profilePage/accountInformation")
                      setShowUserDropdown(false)
                    }}
                  >
                    <BiUser className="w-5 h-5" />
                    My Profile
                  </div>
                  {userData.adminStatus && (
                    <div
                      className="px-4 py-3 hover:bg-neutralColor cursor-pointer flex items-center gap-2 text-primaryColor font-medium transition-colors"
                      onClick={() => {
                        navigate("/administrator")
                        setShowUserDropdown(false)
                      }}
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
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <div className="xl:flex xl:items-center cursor-pointer">
            <div
              className="relative p-2 xs:p-3 bg-neutralColor rounded-[50%]"
              onClick={() => setIsWishlistActive(true)}
            >
              <FiHeart className="w-4 h-4 xs:w-5 xs:h-5 stroke-secondaryColor" />
              <span className="absolute text-[10px] xs:text-[12px] top-[-4px] right-[-6px] xs:right-[-9px] z-10 bg-primaryColor text-white px-1 text-center rounded-[50%]">
                {wishlist.length}
              </span>
            </div>
            <span className="text-[18px] hidden cursor-pointer xl:block">&nbsp;Wishlist</span>
          </div>
          <div className="xl:flex xl:items-center cursor-pointer" onClick={() => setIsCartSectionActive(true)}>
            <div className="relative p-2 xs:p-3 bg-neutralColor rounded-[50%]">
              <AiOutlineShoppingCart className="w-4 h-4 xs:w-5 xs:h-5" />
              <span className="absolute text-[10px] xs:text-[12px] top-[-4px] right-[-6px] xs:right-[-9px] z-10 bg-primaryColor text-white px-1 text-center rounded-[50%]">
                {totalProductQuantityCart}
              </span>
            </div>
            <span className="text-[18px] hidden cursor-pointer xl:block">&nbsp;Quote</span>
          </div>
          <button
            className="p-2 xs:p-3 bg-neutralColor md:hidden"
            onClick={() => setDisplayVerticalNavBar(!displayVerticalNavBar)}
          >
            {displayVerticalNavBar ? (
              <IoCloseOutline className="w-4 h-4 xs:w-5 xs:h-5" />
            ) : (
              <GiHamburgerMenu className="w-4 h-4 xs:w-5 xs:h-5" />
            )}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {isSearchClicked && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 45 }}
            exit={{ height: "auto", transition: { duration: 0.3, ease: "easeOut" } }}
            transition={{ type: "spring", stiffness: 100, dampness: 5 }}
            className="w-[94%] xs:w-[92%] lg:xl:w-[92%] tablet:w-[88%] absolute top-[100%] left-[3%] xs:left-[4%] tablet:left-[6%] lg:w-[96%] lg:left-[2%] xl:left-[4%] bottom-auto searchBar h-[45px] bg-neutralColor text-secondaryColor z-50 shadow-[0_4px_6px_-2px_rgba(0,0,0,0.2)] flex justify-between"
          >
            <input
              className="w-[80%] xs:w-[85%] text-[16px] xs:text-[18px] pl-4 xs:pl-6 h-[100%] bg-neutralColor border-none outline-none"
              type="search"
              name=""
              placeholder="search ..."
              id=""
            />
            <button
              className="bg-primaryColor max-w-[100px] w-[20%] xs:w-[15%] h-[100%] flex justify-center items-center"
              onClick={(e) => handleSearching(e)}
            >
              <BiSearch className="w-5 h-5 tablet:w-6 tablet:h-6 md:w-6 md:h-6" fill="white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {displayVerticalNavBar && <NavTabs isLoggedIn={isLoggedIn} userData={userData} />}
      </AnimatePresence>
    </header>
  )
}
