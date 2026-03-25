"use client"

import { useEffect, useState, useCallback } from "react"
import { IoAddOutline } from "react-icons/io5"
import { AddNewProject } from "./addNewProject"
import { SingleProjectTableCell } from "./singleProjectTableCell"
import axios from "axios"

export const ProjectsManagement = () => {
  const [isAddNewProjectClicked, setIsAddNewProjectClicked] = useState(false)
  const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000"

  const [projectsData, setProjectsData] = useState({
    projects: [],
    isLoading: false,
    isError: false,
  })

  const fetchProjects = useCallback(async () => {
    setProjectsData((prev) => ({ ...prev, isLoading: true, isError: false }))

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
  }, [serverUrl])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const handleProjectDeleted = (deletedId) => {
    setProjectsData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p._id !== deletedId),
    }))
  }

  return (
    <section className="w-[100%] xl:px-[4%] tablet:px-[6%] px-[3%] xs:px-[4%] lg:px-[2%] pb-8">
      <AddNewProject
        isAddNewProjectClicked={isAddNewProjectClicked}
        setIsAddNewProjectClicked={setIsAddNewProjectClicked}
        onProjectCreated={fetchProjects}
      />
      <div className="container mx-auto">
        <div className="flex rounded-lg items-center justify-between bg-primaryColor text-white shadow-lg w-full p-3 xs:p-4 hover:shadow-xl transition-shadow">
          <h2 className="text-base xs:text-lg md:text-xl font-semibold">Add New Project</h2>
          <IoAddOutline
            className="w-8 h-8 xs:w-10 xs:h-10 bg-white text-primaryColor rounded-full p-1.5 xs:p-2 cursor-pointer hover:scale-110 transition-transform"
            onClick={() => setIsAddNewProjectClicked(true)}
          />
        </div>
      </div>

      <div className="my-6 xs:my-8">
        <h2 className="text-black text-lg xs:text-xl md:text-2xl font-bold mb-3">All Projects</h2>

        <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
          <table className="w-full text-left table-collapse min-w-[600px]">
            <thead>
              <tr className="bg-lightestPrimaryColor">
                <th className="text-xs xs:text-sm font-semibold text-secondaryColor p-2 border-b-2 border-lighterPrimaryColor">
                  Image
                </th>
                <th className="text-xs xs:text-sm font-semibold text-secondaryColor p-2 border-b-2 border-lighterPrimaryColor">
                  Title
                </th>
                <th className="text-xs xs:text-sm font-semibold text-secondaryColor p-2 border-b-2 border-lighterPrimaryColor">
                  Client
                </th>
                <th className="text-xs xs:text-sm font-semibold text-secondaryColor p-2 border-b-2 border-lighterPrimaryColor">
                  Location
                </th>
                <th className="text-xs xs:text-sm font-semibold text-secondaryColor p-2 border-b-2 border-lighterPrimaryColor">
                  Featured
                </th>
                <th className="text-xs xs:text-sm font-semibold text-secondaryColor p-2 border-b-2 border-lighterPrimaryColor">
                  Actions
                </th>
              </tr>
            </thead>
            {projectsData.isLoading ? (
              <tbody>
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500 text-base xs:text-lg">
                    Loading ...
                  </td>
                </tr>
              </tbody>
            ) : projectsData.projects.length > 0 ? (
              <tbody>
                {projectsData.projects.map((project) => (
                  <SingleProjectTableCell
                    key={project._id}
                    project={project}
                    onProjectDeleted={handleProjectDeleted}
                    onProjectUpdated={fetchProjects}
                  />
                ))}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500 text-base xs:text-lg">
                    {projectsData.isError ? (
                      <span>
                        Error loading projects{" "}
                        <span
                          className="text-primaryColor cursor-pointer ml-2 hover:text-darkPrimaryColor font-semibold"
                          onClick={fetchProjects}
                        >
                          Retry
                        </span>
                      </span>
                    ) : (
                      "No projects found. Add your first project!"
                    )}
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>
    </section>
  )
}