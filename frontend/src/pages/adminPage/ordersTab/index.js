"use client"

import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { OrderDetailsModal } from "./orderDetailsModal"

export const OrdersTab = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000"

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const LoginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || ""
      const { data } = await axios.get(`${serverUrl}/api/v1/orders/admin/orders?pageNo=${currentPage}&perPage=10`, {
        headers: {
          authorization: `Bearer ${LoginToken}`,
        },
      })

      setOrders(data.orders)
      setTotalPages(data.totalPages)
      setLoading(false)
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch orders")
      setLoading(false)
    }
  }, [currentPage, serverUrl])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleViewDetails = (order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "paid":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-lg text-secondaryColor">Loading orders...</div>
      </div>
    )
  }

  return (
    <section className="w-full px-4 lg:px-8">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-4">Order Management</h2>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-gray-500">No orders found</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-lightestPrimaryColor">
                  <tr>
                    <th className="p-2 font-medium text-secondaryColor">Order ID</th>
                    <th className="p-2 font-medium text-secondaryColor">Customer</th>
                    <th className="p-2 font-medium text-secondaryColor">Email</th>
                    <th className="p-2 font-medium text-secondaryColor">Phone</th>
                    <th className="p-2 font-medium text-secondaryColor">Date</th>
                    <th className="p-2 font-medium text-secondaryColor">Total</th>
                    <th className="p-2 font-medium text-secondaryColor">Delivery Status</th>
                    <th className="p-2 font-medium text-secondaryColor">Payment Status</th>
                    <th className="p-2 font-medium text-secondaryColor">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.orderId}
                      className="border-t border-lighterPrimaryColor hover:bg-lightestPrimaryColor"
                    >
                      <td className="p-2 text-sm">{order.orderId.slice(-8)}</td>
                      <td className="p-2">{order.username}</td>
                      <td className="p-2 text-sm">{order.userEmail}</td>
                      <td className="p-2 text-sm">{order.phoneNumber || "N/A"}</td>
                      <td className="p-2 text-sm">{formatDate(order.date)}</td>
                      <td className="p-2 font-medium">${order.totalAmount?.toFixed(2)}</td>
                      <td className="p-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.deliveryStatus)}`}
                        >
                          {order.deliveryStatus}
                        </span>
                      </td>
                      <td className="p-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.paymentStatus)}`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="p-2">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="text-primaryColor hover:text-darkPrimaryColor font-medium text-sm"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-lighterPrimaryColor rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lightestPrimaryColor"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-lighterPrimaryColor rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lightestPrimaryColor"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {isModalOpen && (
        <OrderDetailsModal
          order={selectedOrder}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedOrder(null)
          }}
          onUpdate={fetchOrders}
        />
      )}
    </section>
  )
}
