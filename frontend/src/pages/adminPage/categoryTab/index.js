"use client"

import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { AiOutlineClose } from "react-icons/ai"

export const CategoryManagement = () => {
  const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000"
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [newCategoryGroup, setNewCategoryGroup] = useState("")
  const [newCategoryValue, setNewCategoryValue] = useState("")
  const [selectedGroup, setSelectedGroup] = useState("")

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/v1/categories`)
      const fetchedCategories = response.data.rawCategories || []
      setCategories(fetchedCategories)
      setIsLoading(false)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
      toast.error(error?.response?.data?.message || "Failed to load categories")
      setIsLoading(false)
    }
  }, [serverUrl])

  // UI state for selecting a featured product per subcategory
  const [isPickModalOpen, setIsPickModalOpen] = useState(false)
  const [pickModalCategory, setPickModalCategory] = useState(null)
  const [pickModalSubcategory, setPickModalSubcategory] = useState("")
  const [pickModalProducts, setPickModalProducts] = useState([])
  const [isPickLoading, setIsPickLoading] = useState(false)

  const openPickModal = async (category, subcategory) => {
    setPickModalCategory(category)
    setPickModalSubcategory(subcategory)
    setIsPickModalOpen(true)
    setIsPickLoading(true)
    try {
      const { data } = await axios.get(`${serverUrl}/api/v1/products`) // fetch all products then filter client-side
      const allProducts = data.products || []
      const matched = allProducts.filter((product) => {
        if (!product.categories || typeof product.categories !== "object") return false
        for (const cg in product.categories) {
          if (Array.isArray(product.categories[cg]) && product.categories[cg].includes(subcategory)) return true
        }
        return false
      })
      setPickModalProducts(matched)
    } catch (err) {
      console.error("Failed to load products for pick modal:", err)
      setPickModalProducts([])
    } finally {
      setIsPickLoading(false)
    }
  }

  const setFeaturedForSubcategory = async (categoryId, subcategory, productId) => {
    try {
      console.log("[v0] Setting featured product:", {
        categoryId,
        subcategory,
        productId,
        url: `${serverUrl}/api/v1/categories/${categoryId}/subcategory/feature`,
      })

      const LoginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || " "

      const response = await axios.post(
        `${serverUrl}/api/v1/categories/${categoryId}/subcategory/feature`,
        { subcategory, productId },
        { headers: { authorization: `Bearer ${LoginToken}` } },
      )

      console.log("[v0] Featured product set successfully:", response.data)
      toast.success("Featured product set")
      setIsPickModalOpen(false)
      await fetchCategories()
    } catch (err) {
      console.error("[v0] Failed to set featured product:", {
        error: err,
        message: err?.message,
        response: err?.response?.data,
        status: err?.response?.status,
        url: err?.config?.url,
      })
      toast.error(err?.response?.data?.message || "Failed to set featured product")
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const addCategoryGroup = async () => {
    if (!newCategoryGroup.trim()) {
      toast.error("Please enter a category group name")
      return
    }

    if (categories.find((cat) => cat.name === newCategoryGroup)) {
      toast.error("Category group already exists")
      return
    }

    try {
      const LoginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || " "

      console.log("[v0] Adding category group:", newCategoryGroup)

      const response = await axios.post(
        `${serverUrl}/api/v1/categories`,
        { name: newCategoryGroup, subcategories: [] },
        {
          headers: {
            authorization: `Bearer ${LoginToken}`,
          },
        },
      )

      console.log("[v0] Category group added:", response.data)

      await fetchCategories()
      setNewCategoryGroup("")
      toast.success("Category group added successfully")
    } catch (error) {
      console.error("[v0] Failed to add category group:", error)
      console.error("[v0] Error response:", error.response?.data)
      toast.error(error.response?.data?.message || "Failed to add category group")
    }
  }

  const addCategoryValue = async () => {
    if (!selectedGroup) {
      toast.error("Please select a category group")
      return
    }

    if (!newCategoryValue.trim()) {
      toast.error("Please enter a category value")
      return
    }

    const category = categories.find((cat) => cat.name === selectedGroup)
    if (!category) {
      toast.error("Category group not found")
      return
    }

    if (category.subcategories?.includes(newCategoryValue)) {
      toast.error("Category value already exists in this group")
      return
    }

    try {
      const LoginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || " "

      console.log("[v0] Adding subcategory:", newCategoryValue, "to category:", category._id)

      await axios.post(
        `${serverUrl}/api/v1/categories/${category._id}/subcategory/add`,
        { subcategory: newCategoryValue },
        {
          headers: {
            authorization: `Bearer ${LoginToken}`,
          },
        },
      )

      await fetchCategories()
      setNewCategoryValue("")
      toast.success("Category value added successfully")
    } catch (error) {
      console.error("[v0] Failed to add category value:", error)
      console.error("[v0] Error response:", error.response?.data)
      toast.error(error.response?.data?.message || "Failed to add category value")
    }
  }

  const removeCategoryValue = async (categoryName, value) => {
    try {
      const LoginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || " "

      const category = categories.find((cat) => cat.name === categoryName)
      if (!category) {
        toast.error("Category not found")
        return
      }

      await axios.post(
        `${serverUrl}/api/v1/categories/${category._id}/subcategory/remove`,
        { subcategory: value },
        {
          headers: {
            authorization: `Bearer ${LoginToken}`,
          },
        },
      )

      await fetchCategories()
      toast.success("Category value removed successfully")
    } catch (error) {
      console.error("[v0] Failed to remove category value:", error)
      toast.error(error.response?.data?.message || "Failed to remove category value")
    }
  }

  const removeCategoryGroup = async (categoryName) => {
    try {
      const LoginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || " "

      const category = categories.find((cat) => cat.name === categoryName)
      if (!category) {
        toast.error("Category not found")
        return
      }

      await axios.delete(`${serverUrl}/api/v1/categories/${category._id}`, {
        headers: {
          authorization: `Bearer ${LoginToken}`,
        },
      })

      await fetchCategories()
      toast.success("Category group removed successfully")
    } catch (error) {
      console.error("[v0] Failed to remove category group:", error)
      toast.error(error.response?.data?.message || "Failed to remove category group")
    }
  }

  if (isLoading) {
    return (
      <div className="w-[92%] mx-auto mb-8">
        <h2 className="text-2xl font-bold mb-6">Loading categories...</h2>
      </div>
    )
  }

  return (
    <div className="w-[92%] mx-auto mb-8">
      <h2 className="text-2xl font-bold mb-4">Category Management</h2>

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
        <p className="text-sm text-gray-700">
          <strong>Debug Info:</strong> Currently {categories.length} category groups in database
        </p>
      </div>

      {/* Add Category Group */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <h3 className="text-xl font-semibold mb-4">Add Category Group</h3>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Enter category group name (e.g., 'Room Type', 'Style')"
            value={newCategoryGroup}
            onChange={(e) => setNewCategoryGroup(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-lg"
          />
          <button
            onClick={addCategoryGroup}
            className="bg-primaryColor text-white px-6 py-2 rounded-lg hover:bg-opacity-90"
          >
            Add Group
          </button>
        </div>
      </div>

      {/* Add Category Value */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <h3 className="text-xl font-semibold mb-4">Add Category Value</h3>
        <div className="flex gap-4 mb-4">
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select a category group</option>
            {categories.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Enter category value (e.g., 'Bedroom', 'Modern')"
            value={newCategoryValue}
            onChange={(e) => setNewCategoryValue(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-lg"
          />
          <button
            onClick={addCategoryValue}
            className="bg-primaryColor text-white px-6 py-2 rounded-lg hover:bg-opacity-90"
            disabled={!selectedGroup}
          >
            Add Value
          </button>
        </div>
      </div>

      {/* Display Categories */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Current Categories</h3>
        {categories.length === 0 ? (
          <p className="text-gray-500">No categories yet. Add your first category group above.</p>
        ) : (
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-lg font-semibold">{category.name}</h4>
                  <button
                    onClick={() => removeCategoryGroup(category.name)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <AiOutlineClose className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {!category.subcategories || category.subcategories.length === 0 ? (
                    <span className="text-gray-400 text-sm">No values in this group</span>
                  ) : (
                    category.subcategories.map((value) => {
                      const featuredId = category.featuredProducts
                        ? category.featuredProducts[value] || category.featuredProducts.get?.(value)
                        : null
                      return (
                        <div key={value} className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2 text-sm">
                          <span className="font-medium">{value}</span>
                          {featuredId && (
                            <span className="text-xs text-gray-600 ml-2">
                              (featured: {String(featuredId).slice(0, 8)})
                            </span>
                          )}
                          <button
                            onClick={() => removeCategoryValue(category.name, value)}
                            className="text-red-500 hover:text-red-700 ml-2"
                          >
                            <AiOutlineClose className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openPickModal(category, value)}
                            className="ml-2 text-primaryColor hover:underline text-sm"
                          >
                            Pick product
                          </button>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Pick product modal */}
      {isPickModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsPickModalOpen(false)} />
          <div className="bg-white rounded-lg p-4 shadow-lg z-50 w-[90%] max-w-3xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Pick product for "{pickModalSubcategory}"</h3>
              <button onClick={() => setIsPickModalOpen(false)} className="text-gray-600">
                Close
              </button>
            </div>
            {isPickLoading ? (
              <div>Loading products...</div>
            ) : pickModalProducts.length === 0 ? (
              <div className="text-gray-500">No products found for this subcategory.</div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-auto">
                {pickModalProducts.map((p) => (
                  <div key={p._id} className="flex items-center justify-between border-b py-2">
                    <div>
                      <div className="font-medium">{p.title}</div>
                      <div className="text-xs text-gray-500">id: {String(p._id).slice(0, 12)}</div>
                    </div>
                    <div>
                      <button
                        className="bg-primaryColor text-white px-3 py-1 rounded"
                        onClick={() => setFeaturedForSubcategory(pickModalCategory._id, pickModalSubcategory, p._id)}
                      >
                        Set Featured
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
