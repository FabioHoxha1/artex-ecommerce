"use client"

import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { FaEnvelope, FaEnvelopeOpen, FaReply, FaTrash } from "react-icons/fa"
import { MessageDetailsModal } from "./messageDetailsModal"

export const MessagesTab = () => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filter, setFilter] = useState("all")
  const [stats, setStats] = useState({ total: 0, unread: 0 })

  const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000"

  const fetchMessages = useCallback(async () => {
    try {
      const LoginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || ""
      const filterParam = filter !== "all" ? `?status=${filter}` : ""
      
      const { data } = await axios.get(`${serverUrl}/api/v1/contact${filterParam}`, {
        headers: {
          authorization: `Bearer ${LoginToken}`,
        },
      })

      setMessages(data.messages)
      setStats({
        total: data.totalMessages,
        unread: data.unreadCount,
      })
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch messages:", error)
      toast.error("Failed to fetch messages")
      setLoading(false)
    }
  }, [serverUrl, filter])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  const updateMessageStatus = async (id, status) => {
    try {
      const LoginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || ""
      
      await axios.patch(
        `${serverUrl}/api/v1/contact/${id}/status`,
        { status },
        {
          headers: {
            authorization: `Bearer ${LoginToken}`,
          },
        }
      )

      // Update local state
      setMessages((prev) =>
        prev.map((msg) => (msg._id === id ? { ...msg, status } : msg))
      )
      
      if (selectedMessage?._id === id) {
        setSelectedMessage((prev) => ({ ...prev, status }))
      }

      // Update unread count
      if (status === "read" || status === "replied") {
        setStats((prev) => ({ ...prev, unread: Math.max(0, prev.unread - 1) }))
      }

      toast.success(`Message marked as ${status}`)
    } catch (error) {
      console.error("Failed to update message status:", error)
      toast.error("Failed to update message status")
    }
  }

  const deleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) {
      return
    }

    try {
      const LoginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || ""
      
      await axios.delete(`${serverUrl}/api/v1/contact/${id}`, {
        headers: {
          authorization: `Bearer ${LoginToken}`,
        },
      })

      setMessages((prev) => prev.filter((msg) => msg._id !== id))
      setStats((prev) => ({ ...prev, total: prev.total - 1 }))
      
      if (selectedMessage?._id === id) {
        setIsModalOpen(false)
        setSelectedMessage(null)
      }

      toast.success("Message deleted successfully")
    } catch (error) {
      console.error("Failed to delete message:", error)
      toast.error("Failed to delete message")
    }
  }

  const openMessage = (message) => {
    setSelectedMessage(message)
    setIsModalOpen(true)
    
    // Mark as read if unread
    if (message.status === "unread") {
      updateMessageStatus(message._id, "read")
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-secondaryColor">Loading messages...</div>
      </div>
    )
  }

  return (
    <section className="w-[100%] xl:px-[4%] px-[4%] lg:px-[2%]">
      <div className="container mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 tablet:grid-cols-2 gap-6 mb-8">
          <div className="bg-primaryColor text-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <FaEnvelope className="w-8 h-8 opacity-80" />
              <div>
                <h3 className="text-lg font-medium opacity-90">Total Messages</h3>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-red-500 text-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <FaEnvelopeOpen className="w-8 h-8 opacity-80" />
              <div>
                <h3 className="text-lg font-medium opacity-90">Unread Messages</h3>
                <p className="text-3xl font-bold">{stats.unread}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {["all", "unread", "read", "replied"].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                filter === filterOption
                  ? "bg-primaryColor text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filterOption}
            </button>
          ))}
        </div>

        {/* Messages List */}
        {messages.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <FaEnvelope className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No messages found</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-lightestPrimaryColor">
                    <th className="text-sm font-semibold text-secondaryColor p-4 border-b-2 border-lighterPrimaryColor">
                      Status
                    </th>
                    <th className="text-sm font-semibold text-secondaryColor p-4 border-b-2 border-lighterPrimaryColor">
                      Name
                    </th>
                    <th className="text-sm font-semibold text-secondaryColor p-4 border-b-2 border-lighterPrimaryColor">
                      Email
                    </th>
                    <th className="text-sm font-semibold text-secondaryColor p-4 border-b-2 border-lighterPrimaryColor hidden md:table-cell">
                      Message Preview
                    </th>
                    <th className="text-sm font-semibold text-secondaryColor p-4 border-b-2 border-lighterPrimaryColor">
                      Date
                    </th>
                    <th className="text-sm font-semibold text-secondaryColor p-4 border-b-2 border-lighterPrimaryColor">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((message, index) => (
                    <tr
                      key={message._id}
                      className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-lightestPrimaryColor"
                      } ${message.status === "unread" ? "font-semibold" : ""}`}
                      onClick={() => openMessage(message)}
                    >
                      <td className="p-4 border-t border-lighterPrimaryColor">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                            message.status
                          )}`}
                        >
                          {message.status}
                        </span>
                      </td>
                      <td className="p-4 border-t border-lighterPrimaryColor">{message.name}</td>
                      <td className="p-4 border-t border-lighterPrimaryColor text-gray-600">
                        {message.email}
                      </td>
                      <td className="p-4 border-t border-lighterPrimaryColor text-gray-600 hidden md:table-cell max-w-[200px] truncate">
                        {message.message.substring(0, 50)}...
                      </td>
                      <td className="p-4 border-t border-lighterPrimaryColor text-gray-600 text-sm">
                        {formatDate(message.createdAt)}
                      </td>
                      <td className="p-4 border-t border-lighterPrimaryColor">
                        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => deleteMessage(message._id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Message Details Modal */}
      {isModalOpen && selectedMessage && (
        <MessageDetailsModal
          message={selectedMessage}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedMessage(null)
          }}
          onUpdateStatus={updateMessageStatus}
          onDelete={deleteMessage}
        />
      )}
    </section>
  )
}