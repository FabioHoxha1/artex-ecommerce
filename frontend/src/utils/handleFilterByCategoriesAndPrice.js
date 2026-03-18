import { store } from "../store";
import { setPlaceholderOfproductsDataCurrentlyRequested } from "../features/productSlice";
import { toast } from "react-toastify";

// FUNCTIONALITY FOR FILTERING BY PRICE
export const priceRangeFn = (productsDataParams, priceRange) => {
  const priceRangeArr = priceRange.split("-");

  if (priceRangeArr[1] === "") {
    let filteredProductsPrice = productsDataParams.filter(
      (productsData) => productsData.price >= Number(priceRangeArr[0])
    );
    return filteredProductsPrice;
  } else {
    let filteredProductsPrice = productsDataParams.filter(
      (productsData) => Number(priceRangeArr[0]) <= productsData.price && productsData.price <= Number(priceRangeArr[1])
    );

    return filteredProductsPrice;
  }
};

// Helper function to safely get category array from product
const getCategoryArray = (productsData, categoryKey) => {
  if (!productsData || !productsData.categories) {
    return [];
  }
  
  const categories = productsData.categories;
  
  // Handle both Map-like objects and plain objects
  if (typeof categories.get === 'function') {
    // It's a Map
    return categories.get(categoryKey) || [];
  } else if (typeof categories === 'object') {
    // It's a plain object (most common after JSON serialization)
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
  const { priceRange, selectedSubCategoryForFilter, selectedCategory } = store.getState().filterByCategoryAndPrice;

  console.log("[v0] Filter called with:", {
    selectedCategory,
    selectedSubCategoryForFilter,
    priceRange,
    productsCount: sortedAllProductsData?.length
  });

  // Debug: Log first product's categories structure
  if (sortedAllProductsData && sortedAllProductsData.length > 0) {
    console.log("[v0] First product categories structure:", sortedAllProductsData[0].categories);
    console.log("[v0] First product title:", sortedAllProductsData[0].title);
  }

  if (selectedSubCategoryForFilter && priceRange) {
    let filteredProductsCategory = sortedAllProductsData.filter((productsData) => {
      const categoryArray = getCategoryArray(productsData, selectedCategory);
      const matches = Array.isArray(categoryArray) && categoryArray.includes(selectedSubCategoryForFilter);
      console.log("[v0] Product:", productsData.title, "Category array:", categoryArray, "Matches:", matches);
      return matches;
    });
    console.log("[v0] Filtered products (category + price):", filteredProductsCategory.length);
    !doesTheFnCallNotNeedToast &&
      toast("Categories and price range filter has been applied", {
        type: "success",
      });
    dispatch(setPlaceholderOfproductsDataCurrentlyRequested(priceRangeFn(filteredProductsCategory, priceRange)));
  } else if (!selectedSubCategoryForFilter && !priceRange) {
    dispatch(setPlaceholderOfproductsDataCurrentlyRequested(sortedAllProductsData));
    !doesTheFnCallNotNeedToast &&
      toast("no filter criterias is selected", {
        type: "info",
        autoClose: 3000,
      });
  } else if (selectedSubCategoryForFilter) {
    let filteredProductsCategory = sortedAllProductsData.filter((productsData) => {
      const categoryArray = getCategoryArray(productsData, selectedCategory);
      const matches = Array.isArray(categoryArray) && categoryArray.includes(selectedSubCategoryForFilter);
      console.log("[v0] Product:", productsData.title, "Category array:", categoryArray, "Matches:", matches);
      return matches;
    });
    console.log("[v0] Filtered products (category only):", filteredProductsCategory.length);
    !doesTheFnCallNotNeedToast &&
      toast("Categories filter has been applied", {
        type: "success",
        autoClose: 3000,
      });
    dispatch(setPlaceholderOfproductsDataCurrentlyRequested(filteredProductsCategory));
  } else if (priceRange) {
    !doesTheFnCallNotNeedToast &&
      toast("Price range filter has been applied", {
        type: "success",
        autoClose: 3000,
      });
    dispatch(setPlaceholderOfproductsDataCurrentlyRequested(priceRangeFn(sortedAllProductsData, priceRange)));
  }
};

//FILTER THE PRODUCTSDATA FROM THE SHALLOW COPY OF THE 'sortedAllProductsData' -THIS IS DONE DUE TO FACT THE 'allProductsData' IS IMMUTABLE WHILE THE FORMER CAN RECEIVE UPDATES FROM THE SORTING FUNCTIONS.IT IS DONE BY CHECKING THE VALUE OF THE 'selectedSubCategoryForFilter && priceRange' AS CRITERIA,FILTERED DATA THEN DISPATCHED INTO THE  'placeholderOfproductsDataCurrentlyRequested' WHICH IN TURN TRIGGERS THE PAGINATION FUNCTION IN THE USEEFFECT IN THE INDEX PAGE
