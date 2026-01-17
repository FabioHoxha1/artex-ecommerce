"use client"

import { useEffect, useState, useCallback } from "react"
import { IoAddOutline } from "react-icons/io5"
import { AddNewProduct } from "./addNewProduct"
import { SingleProductTableCell } from "./singleProductTableCell"
import axios from "axios"
import { PaginationSectionForProductsAdminPage } from "./paginationForProductsAdmin"

export const ProductManagement = () => {
  const [isAddNewProductClicked, setIsAddNewProductClicked] = useState(false)
  const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000"

  const [lowStockProductsParams, setLowStockProductsParams] = useState({
    lowStockProducts: [],
    productsLength: 0,
    pageNo: 1,
    perPage: 20,
    isError: false,
  })
  const [getLowStockProductsLoader, setLowStockProductsLoader] = useState(false)

  // default search parameters: 20 items per page, start at page 1
  const [searchParameters, setSearchParameters] = useState({ searchedProductName: "", pageNo: 1, perPage: 20 })
  const [searchedProductDataAdminPage, setSearchedProductDataAdminPage] = useState({
    productsSearchedFor: [],
    productsLength: 0,
  })
  const [closeSearchList, setCloseSearchList] = useState(true)
  const [isSearchLoading, setIsSearchLoading] = useState(false)
  const { productsSearchedFor, productsLength } = searchedProductDataAdminPage

  const fetchLowStockProducts = useCallback(async (lowStockProductsParams) => {
    const { pageNo, perPage } = lowStockProductsParams
    setLowStockProductsLoader(true)

    try {
      const {
        data: { products, productsLength },
      } = await axios.get(`${serverUrl}/api/v1/products/sortByLowStockProducts`, {
        params: {
          pageNo: pageNo,
          perPage: perPage,
        },
      })

      setLowStockProductsParams((prevData) => {
        return { ...prevData, lowStockProducts: products, productsLength }
      })
      setLowStockProductsLoader(false)
    } catch (error) {
      setLowStockProductsParams((prevData) => {
        return { ...prevData, isError: true }
      })
      setLowStockProductsLoader(false)
    }
  }, [serverUrl])

  // Only re-fetch when the pagination parameters change (pageNo or perPage).
  // Previously the effect depended on the whole `lowStockProductsParams` object
  // which is updated with fetched results and caused a re-render loop.
  useEffect(() => {
    fetchLowStockProducts({ pageNo: lowStockProductsParams.pageNo, perPage: lowStockProductsParams.perPage })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchLowStockProducts, lowStockProductsParams.pageNo, lowStockProductsParams.perPage])

  const searchProductFetch = async (searchParameters) => {
    const { searchedProductName, pageNo, perPage } = searchParameters
    setCloseSearchList(false)
    setIsSearchLoading(true)
    try {
      const {
        data: { product, productsLength },
      } = await axios.get(`${serverUrl}/api/v1/products/searchProducts`, {
        params: {
          title: searchedProductName,
          pageNo: pageNo,
          perPage: perPage,
        },
      })

      setSearchedProductDataAdminPage({ productsSearchedFor: product, productsLength })

      setIsSearchLoading(false)
      return product
    } catch (error) {
      setSearchedProductDataAdminPage({ productsSearchedFor: [], productsLength: 0 })
      setIsSearchLoading(false)
    }
  }

  return (
    <section className="w-[100%] xl:px-[4%] tablet:px-[6%] px-[3%] xs:px-[4%] lg:px-[2%] pb-8">
      <AddNewProduct {...{ isAddNewProductClicked, setIsAddNewProductClicked }} />
      <div className="container mx-auto">
        <div className="flex rounded-lg items-center justify-between bg-primaryColor text-white shadow-lg w-full p-3 xs:p-4 hover:shadow-xl transition-shadow">
          <h2 className="text-base xs:text-lg md:text-xl font-semibold">Add New Product</h2>
          <IoAddOutline
            className="w-8 h-8 xs:w-10 xs:h-10 bg-white text-primaryColor rounded-full p-1.5 xs:p-2 cursor-pointer hover:scale-110 transition-transform"
            onClick={() => setIsAddNewProductClicked(true)}
          />
        </div>
      </div>

      <div className="my-6 xs:my-8">
        <div className="flex justify-between items-start flex-wrap gap-2">
          <h2 className="text-black text-lg xs:text-xl md:text-2xl font-bold mb-3">Products</h2>
          {!closeSearchList && (
            <span
              className="text-primaryColor font-medium hover:text-darkPrimaryColor cursor-pointer transition-colors text-sm xs:text-base"
              onClick={() => {
                setCloseSearchList(true)
                setSearchParameters({ ...searchParameters, searchedProductName: "" })
              }}
            >
              Close Search List
            </span>
          )}
        </div>

        <div className="flex flex-col xs:flex-row items-stretch xs:items-center mb-4 shadow-md rounded-lg overflow-hidden">
          <input
            type="text"
            id="search-input"
            className="flex-1 py-2.5 xs:py-3 px-3 xs:px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primaryColor text-sm xs:text-base"
            placeholder="Search products by name..."
            value={searchParameters.searchedProductName}
            onChange={(e) => setSearchParameters({ ...searchParameters, searchedProductName: e.target.value })}
            required
          />
          <button
            id="search-button"
            className="bg-primaryColor hover:bg-darkPrimaryColor text-white font-semibold py-2.5 xs:py-3 px-4 xs:px-6 transition-colors text-sm xs:text-base"
            onClick={() => searchProductFetch(searchParameters)}
          >
            Search
          </button>
        </div>
        {!closeSearchList && (
          <>
            <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
              <table className="w-full text-left table-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-lightestPrimaryColor">
                    <th className="text-xs xs:text-sm font-semibold text-secondaryColor p-2 border-b-2 border-lighterPrimaryColor">
                      ID
                    </th>
                    <th className="text-xs xs:text-sm font-semibold text-secondaryColor p-2 border-b-2 border-lighterPrimaryColor">
                      Image
                    </th>
                    <th className="text-xs xs:text-sm font-semibold text-secondaryColor p-2 border-b-2 border-lighterPrimaryColor">
                      Name
                    </th>
                    <th className="text-xs xs:text-sm font-semibold text-secondaryColor p-2 border-b-2 border-lighterPrimaryColor">
                      Price
                    </th>
                    <th className="text-xs xs:text-sm font-semibold text-secondaryColor p-2 border-b-2 border-lighterPrimaryColor">
                      Stock
                    </th>
                    <th className="text-xs xs:text-sm font-semibold text-secondaryColor p-2 border-b-2 border-lighterPrimaryColor">
                      Actions
                    </th>
                  </tr>
                </thead>
                {isSearchLoading ? (
                  <tbody>
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-gray-500">
                        Loading ...
                      </td>
                    </tr>
                  </tbody>
                ) : productsLength > 0 ? (
                  <tbody>
                    {productsSearchedFor.map((products) => {
                      return <SingleProductTableCell {...{ products }} key={products._id} />
                    })}{" "}
                  </tbody>
                ) : (
                  <tbody>
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-gray-500">
                        Products not found
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </div>

            {productsLength > 0 && (
              <PaginationSectionForProductsAdminPage
                productsLength={productsLength}
                asyncFnParamState={searchParameters}
                asyncFn={searchProductFetch}
                setAsyncFnParamState={setSearchParameters}
              />
            )}
          </>
        )}
      </div>

      <section>
        <h3 className="text-black text-lg xs:text-xl md:text-2xl font-bold mb-4">
          Low Stock Products (Sorted by Stock Level)
        </h3>
        <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
          <table className="w-full text-left table-collapse min-w-[600px]">
            <thead>
              <tr className="bg-lightestPrimaryColor">
                <th className="text-xs xs:text-sm font-semibold text-secondaryColor p-2 border-b-2 border-lighterPrimaryColor">
                  ID
                </th>
                <th className="text-xs xs:text-sm font-semibold text-secondaryColor p-2 border-b-2 border-lighterPrimaryColor">
                  Image
                </th>
                <th className="text-xs xs:text-sm font-semibold text-secondaryColor p-2 border-b-2 border-lighterPrimaryColor">
                  Name
                </th>
                <th className="text-xs xs:text-sm font-semibold text-secondaryColor p-2 border-b-2 border-lighterPrimaryColor">
                  Price
                </th>
                <th className="text-xs xs:text-sm font-semibold text-secondaryColor p-2 border-b-2 border-lighterPrimaryColor">
                  Stock
                </th>
                <th className="text-xs xs:text-sm font-semibold text-secondaryColor p-2 border-b-2 border-lighterPrimaryColor">
                  Actions
                </th>
              </tr>
            </thead>
            {getLowStockProductsLoader ? (
              <tbody>
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500 text-base xs:text-lg">
                    Loading ...
                  </td>
                </tr>
              </tbody>
            ) : lowStockProductsParams.productsLength > 0 ? (
              <tbody>
                {lowStockProductsParams.lowStockProducts.map((products) => {
                  return <SingleProductTableCell {...{ products }} key={products._id} />
                })}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500 text-base xs:text-lg">
                    {lowStockProductsParams.isError ? (
                      <span>
                        Error loading products{" "}
                        <span
                          className="text-primaryColor cursor-pointer ml-2 hover:text-darkPrimaryColor font-semibold"
                          onClick={() => fetchLowStockProducts(lowStockProductsParams)}
                        >
                          {" "}
                          Retry
                        </span>
                      </span>
                    ) : (
                      "Products not found"
                    )}
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
        {lowStockProductsParams.productsLength > 0 && (
          <PaginationSectionForProductsAdminPage
            productsLength={lowStockProductsParams.productsLength}
            asyncFnParamState={lowStockProductsParams}
            asyncFn={fetchLowStockProducts}
            setAsyncFnParamState={setLowStockProductsParams}
          />
        )}
      </section>
    </section>
  )
}
