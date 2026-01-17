"use client"

import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { FaUsers, FaShoppingCart, FaDollarSign, FaUserCheck } from "react-icons/fa"

export const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedUsers: 0,
    totalOrders: 0,
    totalSales: 0,
    recentUsers: [],
  })
  const [loading, setLoading] = useState(true)

  const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000"

  const fetchDashboardStats = useCallback(async () => {
    try {
      const LoginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || ""
      const { data } = await axios.get(`${serverUrl}/api/v1/user/admin/dashboard-stats`, {
        headers: {
          authorization: `Bearer ${LoginToken}`,
        },
      })

      setStats(data)
      setLoading(false)
    } catch (error) {
      toast.error("Failed to fetch dashboard statistics")
      setLoading(false)
    }
  }, [serverUrl])

  useEffect(() => {
    fetchDashboardStats()
  }, [fetchDashboardStats])

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-secondaryColor">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <section className="w-[100%] xl:px-[4%] px-[4%] lg:px-[2%] ">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 tablet:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-primaryColor text-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <FaUsers className="w-10 h-10 opacity-80" />
              <span className="text-sm font-medium bg-white bg-opacity-20 px-3 py-1 rounded-full">All time</span>
            </div>
            <h3 className="text-lg font-medium mb-2 opacity-90">Total Users</h3>
            <p className="text-4xl font-bold">{stats.totalUsers.toLocaleString()}</p>
          </div>

          <div className="bg-lightPrimaryColor text-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <FaShoppingCart className="w-10 h-10 opacity-80" />
              <span className="text-sm font-medium bg-white bg-opacity-20 px-3 py-1 rounded-full">All time</span>
            </div>
            <h3 className="text-lg font-medium mb-2 opacity-90">Total Orders</h3>
            <p className="text-4xl font-bold">{stats.totalOrders.toLocaleString()}</p>
          </div>

          <div className="bg-darkPrimaryColor text-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <FaDollarSign className="w-10 h-10 opacity-80" />
              <span className="text-sm font-medium bg-white bg-opacity-20 px-3 py-1 rounded-full">All time</span>
            </div>
            <h3 className="text-lg font-medium mb-2 opacity-90">Total Sales</h3>
            <p className="text-4xl font-bold">${stats.totalSales.toFixed(2)}</p>
          </div>

          <div className="bg-secondaryColor text-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <FaUserCheck className="w-10 h-10 opacity-80" />
              <span className="text-sm font-medium bg-white bg-opacity-20 px-3 py-1 rounded-full">All time</span>
            </div>
            <h3 className="text-lg font-medium mb-2 opacity-90">Verified Users</h3>
            <p className="text-4xl font-bold">{stats.verifiedUsers.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="my-12">
        <h2 className="text-black text-2xl font-bold mb-6">Recent Registered Users (Last 30 Days)</h2>
        {stats.recentUsers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-gray-500">No recent users</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full text-left table-collapse">
              <thead>
                <tr className="bg-lightestPrimaryColor">
                  <th className="text-sm font-semibold text-secondaryColor p-4 border-b-2 border-lighterPrimaryColor">
                    Name
                  </th>
                  <th className="text-sm font-semibold text-secondaryColor p-4 border-b-2 border-lighterPrimaryColor">
                    Email
                  </th>
                  <th className="text-sm font-semibold text-secondaryColor p-4 border-b-2 border-lighterPrimaryColor">
                    Registration Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.recentUsers.map((user, index) => (
                  <tr key={user._id} className={index % 2 === 0 ? "bg-white" : "bg-lightestPrimaryColor"}>
                    <td className="p-4 border-t border-lighterPrimaryColor font-medium">{user.username}</td>
                    <td className="p-4 border-t border-lighterPrimaryColor text-gray-600">{user.email}</td>
                    <td className="p-4 border-t border-lighterPrimaryColor text-gray-600">
                      {formatDate(user.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
