"use client"

import { HomepageCategoryProducts } from "./homepageCategoryProducts"
import { FeaturedCategories } from "./featuredCategories"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { ProductLoader } from "../../../components/loaders/productLoader"
import { useCategories } from "../../../hooks/useCategories"

const Index = () => {
  const [subcategoryProducts, setSubcategoryProducts] = useState([])
  const [categories, setCategories] = useState([])
  const { allProductsData, isLoading } = useSelector((state) => state.productsData)

  // Use shared hook to avoid duplicate concurrent requests across components
  const { categories: fetchedCategories, rawCategories: fetchedRawCategories } = useCategories()

  useEffect(() => {
    if (!fetchedCategories) {
      setCategories([])
      return
    }

    // `useCategories` returns the backend `categories` payload which may be an
    // object keyed by category name (admin API) or an array (legacy `rawCategories`).
    // Convert to the legacy array shape expected by this component:
    // [{ name: string, subcategories: string[] }, ...]
    if (Array.isArray(fetchedCategories)) {
      setCategories(fetchedCategories)
      return
    }

    // If it's an object, transform to an array
    if (typeof fetchedCategories === "object") {
      const transformed = Object.keys(fetchedCategories).map((name) => ({
        name,
        subcategories: Array.isArray(fetchedCategories[name]) ? fetchedCategories[name] : [],
      }))
      setCategories(transformed)
      return
    }

    setCategories([])
  }, [fetchedCategories])

  useEffect(() => {
    if (categories.length > 0 && allProductsData.length > 0) {
      const firstCategory = categories[0]
      const productsToDisplay = []

      const firstThreeSubcategories = firstCategory.subcategories.slice(0, 3)

      firstThreeSubcategories.forEach((subcategory) => {
        let chosenProduct = null

        const rawFirstCategory =
          Array.isArray(fetchedRawCategories) && fetchedRawCategories.length > 0 ? fetchedRawCategories[0] : null

        if (rawFirstCategory && rawFirstCategory.featuredProducts) {
          const featuredMap = rawFirstCategory.featuredProducts
          const featuredId = featuredMap[subcategory]

          // If we found a featured product ID, find the matching product
          if (featuredId) {
            chosenProduct = allProductsData.find((p) => String(p._id) === String(featuredId))
            console.log(`[v0] Using featured product for ${subcategory}:`, featuredId)
          }
        }

        if (!chosenProduct) {
          const filtered = allProductsData.filter((product) => {
            if (!product.categories || typeof product.categories !== "object") {
              return false
            }

            for (const categoryGroup in product.categories) {
              if (
                Array.isArray(product.categories[categoryGroup]) &&
                product.categories[categoryGroup].includes(subcategory)
              ) {
                return true
              }
            }
            return false
          })

          if (filtered.length > 0) {
            chosenProduct = filtered[0]
            console.log(`[v0] No featured product for ${subcategory}, using first product:`, chosenProduct._id)
          }
        }

        if (chosenProduct) {
          productsToDisplay.push({ subcategory, product: chosenProduct })
        }
      })

      setSubcategoryProducts(productsToDisplay)
    }
  }, [allProductsData, categories, fetchedRawCategories])

  return (
    <>
      <h1 className="text-[40px] text-center font-bold">Our products</h1>
      {isLoading ? (
        <ProductLoader />
      ) : (
        <div className="my-16">
          <HomepageCategoryProducts subcategoryProducts={subcategoryProducts} />
        </div>
      )}
      <FeaturedCategories />
    </>
  )
}

export default Index
