import { store } from "../store";
import { setPlaceholderOfproductsDataCurrentlyRequested } from "../features/productSlice";
import { clearAllFilters } from "../features/filterBySlice";
import { toast } from "react-toastify";

export const resetFilter = (checkedCategory, checkedPriceRange, location, dispatch, theFnCallDoesNotNeedsToast) => {
  const { sortedAllProductsData, sortedSearchedProductData } = store.getState().productsData;

  // Clear all filter selections in Redux
  dispatch(clearAllFilters());
  
  // Reset products to show all
  if (location.pathname === "/shop") {
    dispatch(setPlaceholderOfproductsDataCurrentlyRequested(sortedAllProductsData));
  }
  if (location.pathname === "/search") {
    dispatch(setPlaceholderOfproductsDataCurrentlyRequested(sortedSearchedProductData));
  }

  !theFnCallDoesNotNeedsToast &&
    toast("Filters have been reset", {
      type: "success",
      autoClose: 3000,
    });
};