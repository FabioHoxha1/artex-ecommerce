"use client"

import { CategoryLists } from "./categoryLists"
import { useState, useEffect } from "react"
import { RiArrowDropDownLine } from "react-icons/ri"
import { RiArrowDropUpLine } from "react-icons/ri"
import { setSelectedCategory, setSelectedSubCategoryForFilter } from "../../../features/filterBySlice"
import { useDispatch } from "react-redux"
import { AnimatePresence, motion } from "framer-motion"
import { useCategories } from "../../../hooks/useCategories"

const Index = ({ setCheckedCategoryDOM }) => {
  const [isCategorySectionOpen, setIsCategorySectionOpen] = useState(true)
  const [productCategories, setProductCategories] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  const dispatch = useDispatch()
  const { categories: fetchedCategories } = useCategories()

  useEffect(() => {
    setIsLoading(true)
    if (fetchedCategories && Object.keys(fetchedCategories).length > 0) {
      setProductCategories(fetchedCategories)
    } else {
      setProductCategories({})
    }
    setIsLoading(false)
    // Note: useCategories exposes a refresh() if the admin changes categories and wants a forced refetch.
  }, [fetchedCategories])

  // LOOP THROUGH THE DESCENDANTS WHILE SKIPPING THE EVENT TARGET AND GET THE CHECKBOXES DOM
  const handleCheckedCategory = (e) => {
    const descendants = e.currentTarget.getElementsByTagName("*")
    for (let i = 0; i < descendants.length; i++) {
      if (descendants[i] === e.target) {
        continue
      }
      descendants[i].checked = false
    }

    if (e.target.checked) {
      dispatch(
        setSelectedCategory(e.target.parentElement.parentElement.previousElementSibling.firstElementChild.textContent),
      )
      dispatch(setSelectedSubCategoryForFilter(e.target.value))
      setCheckedCategoryDOM(e.target)
    } else {
      dispatch(setSelectedCategory(null))
      dispatch(setSelectedSubCategoryForFilter(null))
    }
  }

  if (isLoading) {
    return (
      <article className="flex flex-col gap-4 md:gap-5 tablet:gap-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Categories</h3>
        </div>
        <div className="text-center py-4">Loading categories...</div>
      </article>
    )
  }

  if (Object.keys(productCategories).length === 0) {
    return (
      <article className="flex flex-col gap-4 md:gap-5 tablet:gap-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Categories</h3>
        </div>
        <div className="text-center py-4 text-gray-500">
          No categories available. Add categories from the admin panel.
        </div>
      </article>
    )
  }

  return (
    <article className="flex flex-col gap-4 md:gap-5 tablet:gap-5">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Categories</h3>
        {isCategorySectionOpen ? (
          <RiArrowDropUpLine
            className=" w-8 h-6 cursor-pointer"
            onClick={() => setIsCategorySectionOpen(!isCategorySectionOpen)}
          />
        ) : (
          <RiArrowDropDownLine
            className="w-8 h-6 cursor-pointer"
            onClick={() => setIsCategorySectionOpen(!isCategorySectionOpen)}
          />
        )}
      </div>
      <AnimatePresence>
        {isCategorySectionOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ overflowY: "hidden", height: 0, transition: { duration: 0.3, ease: "easeOut" } }}
            className="flex flex-col gap-4 tablet:gap-5 md:gap-5 w-[100%]"
            onChange={(e) => handleCheckedCategory(e)}
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
  