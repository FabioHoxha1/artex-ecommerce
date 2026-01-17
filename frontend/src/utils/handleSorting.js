import { setSortedAllProductsData, setSortedSearchedProductData, setPlaceholderOfproductsDataCurrentlyRequested } from "../features/productSlice";

export const handleSorting = (
  dispatch,
  sortingCriteria,
  allProductsData,
  NoOfProductsPerPage,
  currentPageNo,
  currentPagePathName
) => {
  let sortedArr;
  switch (sortingCriteria) {
    case "Default: Latest":
      // "Latest" should show newest first (descending by updatedAt)
      sortedArr = [...allProductsData].sort((a, z) => z.updatedAt.localeCompare(a.updatedAt));
      break;
    case "Oldest":
      // "Oldest" should show oldest first (ascending by updatedAt)
      sortedArr = [...allProductsData].sort((a, z) => a.updatedAt.localeCompare(z.updatedAt));
      break;
    case "Name: A-Z":
      sortedArr = [...allProductsData].sort((a, z) => {
        let A = a.title.toUpperCase();
        let Z = z.title.toUpperCase();
        if (A > Z) {
          return 1;
        }
        if (A < Z) {
          return -1;
        }
        return 0;
      });
      break;
    case "Name: Z-A":
      sortedArr = [...allProductsData].sort((a, z) => {
        let A = a.title.toUpperCase();
        let Z = z.title.toUpperCase();
        if (A > Z) {
          return -1;
        }
        if (A < Z) {
          return 1;
        }
        return 0;
      });
      break;
    case "Price: low to high":
      sortedArr = [...allProductsData].sort((a, z) => a.price - z.price);
      break;
    case "Price: high to low":
      sortedArr = [...allProductsData].sort((a, z) => z.price - a.price);
      break;
    default:
      break;
  }

  // ensure we always have an array (fallback to original unsorted list)
  if (!Array.isArray(sortedArr)) sortedArr = [...allProductsData];

  if (currentPagePathName === "/shop") {
    dispatch(setSortedAllProductsData(sortedArr));
    // update placeholder directly so the shop page immediately reflects the new sort order
    dispatch(setPlaceholderOfproductsDataCurrentlyRequested(sortedArr));
  }

  if (currentPagePathName === "/search") {
    dispatch(setSortedSearchedProductData(sortedArr));
    // when on search page also update placeholder so UI updates immediately
    dispatch(setPlaceholderOfproductsDataCurrentlyRequested(sortedArr));
  }
};

// SORT THE 'ALLPRODUCTDATA' AT THE START OF THE APP AND ON CHANGE OF THE 'SORTINGCRITERIA' AND DISPATCH THE SORTED ARRAY INTO THE 'SORTEDALLPRODUCT'
