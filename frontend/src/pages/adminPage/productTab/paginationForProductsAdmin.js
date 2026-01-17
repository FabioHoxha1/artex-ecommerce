import { FaChevronLeft, FaChevronRight } from "react-icons/fa"

export const PaginationSectionForProductsAdminPage = ({
  productsLength,
  asyncFnParamState,
  asyncFn,
  setAsyncFnParamState,
}) => {
  const { perPage, pageNo } = asyncFnParamState;

  const totalPages = Math.max(1, Math.ceil(productsLength / perPage));

  const buildPageList = (current, total) => {
    const pages = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }
    if (current <= 4) return [1, 2, 3, 4, 5, '...', total];
    if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
    return [1, '...', current - 1, current, current + 1, '...', total];
  };

  const pageList = buildPageList(pageNo, totalPages);

  const goToPage = (number) => {
    if (number === '...') return;
    asyncFn({ ...asyncFnParamState, pageNo: number });
    setAsyncFnParamState({ ...asyncFnParamState, pageNo: number });
  };

  return (
    <div className="flex items-center gap-3 mr-[10%] mt-8 mb-8 md:mr-[12%] lg:mr-[15%]">
      <button
        className="flex items-center gap-2 px-3 py-1 rounded-md bg-primaryColor hover:bg-darkPrimaryColor text-white border border-primaryColor"
        onClick={() => goToPage(Math.max(1, pageNo - 1))}
        disabled={pageNo === 1}
        aria-label="Previous page"
      >
        <FaChevronLeft className="w-4 h-4" /> Prev
      </button>
      <div className="flex items-center gap-2">
        {pageList.map((p, idx) => (
          <button
            key={idx}
            onClick={() => goToPage(p)}
            className={`min-w-[36px] px-3 py-1 flex items-center justify-center border-[2px] transition-all duration-200 cursor-pointer bg-white text-secondaryColor border-LightSecondaryColor hover:bg-lightestPrimaryColor hover:text-darkPrimaryColor ${
              pageNo === p ? 'bg-primaryColor text-white border-primaryColor' : ''
            } ${p === '...' ? 'cursor-default' : ''}`}
            disabled={p === '...'}
          >
            {p}
          </button>
        ))}
      </div>
      <button
        className="flex items-center gap-2 px-3 py-1 rounded-md bg-primaryColor hover:bg-darkPrimaryColor text-white border border-primaryColor"
        onClick={() => goToPage(Math.min(totalPages, pageNo + 1))}
        disabled={pageNo === totalPages}
        aria-label="Next page"
      >
        Next <FaChevronRight className="w-4 h-4" />
      </button>
      <div className="ml-auto text-sm text-secondaryColor">Page {pageNo} of {totalPages}</div>
    </div>
  );
};
