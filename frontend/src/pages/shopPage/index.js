"use client"

import { RiArrowDropDownLine } from "react-icons/ri"
import { BiFilter } from "react-icons/bi"
import { SingleProductBox } from "../../components/singleProductBox"
import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState, useRef } from "react"
import FooterSection from "../../components/footerSection"
import { ProductLoader } from "../../components/loaders/productLoader"
import { PaginationSection } from "../../components/paginationSection"
import { handlePaginationProductsPage } from "../../utils/handlePaginationProductsPage"
import { FilterBySection } from "../../components/filterSection"
import { handleSorting } from "../../utils/handleSorting"
import { IoIosArrowBack } from "react-icons/io"
import { useLocation, useNavigate } from "react-router-dom"
import { setPlaceholderOfproductsDataCurrentlyRequested } from "../../features/productSlice"

const Index = () => {
  const [sortingCriteria, setSortingCriteria] = useState("Default: Latest")
  const [isFilterBySectionOpen, setIsFilterBySectionOpen] = useState(false)
  const [isFilterFnApplied, setIsFilterFnApplied] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSortOpen, setIsSortOpen] = useState(false)

  const sortRef = useRef(null)

  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    allProductsData,
    isLoading,
    placeholderOfproductsDataCurrentlyRequested,
    productsDataForCurrentPage,
    sortedAllProductsData,
  } = useSelector((state) => state.productsData)

  const { selectedSubCategories } = useSelector(
    (state) => state.filterByCategoryAndPrice,
  )

  const NoOfProductsPerPage = 12
  const [currentPageNo, setCurrentPageNo] = useState(1)

  // GET SEARCH PARAM
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchedProduct = urlParams.get("searchedProduct")
    setSearchTerm(searchedProduct || "")
  }, [location.search])

  // SORT + SEARCH
  useEffect(() => {
    const productsToSort = searchTerm
      ? allProductsData.filter((p) =>
          p?.title?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : allProductsData

    handleSorting(
      dispatch,
      sortingCriteria,
      productsToSort,
      NoOfProductsPerPage,
      currentPageNo,
      location.pathname
    )
  }, [dispatch, sortingCriteria, allProductsData, searchTerm, currentPageNo, location.pathname])

  // SET PLACEHOLDER
  useEffect(() => {
    if (searchTerm && selectedSubCategories.length === 0) {
      dispatch(setPlaceholderOfproductsDataCurrentlyRequested(sortedAllProductsData))
    }
  }, [searchTerm, sortedAllProductsData, selectedSubCategories, dispatch])

  // PAGINATION
  useEffect(() => {
    handlePaginationProductsPage(
      dispatch,
      NoOfProductsPerPage,
      currentPageNo,
      placeholderOfproductsDataCurrentlyRequested,
    )
  }, [currentPageNo, NoOfProductsPerPage, placeholderOfproductsDataCurrentlyRequested, dispatch])

  // CLOSE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setIsSortOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSortingCriteriaSelection = (value) => {
    setSortingCriteria(value)
    setCurrentPageNo(1)
    setIsSortOpen(false)
  }

  return (
    <section className="lg:grid lg:grid-cols-[250px_1fr_1fr_1fr] lg:grid-rows-[auto_1fr_auto]">

      {/* HEADER */}
      <div className="mt-4 px-[4%] h-[54px] bg-neutralColor text-secondaryColor flex items-center font-bold lg:col-span-full">
        <div className="flex gap-1 items-center">
          <IoIosArrowBack />
          <li onClick={() => navigate("/")} className="hover:underline cursor-pointer">
            Home
          </li>
          <IoIosArrowBack />
          <span>Shop</span>
          {searchTerm && (
            <>
              <IoIosArrowBack />
              <span>Search: {searchTerm}</span>
            </>
          )}
        </div>
      </div>

      {/* FILTER */}
      <FilterBySection
        {...{
          isFilterBySectionOpen,
          setIsFilterBySectionOpen,
          currentPageNo,
          NoOfProductsPerPage,
          setIsFilterFnApplied,
        }}
      />

      {/* MAIN */}
      <div className="lg:col-start-2 lg:col-end-5 mt-2 px-[4%] relative z-0">

        <h1 className="text-center font-bold text-3xl my-2">
          {searchTerm ? `Search Results for "${searchTerm}"` : "Shop"}
        </h1>

        {isLoading ? (
          <ProductLoader />
        ) : (
          <>
            <div className="flex justify-between items-start mb-6">

              {/* SORT */}
              <div className="relative w-[220px]" ref={sortRef}>
                <h3 className="text-base font-bold mb-2">Sort by</h3>

                <div
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex justify-between items-center h-12 px-4 rounded-md shadow cursor-pointer bg-white"
                >
                  <span>{sortingCriteria}</span>
                  <RiArrowDropDownLine className="w-6 h-6" />
                </div>

                {/* DROPDOWN */}
                <div
                  className={`absolute top-full left-0 w-full bg-white shadow-lg rounded-md mt-2 z-[9999] pointer-events-auto transition-all duration-200 ${
                    isSortOpen ? "opacity-100 visible" : "opacity-0 invisible"
                  }`}
                >
                  {["Default: Latest", "Name: A-Z", "Name: Z-A", "Oldest"].map((item) => (
                    <div
                      key={item}
                      onClick={() => handleSortingCriteriaSelection(item)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* ACTIVE FILTERS */}
              {isFilterFnApplied && selectedSubCategories.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold mb-2">
                    Active Filters ({selectedSubCategories.length})
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    {selectedSubCategories.map((f, i) => (
                      <span key={i} className="px-3 py-1 bg-primaryColor text-white rounded-full text-sm">
                        {f.subCategory}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* PRODUCTS */}
            {placeholderOfproductsDataCurrentlyRequested.length > 0 ? (
              <>
                <section className="relative z-0 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {productsDataForCurrentPage.map((p, i) => (
                    <SingleProductBox key={i} productsData={p} />
                  ))}
                </section>

                <PaginationSection
                  {...{ setCurrentPageNo, NoOfProductsPerPage, currentPageNo }}
                />

                {/* MOBILE FILTER */}
                <div className="fixed right-6 bottom-6 lg:hidden z-[1000]">
                  <BiFilter
                    className="w-14 h-14 bg-primaryColor text-white rounded-full shadow cursor-pointer"
                    onClick={() => setIsFilterBySectionOpen(true)}
                  />
                </div>
              </>
            ) : (
              <h1 className="text-center text-2xl">
                {searchTerm
                  ? `No products found for "${searchTerm}"`
                  : "No products found"}
              </h1>
            )}
          </>
        )}
      </div>

      <FooterSection />
    </section>
  )
}

export default Index