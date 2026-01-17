"use client"

import { IoCloseOutline } from "react-icons/io5"
import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import CategoriesSection from "./CategorySection"
import { handleFilterByCategoriesAndPrice } from "../../utils/handleFilterByCategoriesAndPrice"
import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { resetFilter } from "../../utils/resetFilter"
import { motion } from "framer-motion"
import { primaryBtnVariant } from "../../utils/animation"

export const FilterBySection = ({
  isFilterBySectionOpen,
  setIsFilterBySectionOpen,
  currentPageNo,
  NoOfProductsPerPage,
  setIsFilterFnApplied,
}) => {
  // DOMS OF THE CHECKED ELEM FOR UNCHECKING DURING RESET
  const [checkedCategoryDOM, setCheckedCategoryDOM] = useState(null)
  const [isScreenAbove1024, setIsScreenAbove1024] = useState(false)

  const dispatch = useDispatch()
  const location = useLocation()

  const { sortedAllProductsData, sortedSearchedProductData } = useSelector((state) => state.productsData)

  //this is to distinguish between when the filter function is to display toast message and when its not to
  const theFnCallDoesNotNeedToast = true

  // RESET FILTERS WHEN LOCATION URL CHANGES
  useEffect(() => {
    // reset filters when location changes; include referenced variables in deps
    resetFilter(checkedCategoryDOM, null, location, dispatch, theFnCallDoesNotNeedToast)
  }, [location, checkedCategoryDOM, dispatch, theFnCallDoesNotNeedToast]) // Updated to use the entire location object

  // Filter in the shop page is from the sortedAllProductsData while the one in the searchpage is from sortedSearchedProductsData

  useEffect(() => {
    if (location.pathname === "/shop") {
      handleFilterByCategoriesAndPrice(
        dispatch,
        NoOfProductsPerPage,
        currentPageNo,
        sortedAllProductsData,
        theFnCallDoesNotNeedToast,
      )
    }
  }, [location.pathname, sortedAllProductsData, dispatch, NoOfProductsPerPage, currentPageNo, theFnCallDoesNotNeedToast])

  useEffect(() => {
    if (location.pathname === "/search") {
      handleFilterByCategoriesAndPrice(
        dispatch,
        NoOfProductsPerPage,
        currentPageNo,
        sortedSearchedProductData,
        theFnCallDoesNotNeedToast,
      )
    }
  }, [location.pathname, sortedSearchedProductData, dispatch, NoOfProductsPerPage, currentPageNo, theFnCallDoesNotNeedToast])

  // check if screen is larger than 1024px
  // the reasons for the two methods is because the first if/else checks on first render while the resize listener checks on every resize
  // REMAINDER: i need to change this to custom useState later

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsScreenAbove1024(true)
      } else if (window.innerWidth < 1024) {
        setIsScreenAbove1024(false)
      }
    }

    handleResize() // Initial check on first render

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    isScreenAbove1024 && setIsFilterBySectionOpen(true)
  }, [isScreenAbove1024, setIsFilterBySectionOpen])

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: isFilterBySectionOpen ? "0%" : "100%" }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className={`fixed  lg:mt-16 h-[100vh] lg:max-w-[200px]  lg:static lg:ml-[8%] xl:ml-[20%] lg:col-span-1 lg:row-span-2 lg:w-[100%] lg:translate-x-0 lg:h-auto lg:bg-opacity-100 top-0 left-0 w-[100%] lg:bg-transparent z-[1500] bg-opacity-60 bg-[#000000] translate-x-[100%] lg:z-0  ${
        isFilterBySectionOpen && "translate-x-[0%]"
      }`}
    >
      <section className="flex lg:w-[100%] flex-col md:w-[45%] md:max-w-[360px] tablet:w-[60%] tablet:max-w-[320px] max-w-[320px] lg:z-0 z-[2000] overflow-y-auto absolute top-0 bg-white items-start px-[4%] lg:px-0 w-[80%] right-0 pt-4 pb-10 gap-6 tracking-[0.25px] text-lg h-[100%] lg:static ">
        <h2 className="text-center w-[100%] text-[1.75rem] mt-2 font-bold border-b-[2px] border-LightSecondaryColor pb-2">
          Filter by
        </h2>
        <IoCloseOutline
          className="absolute top-5 right-4 w-9 h-9 cursor-pointer lg:hidden"
          onClick={() => setIsFilterBySectionOpen(false)}
        />
        <div className="w-[100%]">
          <CategoriesSection {...{ setCheckedCategoryDOM }} />
        </div>
        <div className="flex items-center justify-between w-[100%] gap-[10%] ">
          <motion.button
            initial="initial"
            whileTap="click"
            variants={primaryBtnVariant}
            className="h-[40px] basis-[35%] bg-primaryColor hover:bg-darkPrimaryColor text-white rounded-md transition-colors duration-300"
            onClick={() => {
              location.pathname === "/shop" &&
                handleFilterByCategoriesAndPrice(dispatch, NoOfProductsPerPage, currentPageNo, sortedAllProductsData)
              location.pathname === "/search" &&
                handleFilterByCategoriesAndPrice(
                  dispatch,
                  NoOfProductsPerPage,
                  currentPageNo,
                  sortedSearchedProductData,
                )

              setIsFilterFnApplied(true)
              isScreenAbove1024 ? setIsFilterBySectionOpen(true) : setIsFilterBySectionOpen(false)
            }}
          >
            Filter
          </motion.button>
          <motion.button
            whileHover={{ backgroundColor: "#8b7355", borderWidth: "0px", color: "#ffffff" }}
            transition={{ duration: 0.4 }}
            className="h-[40px] basis-[65%] bg-transparent border-[1px] border-secondaryColor text-black rounded-md"
            onClick={(e) => {
              resetFilter(checkedCategoryDOM, null, location, dispatch)

              setIsFilterFnApplied(false)
              isScreenAbove1024 ? setIsFilterBySectionOpen(true) : setIsFilterBySectionOpen(false)
            }}
          >
            Reset Filter
          </motion.button>
        </div>
      </section>
    </motion.div>
  )
}
