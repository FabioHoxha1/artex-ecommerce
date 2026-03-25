"use client"

import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { toast } from "react-toastify"

export const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000"

  const fetchUserOrders = useCallback(async () => {
    setLoading(true)
    try {
      const LoginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || ""

      if (!LoginToken) {
        toast.error("Please log in to view your quote requests")
        setLoading(false)
        return
      }

      const { data } = await axios.get(`${serverUrl}/api/v1/user/profile`, {
        headers: {
          authorization: `Bearer ${LoginToken}`,
        },
      })

      setOrders((data.user.orders || []).reverse())
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch quote requests:", error)
      toast.error("Failed to fetch quote requests")
      setLoading(false)
    }
  }, [serverUrl])

  useEffect(() => {
    fetchUserOrders()
  }, [fetchUserOrders])

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
      case "quote_requested":
        return "bg-yellow-100 text-yellow-800"
      case "delivered":
      case "quote_sent":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "quote":
      case "in_review":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case "quote_requested":
        return "Quote Requested"
      case "quote_sent":
        return "Quote Sent"
      case "in_review":
        return "In Review"
      case "quote":
        return "Awaiting Quote"
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading your quote requests...</div>
      </div>
    )
  }

  return (
    <div className="w-full px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">My Quote Requests</h2>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">You haven't submitted any quote requests yet</p>
          <a href="/shop" className="text-[#fca311] hover:underline font-medium">
            Browse Products
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <div key={order._id || index} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500">Request Date</p>
                  <p className="font-medium">{formatDate(order.date)}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.deliveryStatus)}`}
                  >
                    {getStatusLabel(order.deliveryStatus)}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="font-medium mb-3">Products:</p>
                <div className="space-y-3">
                  {order.products?.map((product, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <img
                        src={
                          product.image && product.image.startsWith("/uploads/")
                            ? `${serverUrl}${product.image}`
                            : product.image || "/placeholder.svg"
                        }
                        alt={product.title || "Product"}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          e.target.src = "/placeholder.svg"
                        }}
                      />
                      <div className="flex-1">
                        <p className="font-medium">{product.title || "Unknown Product"}</p>
                        <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t mt-4 pt-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Delivery Address:</span> {order.address}, {order.city}, {order.country}{" "}
                  - {order.postalCode}
                </p>
                {order.phoneNumber && (
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Phone:</span> {order.phoneNumber}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}