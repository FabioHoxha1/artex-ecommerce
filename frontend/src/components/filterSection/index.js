"use client"

import { IoCloseOutline } from "react-icons/io5"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import CategoriesSection from "./CategorySection"
import { handleFilterByCategoriesAndPrice } from "../../utils/handleFilterByCategoriesAndPrice"
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
  const [isScreenAbove1024, setIsScreenAbove1024] = useState(false)

  const dispatch = useDispatch()
  const location = useLocation()

  const { sortedAllProductsData, sortedSearchedProductData } = useSelector((state) => state.productsData)
  const { selectedSubCategories } = useSelector((state) => state.filterByCategoryAndPrice)

  const theFnCallDoesNotNeedToast = true

  // RESET FILTERS WHEN LOCATION URL CHANGES
  useEffect(() => {
    resetFilter(null, null, location, dispatch, theFnCallDoesNotNeedToast)
  }, [location.pathname, dispatch])

  // Auto-apply filter when selections change (for desktop)
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
  }, [location.pathname, sortedAllProductsData, selectedSubCategories, dispatch, NoOfProductsPerPage, currentPageNo])

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
  }, [location.pathname, sortedSearchedProductData, selectedSubCategories, dispatch, NoOfProductsPerPage, currentPageNo])

  // Check screen size
  useEffect(() => {
    const handleResize = () => {
      setIsScreenAbove1024(window.innerWidth >= 1024)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    isScreenAbove1024 && setIsFilterBySectionOpen(true)
  }, [isScreenAbove1024, setIsFilterBySectionOpen])

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: isFilterBySectionOpen ? "0%" : "100%" }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className={`fixed lg:sticky lg:top-4 h-[100vh] lg:h-auto lg:max-h-[calc(100vh-2rem)] lg:self-start lg:max-w-[180px] lg:static lg:ml-[4%] xl:ml-[8%] lg:col-span-1 lg:row-span-2 lg:w-[100%] lg:translate-x-0 lg:bg-opacity-100 top-0 left-0 w-[100%] lg:bg-transparent z-[1500] bg-opacity-60 bg-[#000000] translate-x-[100%] lg:z-0 ${
        isFilterBySectionOpen && "translate-x-[0%]"
      }`}
    >
      <section className="flex lg:w-[100%] flex-col md:w-[40%] md:max-w-[280px] tablet:w-[55%] tablet:max-w-[260px] max-w-[280px] lg:z-0 z-[2000] overflow-y-auto absolute top-0 bg-white items-start px-[3%] lg:px-0 w-[75%] right-0 pt-3 pb-8 gap-4 tracking-[0.25px] text-base h-[100%] lg:static lg:h-auto lg:overflow-visible lg:bg-transparent lg:shadow-none shadow-lg">
        <h2 className="text-center w-[100%] text-lg font-bold border-b-[1px] border-LightSecondaryColor pb-2">
          Filter by
        </h2>
        <IoCloseOutline
          className="absolute top-3 right-3 w-7 h-7 cursor-pointer lg:hidden"
          onClick={() => setIsFilterBySectionOpen(false)}
        />
        <div className="w-[100%] max-h-[60vh] lg:max-h-[50vh] overflow-y-auto pr-1">
          <CategoriesSection />
        </div>
        
        {/* Selected filters count */}
        {selectedSubCategories.length > 0 && (
          <div className="w-full text-xs text-gray-600 border-t border-LightSecondaryColor pt-2">
            {selectedSubCategories.length} filter{selectedSubCategories.length > 1 ? "s" : ""} active
          </div>
        )}
        
        <div className="flex items-center justify-between w-[100%] gap-2 mt-auto">
          <motion.button
            initial="initial"
            whileTap="click"
            variants={primaryBtnVariant}
            className="h-[36px] flex-1 bg-primaryColor hover:bg-darkPrimaryColor text-white text-sm rounded transition-colors duration-300"
            onClick={() => {
              if (location.pathname === "/shop") {
                handleFilterByCategoriesAndPrice(dispatch, NoOfProductsPerPage, currentPageNo, sortedAllProductsData)
              }
              if (location.pathname === "/search") {
                handleFilterByCategoriesAndPrice(dispatch, NoOfProductsPerPage, currentPageNo, sortedSearchedProductData)
              }
              setIsFilterFnApplied(selectedSubCategories.length > 0)
              if (!isScreenAbove1024) setIsFilterBySectionOpen(false)
            }}
          >
            Apply
          </motion.button>
          <motion.button
            whileHover={{ backgroundColor: "#8b7355", borderWidth: "0px", color: "#ffffff" }}
            transition={{ duration: 0.4 }}
            className="h-[36px] flex-1 bg-transparent border-[1px] border-secondaryColor text-black text-sm rounded"
            onClick={() => {
              resetFilter(null, null, location, dispatch)
              setIsFilterFnApplied(false)
              if (!isScreenAbove1024) setIsFilterBySectionOpen(false)
            }}
          >
            Reset
          </motion.button>
        </div>
      </section>
    </motion.div>
  )
}