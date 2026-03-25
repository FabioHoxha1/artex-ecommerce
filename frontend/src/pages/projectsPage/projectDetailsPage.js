"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { IoIosArrowBack } from "react-icons/io"
import { FiMapPin, FiCalendar, FiUser, FiChevronLeft, FiChevronRight } from "react-icons/fi"
import FooterSection from "../../components/footerSection"
import axios from "axios"
import { FullpageSpinnerLoader } from "../../components/loaders/spinnerIcon"

export const ProjectDetailsPage = () => {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000"

  const [project, setProject] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await axios.get(`${serverUrl}/api/v1/projects/${projectId}`)
        setProject(data.project)
        setIsLoading(false)
      } catch (err) {
        setError("Project not found")
        setIsLoading(false)
      }
    }

    fetchProject()
  }, [projectId, serverUrl])

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder.svg"
    if (imagePath.startsWith("http")) return imagePath
    return `${serverUrl}${imagePath}`
  }

  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  const nextImage = () => {
    if (project?.images?.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % project.images.length)
    }
  }

  const prevImage = () => {
    if (project?.images?.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length)
    }
  }

  if (isLoading) {
    return <FullpageSpinnerLoader />
  }

  if (error || !project) {
    return (
      <section>
        <div className="mt-4 tablet:px-[6%] w-[100%] h-[54px] bg-neutralColor text-secondaryColor xl:px-[4%] px-[4%] lg:px-[2%] flex items-center font-bold font-RobotoCondensed">
          <div className="flex gap-[4px] items-center text-base">
            <IoIosArrowBack />
            <li onClick={() => navigate("/")} className="hover:underline capitalize cursor-pointer">
              Home
            </li>
            <IoIosArrowBack />
            <li onClick={() => navigate("/projects")} className="hover:underline capitalize cursor-pointer">
              Projects
            </li>
          </div>
        </div>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Project Not Found</h1>
          <p className="text-gray-600 mb-6">The project you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate("/projects")}
            className="bg-primaryColor text-white px-6 py-2 rounded-lg hover:bg-darkPrimaryColor transition-colors"
          >
            View All Projects
          </button>
        </div>
        <FooterSection />
      </section>
    )
  }

  return (
    <section>
      <div className="mt-4 tablet:px-[6%] w-[100%] h-[54px] bg-neutralColor text-secondaryColor xl:px-[4%] px-[4%] lg:px-[2%] flex items-center font-bold font-RobotoCondensed">
        <div className="flex gap-[4px] items-center text-base">
          <IoIosArrowBack />
          <li onClick={() => navigate("/")} className="hover:underline capitalize cursor-pointer">
            Home
          </li>
          <IoIosArrowBack />
          <li onClick={() => navigate("/projects")} className="hover:underline capitalize cursor-pointer">
            Projects
          </li>
          <IoIosArrowBack />
          <span className="truncate max-w-[150px]">{project.title}</span>
        </div>
      </div>

      <div className="w-full mt-8 tablet:px-[6%] xl:px-[4%] px-[4%] lg:px-[2%] pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Image Gallery */}
          <div className="mb-8">
            <div className="relative rounded-xl overflow-hidden bg-gray-100">
              <div className="aspect-[16/9] w-full">
                <img
                  src={getImageUrl(project.images?.[currentImageIndex]) || "/placeholder.svg"}
                  alt={`${project.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {project.images?.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-colors"
                  >
                    <FiChevronLeft className="w-6 h-6 text-gray-800" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-colors"
                  >
                    <FiChevronRight className="w-6 h-6 text-gray-800" />
                  </button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {project.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentImageIndex ? "bg-primaryColor" : "bg-white/70"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Grid */}
            {project.images?.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {project.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex ? "border-primaryColor" : "border-transparent"
                    }`}
                  >
                    <img
                      src={getImageUrl(image) || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Project Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-[28px] md:text-[36px] font-bold text-secondaryColor mb-4">{project.title}</h1>

              {project.description && (
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{project.description}</p>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-xl p-6 sticky top-4">
                <h3 className="font-bold text-lg text-secondaryColor mb-4">Project Details</h3>

                <div className="space-y-4">
                  {project.client && (
                    <div className="flex items-start gap-3">
                      <FiUser className="w-5 h-5 text-primaryColor mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Client</p>
                        <p className="font-medium text-gray-800">{project.client}</p>
                      </div>
                    </div>
                  )}

                  {project.location && (
                    <div className="flex items-start gap-3">
                      <FiMapPin className="w-5 h-5 text-primaryColor mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium text-gray-800">{project.location}</p>
                      </div>
                    </div>
                  )}

                  {project.completionDate && (
                    <div className="flex items-start gap-3">
                      <FiCalendar className="w-5 h-5 text-primaryColor mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Completed</p>
                        <p className="font-medium text-gray-800">{formatDate(project.completionDate)}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => navigate("/contactUs")}
                    className="w-full bg-primaryColor text-white py-3 rounded-lg font-medium hover:bg-darkPrimaryColor transition-colors"
                  >
                    Start Your Project
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FooterSection />
    </section>
  )
}

export default ProjectDetailsPage