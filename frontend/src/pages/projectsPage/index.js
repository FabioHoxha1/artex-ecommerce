"use client"

import { useEffect, useState } from "react"
import { IoIosArrowBack } from "react-icons/io"
import { useNavigate } from "react-router-dom"
import FooterSection from "../../components/footerSection"
import axios from "axios"
import { ProjectCard } from "./projectCard"
import { ProductLoader } from "../../components/loaders/productLoader"

export const ProjectsPage = () => {
  const navigate = useNavigate()
  const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000"

  const [projectsData, setProjectsData] = useState({
    projects: [],
    isLoading: true,
    isError: false,
  })

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await axios.get(`${serverUrl}/api/v1/projects`)
        setProjectsData({
          projects: data.projects,
          isLoading: false,
          isError: false,
        })
      } catch (error) {
        setProjectsData((prev) => ({
          ...prev,
          isLoading: false,
          isError: true,
        }))
      }
    }

    fetchProjects()
  }, [serverUrl])

  const featuredProjects = projectsData.projects.filter((p) => p.featured)
  const regularProjects = projectsData.projects.filter((p) => !p.featured)

  return (
    <section>
      <div className="mt-4 tablet:px-[6%] w-[100%] h-[54px] bg-neutralColor text-secondaryColor xl:px-[4%] px-[4%] lg:px-[2%] flex items-center justify-between font-bold font-RobotoCondensed">
        <div className="flex gap-[4px] items-center text-base">
          <IoIosArrowBack />
          <li onClick={() => navigate("/")} className="hover:underline capitalize cursor-pointer">
            Home
          </li>
          <IoIosArrowBack />
          <li onClick={() => navigate("/shop")} className="hover:underline capitalize cursor-pointer">
            Shop
          </li>
          <IoIosArrowBack />
          <span>Projects</span>
        </div>
      </div>

      <div className="w-full mt-8 tablet:px-[6%] xl:px-[4%] px-[4%] lg:px-[2%]">
        <div className="text-center mb-12">
          <h1 className="text-[28px] md:text-[36px] lg:text-[42px] font-bold text-secondaryColor mb-4">
            Our Projects
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Explore our portfolio of completed furniture projects. Each project showcases our commitment to quality
            craftsmanship and beautiful design tailored to our clients' unique needs.
          </p>
        </div>

        {projectsData.isLoading ? (
          <ProductLoader />
        ) : projectsData.isError ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Failed to load projects. Please try again later.</p>
          </div>
        ) : projectsData.projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No projects available yet. Check back soon!</p>
          </div>
        ) : (
          <>
            {featuredProjects.length > 0 && (
              <div className="mb-12">
                <h2 className="text-[22px] md:text-[28px] font-bold text-secondaryColor mb-6 flex items-center gap-2">
                  <span className="w-8 h-1 bg-primaryColor rounded"></span>
                  Featured Projects
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {featuredProjects.map((project) => (
                    <ProjectCard key={project._id} project={project} featured />
                  ))}
                </div>
              </div>
            )}

            {regularProjects.length > 0 && (
              <div className="mb-12">
                <h2 className="text-[22px] md:text-[28px] font-bold text-secondaryColor mb-6 flex items-center gap-2">
                  <span className="w-8 h-1 bg-primaryColor rounded"></span>
                  All Projects
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {regularProjects.map((project) => (
                    <ProjectCard key={project._id} project={project} />
                  ))}
                </div>
              </div>
            )}

            {featuredProjects.length > 0 && regularProjects.length === 0 && (
              <div className="mb-12">
                <h2 className="text-[22px] md:text-[28px] font-bold text-secondaryColor mb-6 flex items-center gap-2">
                  <span className="w-8 h-1 bg-primaryColor rounded"></span>
                  All Projects
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {featuredProjects.map((project) => (
                    <ProjectCard key={project._id} project={project} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <FooterSection />
    </section>
  )
}

export default ProjectsPage