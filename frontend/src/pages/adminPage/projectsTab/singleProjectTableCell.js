"use client"

import { useState } from "react"
import { FiEdit2, FiTrash2, FiStar } from "react-icons/fi"
import { DeleteProjectModal } from "./deleteProjectModal"
import { EditProjectModal } from "./editProjectModal"

export const SingleProjectTableCell = ({ project, onProjectDeleted, onProjectUpdated }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000"

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder.svg"
    if (imagePath.startsWith("http")) return imagePath
    return `${serverUrl}${imagePath}`
  }

  return (
    <>
      <tr className="hover:bg-gray-50 border-b border-gray-200">
        <td className="p-2">
          <div className="w-16 h-16 xs:w-20 xs:h-20 rounded-lg overflow-hidden bg-gray-100">
            <img
              src={getImageUrl(project.images?.[0]) || "/placeholder.svg"}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        </td>
        <td className="p-2">
          <span className="text-sm xs:text-base font-medium text-gray-800">{project.title}</span>
        </td>
        <td className="p-2">
          <span className="text-sm xs:text-base text-gray-600">{project.client || "-"}</span>
        </td>
        <td className="p-2">
          <span className="text-sm xs:text-base text-gray-600">{project.location || "-"}</span>
        </td>
        <td className="p-2">
          {project.featured ? (
            <FiStar className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          ) : (
            <FiStar className="w-5 h-5 text-gray-300" />
          )}
        </td>
        <td className="p-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit"
            >
              <FiEdit2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <FiTrash2 className="w-5 h-5" />
            </button>
          </div>
        </td>
      </tr>

      {isDeleteModalOpen && (
        <DeleteProjectModal
          project={project}
          onClose={() => setIsDeleteModalOpen(false)}
          onDeleted={onProjectDeleted}
        />
      )}

      {isEditModalOpen && (
        <EditProjectModal
          project={project}
          onClose={() => setIsEditModalOpen(false)}
          onUpdated={onProjectUpdated}
        />
      )}
    </>
  )
}