"use client"

import { useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { AiOutlineClose } from "react-icons/ai"

export const DeleteProjectModal = ({ project, onClose, onDeleted }) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000"

  const handleDelete = async () => {
    setIsDeleting(true)
    const toastId = toast.loading("Deleting project...")

    try {
      const userData = localStorage.getItem("UserData")
      if (!userData) {
        throw new Error("Please login first")
      }
      const parsedUserData = JSON.parse(userData)
      const LoginToken = parsedUserData?.loginToken

      if (!LoginToken) {
        throw new Error("Login token not found. Please login again.")
      }

      await axios.delete(`${serverUrl}/api/v1/projects/${project._id}`, {
        headers: {
          authorization: `Bearer ${LoginToken}`,
        },
      })

      toast.update(toastId, {
        render: "Project deleted successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      })

      onDeleted(project._id)
      onClose()
    } catch (error) {
      const errMessage = error.response?.data?.message || error.message
      toast.update(toastId, {
        render: `${errMessage}: Failed to delete project`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[3000]">
      <div className="fixed inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-md relative z-10 shadow-xl">
        <AiOutlineClose
          className="w-6 h-6 fill-gray-500 absolute right-4 top-4 cursor-pointer hover:opacity-70"
          onClick={onClose}
        />
        <h2 className="text-xl font-bold mb-4 text-gray-800">Delete Project</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete <strong>"{project.title}"</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  )
}