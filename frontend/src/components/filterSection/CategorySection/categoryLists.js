import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { toggleSubCategory } from "../../../features/filterBySlice";

export const CategoryLists = ({ categoryTitle, productCategories }) => {
  const [isCategoryTitleOpen, setIsCategoryTitleOpen] = useState(false);
  const dispatch = useDispatch();
  const { selectedSubCategories } = useSelector((state) => state.filterByCategoryAndPrice);

  // Check if a subcategory is selected
  const isSubCategorySelected = (subCategory) => {
    return selectedSubCategories.some(
      (item) => item.category === categoryTitle && item.subCategory === subCategory
    );
  };

  // Count selected items in this category
  const selectedCount = selectedSubCategories.filter(
    (item) => item.category === categoryTitle
  ).length;

  const handleCheckboxChange = (subCategory) => {
    dispatch(toggleSubCategory({ category: categoryTitle, subCategory }));
  };

  return (
    <div className="border-b-[1px] border-LightSecondaryColor pb-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium capitalize">{categoryTitle}</h3>
          {selectedCount > 0 && (
            <span className="bg-primaryColor text-white text-xs px-1.5 py-0.5 rounded-full">
              {selectedCount}
            </span>
          )}
        </div>
        {isCategoryTitleOpen ? (
          <RiArrowDropUpLine
            className="w-6 h-5 cursor-pointer"
            onClick={() => setIsCategoryTitleOpen(!isCategoryTitleOpen)}
          />
        ) : (
          <RiArrowDropDownLine
            className="w-6 h-5 cursor-pointer"
            onClick={() => setIsCategoryTitleOpen(!isCategoryTitleOpen)}
          />
        )}
      </div>
      <AnimatePresence>
        {isCategoryTitleOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ overflowY: "hidden", height: 0, transition: { duration: 0.2, ease: "easeOut" } }}
            className="flex flex-col gap-1 mt-2"
          >
            {productCategories[categoryTitle].map((subCategoryTitle, index) => {
              const isSelected = isSubCategorySelected(subCategoryTitle);
              return (
                <div 
                  key={index} 
                  className={`flex gap-2 items-center p-1 rounded cursor-pointer transition-colors ${
                    isSelected ? "bg-lightestPrimaryColor" : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleCheckboxChange(subCategoryTitle)}
                >
                  <input 
                    type="checkbox" 
                    checked={isSelected}
                    onChange={() => {}}
                    className="w-3.5 h-3.5 accent-primaryColor cursor-pointer"
                  />
                  <label className="text-sm cursor-pointer font-normal flex-1">
                    {subCategoryTitle}
                  </label>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};