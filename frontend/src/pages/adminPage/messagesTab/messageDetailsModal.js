"use client"

import { IoCloseOutline } from "react-icons/io5"
import { FaEnvelope, FaUser, FaClock, FaReply, FaTrash, FaCheck } from "react-icons/fa"

export const MessageDetailsModal = ({ message, onClose, onUpdateStatus, onDelete }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status) => {
    const styles = {
      unread: "bg-red-100 text-red-800",
      read: "bg-blue-100 text-blue-800",
      replied: "bg-green-100 text-green-800",
    }
    return styles[status] || "bg-gray-100 text-gray-800"
  }

  const handleReplyViaEmail = () => {
    const subject = encodeURIComponent(`Re: Message from ${message.name}`)
    const body = encodeURIComponent(`\n\n---\nOriginal message from ${message.name}:\n${message.message}`)
    window.open(`mailto:${message.email}?subject=${subject}&body=${body}`, "_blank")
    onUpdateStatus(message._id, "replied")
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[2000] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-primaryColor text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <IoCloseOutline className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold mb-2">Message Details</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(message.status)}`}>
            {message.status}
          </span>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Sender Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <FaUser className="w-5 h-5 text-primaryColor" />
              <div>
                <p className="text-sm text-gray-500">From</p>
                <p className="font-medium">{message.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <FaEnvelope className="w-5 h-5 text-primaryColor" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <a href={`mailto:${message.email}`} className="font-medium text-primaryColor hover:underline">
                  {message.email}
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg mb-6">
            <FaClock className="w-5 h-5 text-primaryColor" />
            <div>
              <p className="text-sm text-gray-500">Received</p>
              <p className="font-medium">{formatDate(message.createdAt)}</p>
            </div>
          </div>

          {/* Message Content */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Message</h3>
            <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap leading-relaxed">
              {message.message}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t p-4 bg-gray-50 flex flex-wrap gap-3 justify-between">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleReplyViaEmail}
              className="flex items-center gap-2 px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-darkPrimaryColor transition-colors"
            >
              <FaReply className="w-4 h-4" />
              Reply via Email
            </button>
            {message.status !== "replied" && (
              <button
                onClick={() => onUpdateStatus(message._id, "replied")}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <FaCheck className="w-4 h-4" />
                Mark as Replied
              </button>
            )}
            {message.status === "unread" && (
              <button
                onClick={() => onUpdateStatus(message._id, "read")}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <FaCheck className="w-4 h-4" />
                Mark as Read
              </button>
            )}
          </div>
          <button
            onClick={() => {
              onDelete(message._id)
              onClose()
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <FaTrash className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}