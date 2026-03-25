"use client"

import { CategoryLists } from "./categoryLists"
import { useState, useEffect } from "react"
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri"
import { useSelector } from "react-redux"
import { AnimatePresence, motion } from "framer-motion"
import { useCategories } from "../../../hooks/useCategories"

const Index = () => {
  const [isCategorySectionOpen, setIsCategorySectionOpen] = useState(true)
  const [productCategories, setProductCategories] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  const { categories: fetchedCategories } = useCategories()
  const { selectedSubCategories } = useSelector((state) => state.filterByCategoryAndPrice)

  useEffect(() => {
    setIsLoading(true)
    if (fetchedCategories && Object.keys(fetchedCategories).length > 0) {
      setProductCategories(fetchedCategories)
    } else {
      setProductCategories({})
    }
    setIsLoading(false)
  }, [fetchedCategories])

  if (isLoading) {
    return (
      <article className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold">Categories</h3>
        </div>
        <div className="text-center py-2 text-sm">Loading...</div>
      </article>
    )
  }

  if (Object.keys(productCategories).length === 0) {
    return (
      <article className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold">Categories</h3>
        </div>
        <div className="text-center py-2 text-gray-500 text-sm">
          No categories available
        </div>
      </article>
    )
  }

  return (
    <article className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold">Categories</h3>
        {isCategorySectionOpen ? (
          <RiArrowDropUpLine
            className="w-6 h-5 cursor-pointer"
            onClick={() => setIsCategorySectionOpen(!isCategorySectionOpen)}
          />
        ) : (
          <RiArrowDropDownLine
            className="w-6 h-5 cursor-pointer"
            onClick={() => setIsCategorySectionOpen(!isCategorySectionOpen)}
          />
        )}
      </div>
      {selectedSubCategories.length > 0 && (
        <div className="text-xs text-primaryColor font-medium">
          {selectedSubCategories.length} filter{selectedSubCategories.length > 1 ? "s" : ""} selected
        </div>
      )}
      <AnimatePresence>
        {isCategorySectionOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ overflowY: "hidden", height: 0, transition: { duration: 0.2, ease: "easeOut" } }}
            className="flex flex-col gap-2 w-[100%]"
          >
            {Object.keys(productCategories).map((categoryTitle, index) => {
              return <CategoryLists key={index} {...{ categoryTitle, productCategories }} />
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  )
}

export default Index