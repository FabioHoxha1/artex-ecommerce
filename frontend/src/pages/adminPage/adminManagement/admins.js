"use client"

import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { IoAddOutline, IoRemoveOutline } from "react-icons/io5"

export const AdminManagement = () => {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)

  const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000"

  const fetchAdmins = useCallback(async () => {
    try {
      const LoginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || ""
      const { data } = await axios.get(`${serverUrl}/api/v1/admin/all-admins`, {
        headers: {
          authorization: `Bearer ${LoginToken}`,
        },
      })

      setAdmins(data.admins || [])
      setLoading(false)
    } catch (error) {
      toast.error("Failed to fetch admins")
      setLoading(false)
    }
  }, [serverUrl])

  useEffect(() => {
    fetchAdmins()
  }, [fetchAdmins])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading admins...</div>
      </div>
    )
  }

  return (
    <section className="w-[100%] xl:px-[4%] tablet:px-[6%] px-[4%] lg:px-[2%] ">
      <div className="container mx-auto">
        <div className="mb-8 gap-4 flex flex-wrap">
          <button className="flex rounded-lg justify-between items-center bg-primaryColor hover:bg-darkPrimaryColor text-white px-6 py-4 transition-colors shadow-md">
            <span className="font-medium mr-3">Add New Admin</span>
            <IoAddOutline className="w-6 h-6" />
          </button>
          <button className="flex rounded-lg justify-between items-center bg-red-500 hover:bg-red-600 text-white px-6 py-4 transition-colors shadow-md">
            <span className="font-medium mr-3">Remove Admin Status</span>
            <IoRemoveOutline className="w-6 h-6" />
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-6">Admin Users</h2>

        {admins.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No admin users found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {admins.map((admin) => (
              <div key={admin._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">{admin.email}</p>
                  <p className="text-2xl font-bold text-gray-900">{admin.username}</p>
                  <p className="text-primaryColor mt-3 font-medium">Admin User</p>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Status: <span className="font-medium text-green-600">Active</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Recent Admin Activity</h2>
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">Activity log coming soon</p>
          </div>
        </div>
      </div>
    </section>
  )
}
