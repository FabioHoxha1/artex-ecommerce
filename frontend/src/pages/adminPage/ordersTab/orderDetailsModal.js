"use client"

import { useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { AiOutlineClose } from "react-icons/ai"

export const OrderDetailsModal = ({ order, isOpen, onClose, onUpdate }) => {
  const [deliveryStatus, setDeliveryStatus] = useState(order.deliveryStatus)
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus)
  const [updating, setUpdating] = useState(false)

  const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000"

  const getImageUrl = (image) => {
    if (!image) return "/placeholder.svg"
    if (typeof image === "object") {
      const preferred = image[640] || image[1024] || image.orig || Object.values(image)[0]
      if (!preferred) return "/placeholder.svg"
      if (preferred.startsWith("http") || preferred.startsWith("data:")) return preferred
      return `${serverUrl}${preferred}`
    }
    if (image.startsWith("data:image")) return image
    if (image.startsWith("http")) return image
    return `${serverUrl}${image}`
  }

  const handleUpdateStatus = async () => {
    setUpdating(true)
    try {
      const LoginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || ""
      await axios.patch(
        `${serverUrl}/api/v1/orders/admin/orders/${order.userId}/${order.orderId}`,
        {
          deliveryStatus,
          paymentStatus,
        },
        {
          headers: {
            authorization: `Bearer ${LoginToken}`,
          },
        },
      )

      toast.success("Order status updated successfully")
      onUpdate()
      onClose()
    } catch (error) {
      toast.error("Failed to update order status")
    } finally {
      setUpdating(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Order Details</h2>
            <AiOutlineClose className="w-6 h-6 cursor-pointer hover:text-gray-600" onClick={onClose} />
          </div>

          {/* Customer Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p>
                <span className="font-medium">Name:</span> {order.username}
              </p>
              <p>
                <span className="font-medium">Email:</span> {order.userEmail}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {order.phoneNumber || "N/A"}
              </p>
              <p>
                <span className="font-medium">Address:</span> {order.address}
              </p>
              <p>
                <span className="font-medium">City:</span> {order.city}
              </p>
              <p>
                <span className="font-medium">Country:</span> {order.country}
              </p>
              <p>
                <span className="font-medium">Postal Code:</span> {order.postalCode}
              </p>
              <p>
                <span className="font-medium">Shipping Method:</span> {order.shippingMethod}
              </p>
            </div>
          </div>

          {/* Products */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Products</h3>
            <div className="space-y-2">
              {order.products?.map((product, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg flex items-center gap-4">
                  <img
                    src={getImageUrl(product.image) || "/placeholder.svg"}
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg"
                    }}
                  />
                  <div className="flex-1">
                    <p className="font-medium">{product.title}</p>
                    <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                    <p className="text-sm text-gray-600">Price: ${product.price?.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${(product.price * product.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span>Order ID:</span>
                <span className="font-medium">{order.orderId}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Date:</span>
                <span className="font-medium">{new Date(order.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                <span>Total Amount:</span>
                <span>${order.totalAmount?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Status Update */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Update Status</h3>
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-2">Delivery Status</label>
                <select
                  value={deliveryStatus}
                  onChange={(e) => setDeliveryStatus(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="pending">Pending</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block font-medium mb-2">Payment Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={updating}
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateStatus}
              className="px-6 py-2 bg-primaryColor text-white rounded-lg hover:bg-darkPrimaryColor disabled:opacity-50"
              disabled={updating}
            >
              {updating ? "Updating..." : "Update Status"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
