"use client"

import { useNavigate } from "react-router-dom"
import { FiMapPin, FiCalendar, FiStar } from "react-icons/fi"

export const ProjectCard = ({ project, featured }) => {
  const navigate = useNavigate()
  const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000"

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder.svg"
    if (imagePath.startsWith("http")) return imagePath
    return `${serverUrl}${imagePath}`
  }

  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  return (
    <div
      className={`group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer ${
        featured ? "ring-2 ring-primaryColor" : ""
      }`}
      onClick={() => navigate(`/project/${project._id}`)}
    >
      <div className="relative overflow-hidden">
        <div className={`${featured ? "h-64" : "h-48"} w-full`}>
          <img
            src={getImageUrl(project.images?.[0]) || "/placeholder.svg"}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        {featured && (
          <div className="absolute top-3 right-3 bg-primaryColor text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <FiStar className="w-4 h-4 fill-white" />
            Featured
          </div>
        )}
        {project.images?.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded text-xs">
            +{project.images.length - 1} photos
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-secondaryColor mb-2 group-hover:text-primaryColor transition-colors line-clamp-2">
          {project.title}
        </h3>

        {project.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{project.description}</p>
        )}

        <div className="flex flex-wrap gap-3 text-sm text-gray-500">
          {project.location && (
            <div className="flex items-center gap-1">
              <FiMapPin className="w-4 h-4" />
              <span>{project.location}</span>
            </div>
          )}
          {project.completionDate && (
            <div className="flex items-center gap-1">
              <FiCalendar className="w-4 h-4" />
              <span>{formatDate(project.completionDate)}</span>
            </div>
          )}
        </div>

        {project.client && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Client: <span className="text-gray-700 font-medium">{project.client}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}