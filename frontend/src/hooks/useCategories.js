import { useEffect, useState, useRef } from "react"
import axios from "axios"

// Very small client-side cache to avoid firing many identical requests
let categoriesCache = null
let rawCategoriesCache = null
let fetchPromise = null

const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000"

export function useCategories() {
  const [categories, setCategories] = useState(categoriesCache || {})
  const [rawCategories, setRawCategories] = useState(rawCategoriesCache || [])
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    // If we already have cached categories, use them
    if (categoriesCache) {
      setCategories(categoriesCache)
      return () => {
        isMounted.current = false
      }
    }

    // If a fetch is already in-flight, reuse it
    if (!fetchPromise) {
      fetchPromise = axios
        .get(`${serverUrl}/api/v1/categories`)
        .then((res) => {
          const payload = res?.data?.categories || {}
          const raw = res?.data?.rawCategories || []
          categoriesCache = payload
          rawCategoriesCache = raw
          return { payload, raw }
        })
        .catch((err) => {
          // surface a compact error for callers
          const msg = err?.response?.data?.message || err.message || String(err)
          console.error("useCategories: fetch failed ->", msg)
          categoriesCache = {}
          rawCategoriesCache = []
          return { payload: {}, raw: [] }
        })
        .finally(() => {
          fetchPromise = null
        })
    }

    // apply the result of the promise
    fetchPromise.then((result) => {
      if (!result) return
      const { payload, raw } = result
      if (isMounted.current) {
        setCategories(payload)
        setRawCategories(raw)
      }
    })

    return () => {
      isMounted.current = false
    }
  }, [])

  // expose a refresh function that refetches and replaces the cache
  const refresh = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/v1/categories`)
      const payload = res?.data?.categories || {}
      const raw = res?.data?.rawCategories || []
      categoriesCache = payload
      rawCategoriesCache = raw
      setCategories(payload)
      setRawCategories(raw)
      return { payload, raw }
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || String(err)
      console.error("useCategories.refresh: fetch failed ->", msg)
      categoriesCache = {}
      setCategories({})
      throw err
    }
  }

  return { categories, rawCategories, refresh }
}
