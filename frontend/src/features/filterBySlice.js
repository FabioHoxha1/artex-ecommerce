import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Changed to arrays to support multiple selections
  selectedSubCategories: [],
  selectedCategories: [],
  priceRange: null,
};

export const filterBySlice = createSlice({
  name: "filterBySlice",
  initialState,
  reducers: {
    // Toggle a subcategory in the selection
    toggleSubCategory: (state, { payload }) => {
      const { category, subCategory } = payload;
      const existingIndex = state.selectedSubCategories.findIndex(
        (item) => item.category === category && item.subCategory === subCategory
      );
      
      if (existingIndex >= 0) {
        // Remove if already selected
        state.selectedSubCategories.splice(existingIndex, 1);
        // Also remove category if no more subcategories from it
        const hasOtherSubcategories = state.selectedSubCategories.some(
          (item) => item.category === category
        );
        if (!hasOtherSubcategories) {
          state.selectedCategories = state.selectedCategories.filter((c) => c !== category);
        }
      } else {
        // Add if not selected
        state.selectedSubCategories.push({ category, subCategory });
        if (!state.selectedCategories.includes(category)) {
          state.selectedCategories.push(category);
        }
      }
    },
    // Clear all filter selections
    clearAllFilters: (state) => {
      state.selectedSubCategories = [];
      state.selectedCategories = [];
      state.priceRange = null;
    },
    setPriceRange: (state, { payload }) => {
      state.priceRange = payload;
    },
    // Legacy setters for backwards compatibility
    setSelectedSubCategoryForFilter: (state, { payload }) => {
      if (payload === null) {
        state.selectedSubCategories = [];
      }
    },
    setSelectedCategory: (state, { payload }) => {
      if (payload === null) {
        state.selectedCategories = [];
      }
    },
  },
});

export const { 
  toggleSubCategory, 
  clearAllFilters, 
  setPriceRange, 
  setSelectedCategory, 
  setSelectedSubCategoryForFilter 
} = filterBySlice.actions;

export default filterBySlice.reducer;