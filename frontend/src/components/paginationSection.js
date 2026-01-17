"use client"

import { useSelector } from "react-redux"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"

export const PaginationSection = ({ setCurrentPageNo, NoOfProductsPerPage, currentPageNo }) => {
  const { placeholderOfproductsDataCurrentlyRequested } = useSelector((state) => state.productsData)

  const totalItems = placeholderOfproductsDataCurrentlyRequested.length
  const totalPages = Math.max(1, Math.ceil(totalItems / NoOfProductsPerPage))

  const buildPageList = (current, total) => {
    // returns an array containing page numbers and '...' markers
    const pages = []
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i)
      return pages
    }

    if (current <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', total)
      return pages
    }

    if (current >= total - 3) {
      pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total)
      return pages
    }

    // middle
    pages.push(1, '...', current - 1, current, current + 1, '...', total)
    return pages
  }

  const pageList = buildPageList(currentPageNo, totalPages)

  const handleChangePageNo = (number) => {
    if (number === '...' || number < 1 || number > totalPages) return
    setCurrentPageNo(number)
  }

  return (
    <div className="flex items-center gap-3 mx-[10%] mt-12 mb-12 md:mx-[12%] lg:mx-[15%]">
      <button
        className="flex items-center gap-2 px-3 py-1 rounded-md bg-primaryColor hover:bg-darkPrimaryColor text-white border border-primaryColor"
        onClick={() => handleChangePageNo(Math.max(1, currentPageNo - 1))}
        disabled={currentPageNo === 1}
        aria-label="Previous page"
      >
        <FaChevronLeft className="w-4 h-4" /> Prev
      </button>

      <div className="flex items-center gap-2">
        {pageList.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleChangePageNo(p)}
            className={`min-w-[36px] px-3 py-1 flex items-center justify-center border-[2px] transition-all duration-200 cursor-pointer bg-white text-secondaryColor border-LightSecondaryColor hover:bg-lightestPrimaryColor hover:text-darkPrimaryColor ${
              currentPageNo === p ? 'bg-primaryColor text-white border-primaryColor' : ''
            } ${p === '...' ? 'cursor-default' : ''}`}
            disabled={p === '...'}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        className="flex items-center gap-2 px-3 py-1 rounded-md bg-primaryColor hover:bg-darkPrimaryColor text-white border border-primaryColor"
        onClick={() => handleChangePageNo(Math.min(totalPages, currentPageNo + 1))}
        disabled={currentPageNo === totalPages}
        aria-label="Next page"
      >
        Next <FaChevronRight className="w-4 h-4" />
      </button>

      <div className="ml-auto text-sm text-secondaryColor">Page {currentPageNo} of {totalPages}</div>
    </div>
  )
}
