"use client"

import { RiArrowDropDownLine } from "react-icons/ri"
import { BiFilter } from "react-icons/bi"
import { SingleProductBox } from "../../components/singleProductBox"
import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState } from "react"
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
  const { priceRange, selectedSubCategoryForFilter, selectedCategory } = useSelector(
    (state) => state.filterByCategoryAndPrice,
  )

  const NoOfProductsPerPage = 12
  const [currentPageNo, setCurrentPageNo] = useState(1)

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchedProduct = urlParams.get("searchedProduct")
    console.log("[v0] Search term from URL:", searchedProduct)
    setSearchTerm(searchedProduct || "")
  }, [location.search])

  useEffect(() => {
    console.log("[v0] All products:", allProductsData)
    console.log("[v0] Search term:", searchTerm)

    const productsToSort = searchTerm
      ? allProductsData.filter((product) => {
          if (!product || !product.title) return false
          const matches = product.title.toLowerCase().includes(searchTerm.toLowerCase())
          console.log(`[v0] Product "${product.title}" matches "${searchTerm}":`, matches)
          return matches
        })
      : allProductsData

    console.log("[v0] Products to sort:", productsToSort)
    handleSorting(dispatch, sortingCriteria, productsToSort, NoOfProductsPerPage, currentPageNo, location.pathname)
  }, [dispatch, sortingCriteria, allProductsData, searchTerm, currentPageNo, location.pathname])

  useEffect(() => {
    console.log("[v0] sortedAllProductsData:", sortedAllProductsData)
    console.log("[v0] Has search term:", !!searchTerm)
    console.log("[v0] Has category filter:", !!selectedSubCategoryForFilter)
    console.log("[v0] Has price filter:", !!priceRange)

    if (searchTerm && !selectedSubCategoryForFilter && !priceRange) {
      console.log("[v0] Setting placeholder to sortedAllProductsData:", sortedAllProductsData)
      dispatch(setPlaceholderOfproductsDataCurrentlyRequested(sortedAllProductsData))
    }
  }, [searchTerm, sortedAllProductsData, selectedSubCategoryForFilter, priceRange, dispatch])

  useEffect(() => {
    handlePaginationProductsPage(
      dispatch,
      NoOfProductsPerPage,
      currentPageNo,
      placeholderOfproductsDataCurrentlyRequested,
    )
  }, [currentPageNo, NoOfProductsPerPage, placeholderOfproductsDataCurrentlyRequested, dispatch])

  const handleSortingCriteriaSelection = (e) => {
    if (e.target.dataset.list) {
      setSortingCriteria(e.target.textContent)
      // reset to first page when sort changes
      setCurrentPageNo(1)
      e.currentTarget.classList.remove("active-sorting-lists")
    }
  }

  return (
    <section className="lg:grid lg:grid-cols-[250px_1fr_1fr_1fr] lg:grid-rows-[auto_1fr_auto]">
      <div className="mt-4 tablet:px-[6%] w-[100%] h-[54px] bg-neutralColor text-secondaryColor xl:px-[4%] px-[4%] lg:px-[2%] flex items-center justify-between font-bold  font-RobotoCondensed lg:col-span-full lg:row-span-1">
        <div className="flex gap-[4px] items-center text-base">
          <IoIosArrowBack />
          <li onClick={() => navigate("/")} className="hover:underline capitalize">
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
          {selectedSubCategoryForFilter && (
            <>
              {" "}
              <IoIosArrowBack />
              <span>{selectedCategory}</span> <IoIosArrowBack />
              <span>{selectedSubCategoryForFilter}</span>
            </>
          )}
        </div>
      </div>

      <FilterBySection
        {...{
          isFilterBySectionOpen,
          setIsFilterBySectionOpen,
          currentPageNo,
          NoOfProductsPerPage,
          setIsFilterFnApplied,
        }}
      />

      <div className="lg:col-start-2  lg:col-end-5 lg:row-span-1 lg:ml-[8%] xl:ml-[10%] lg:mr-[3%] xl:mr-[5%]">
        <h1 className="text-center font-bold text-[2.5rem] my-8">
          {searchTerm ? `Search Results for "${searchTerm}"` : "Shop"}
        </h1>
        {isLoading ? (
          <ProductLoader />
        ) : (
          <>
            <div className="lg:flex lg:justify-between lg:items-start">
              {isFilterFnApplied && (selectedSubCategoryForFilter || priceRange) && (
                <article className="w-[300px] tablet:w-[360px] max-w-[75%] md:w-[400px]  bg-[#ffffff] laptop:w-[17%]  ml-[4%] tablet:ml-[6%]  mb-6 flex-col flex gap-2 lg:ml-0 lg:order-2 lg:min-w-[400px]">
                  <h3 className="text-lg font-bold ml-2"> Active Filters</h3>
                  <div className="flex  justify-between h-14 bg-primaryColor text-white rounded-md shadow-[0px_3px_8px_0px_rgba(0,0,0,0.2)]  items-center px-[5%] font-medium text-base ">
                    {selectedSubCategoryForFilter && <h3>Sub-Category : {selectedSubCategoryForFilter}</h3>}
                    {priceRange && <h3>priceRange : {priceRange}($)</h3>}
                  </div>
                </article>
              )}
              <article className="w-[65%] tablet:w-[40%] md:w-[30%] bg-[#ffffff] lg:order-1 laptop:w-[17%] lg:w-[30%] ml-[4%] tablet:ml-[6%]  mb-6 flex-col lg:ml-0 flex gap-2 lg:max-w-[262px]">
                <h3 className="text-lg font-bold ml-2"> Sort by</h3>
                <div
                  className={`flex justify-between h-14 rounded-md  shadow-[0.5px_2px_32px_-2px_rgba(0,0,0,0.1)]  items-center px-[10%] cursor-pointer ${
                    sortingCriteria !== "Default: Latest" && "bg-primaryColor text-white"
                  }`}
                  onClick={(e) => {
                    e.currentTarget.nextElementSibling.classList.toggle("active-sorting-lists")
                  }}
                >
                  <h2 className="text-black">{sortingCriteria}</h2>
                  <RiArrowDropDownLine className="w-8 h-8 " />
                </div>
                <div
                  className={`hidden flex-col bg-[#ffffff] rounded-md shadow-[0px_3px_8px_0px_rgba(0,0,0,0.2)]   py-4  gap-4 z-[200] px-[10%] sticky top-0 left-0 right-0 mb-[-16.5rem] lg:mb-[-15.5rem] transition duration-700 ease-in-out sorting-lists ${
                    sortingCriteria !== "Default: Latest" && "bg-primaryColor text-white"
                  }`}
                  onClick={(e) => handleSortingCriteriaSelection(e)}
                >
                  <li data-list="sorting-criteria" className="text-black">Default: Latest</li>
                  <li data-list="sorting-criteria" className="text-black">Name: A-Z</li>
                  <li data-list="sorting-criteria" className="text-black">Name: Z-A</li>
                  <li data-list="sorting-criteria" className="text-black">Price: low to high</li>
                  <li data-list="sorting-criteria" className="text-black">Price: high to low</li>
                  <li data-list="sorting-criteria" className="text-black">Oldest</li>
                </div>
              </article>
            </div>

            {placeholderOfproductsDataCurrentlyRequested.length > 0 ? (
              <>
                {" "}
                <section className="grid grid-cols-2 tablet:grid-cols-2 md:grid-cols-3 xl:grid-cols-4  lg:w-[100%] w-[96%] mx-auto items-center justify-center gap-4  tablet:justify-between tablet:w-[92%] md:justify-between tablet:gap-y-6 md:gap-y-8 md:gap-[2%]  tablet:gap-[3%]">
                  {productsDataForCurrentPage.map((productsData, index) => {
                    return <SingleProductBox key={index} productsData={productsData} />
                  })}
                </section>
                <PaginationSection {...{ setCurrentPageNo, NoOfProductsPerPage, currentPageNo }} />
                <div className="fixed right-[7%] bottom-[7%] lg:hidden z-[1000]">
                  <BiFilter
                    className="w-16 h-16 bg-primaryColor shadow-lg shadow-[rgba(0,0,0,0.2)] fill-white cursor-pointer"
                    onClick={() => setIsFilterBySectionOpen(true)}
                  />
                  <span className="absolute   -left-5 -top-2 -translate-y-full w-20 px-2 py-1 bg-gray-700 rounded-lg text-center text-white text-sm after:content-[''] after:absolute after:left-1/2 after:top-[100%] shadow-lg shadow-[rgba(0,0,0,0.2)]   after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                    Filter Products
                  </span>
                </div>
              </>
            ) : (
              <h1 className="text-center text-[28px] md-[32px] lg:text-[36px]">
                {searchTerm ? `No products found for "${searchTerm}"` : "product match not found"}
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
