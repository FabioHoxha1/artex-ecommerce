import { store } from "../store";
import { setPlaceholderOfproductsDataCurrentlyRequested } from "../features/productSlice";
import { toast } from "react-toastify";

// Helper function to safely get category array from product
const getCategoryArray = (productsData, categoryKey) => {
  if (!productsData || !productsData.categories) {
    return [];
  }
  
  const categories = productsData.categories;
  
  // Handle both Map-like objects and plain objects
  if (typeof categories.get === 'function') {
    return categories.get(categoryKey) || [];
  } else if (typeof categories === 'object') {
    return categories[categoryKey] || [];
  }
  
  return [];
};

export const handleFilterByCategoriesAndPrice = (
  dispatch,
  NoOfProductsPerPage,
  currentPageNo,
  sortedAllProductsData,
  doesTheFnCallNotNeedToast
) => {
  const { selectedSubCategories } = store.getState().filterByCategoryAndPrice;

  // No filters selected
  if (selectedSubCategories.length === 0) {
    dispatch(setPlaceholderOfproductsDataCurrentlyRequested(sortedAllProductsData));
    !doesTheFnCallNotNeedToast &&
      toast("No filter criteria selected", {
        type: "info",
        autoClose: 3000,
      });
    return;
  }

  // Filter products that match ANY of the selected subcategories
  const filteredProducts = sortedAllProductsData.filter((product) => {
    // Check if product matches any of the selected filters
    return selectedSubCategories.some((filter) => {
      const categoryArray = getCategoryArray(product, filter.category);
      return Array.isArray(categoryArray) && categoryArray.includes(filter.subCategory);
    });
  });

  dispatch(setPlaceholderOfproductsDataCurrentlyRequested(filteredProducts));
  
  !doesTheFnCallNotNeedToast &&
    toast(`Filter applied: ${selectedSubCategories.length} categor${selectedSubCategories.length > 1 ? "ies" : "y"} selected`, {
      type: "success",
      autoClose: 3000,
    });
};