"use client"

import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { toast } from "react-toastify"

export const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")

  const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000"

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const LoginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || ""
      const { data } = await axios.get(`${serverUrl}/api/v1/admin/all-users?pageNo=${currentPage}&perPage=10`, {
        headers: {
          authorization: `Bearer ${LoginToken}`,
        },
      })

      setUsers(data.users || [])
      setTotalPages(data.totalPages || 1)
      setLoading(false)
    } catch (error) {
      toast.error("Failed to fetch users")
      setLoading(false)
    }
  }, [currentPage, serverUrl])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusBadge = (status) => {
    const statusColors = {
      verified: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      rejected: "bg-red-100 text-red-800",
    }
    return statusColors[status] || "bg-gray-100 text-gray-800"
  }

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading users...</div>
      </div>
    )
  }

  return (
    <section className="w-full px-4 lg:px-8">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">User Management</h2>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryColor focus:border-transparent"
            />
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No users found</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-4 font-medium text-gray-600">Username</th>
                    <th className="p-4 font-medium text-gray-600">Email</th>
                    <th className="p-4 font-medium text-gray-600">Status</th>
                    <th className="p-4 font-medium text-gray-600">Orders</th>
                    <th className="p-4 font-medium text-gray-600">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="p-4 font-medium">{user.username}</td>
                      <td className="p-4 text-sm">{user.email}</td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(user.verificationStatus)}`}
                        >
                          {user.verificationStatus}
                        </span>
                      </td>
                      <td className="p-4">{user.orders?.length || 0}</td>
                      <td className="p-4 text-sm">{formatDate(user.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
