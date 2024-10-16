import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { MdBookmark } from "react-icons/md";

const Projects = () => {
  const projects = useSelector((state) => state.projects?.projects);
  const searchTerm = useSelector((state) =>
    state.searchTerm?.searchTerm ? state.searchTerm?.searchTerm : ""
  );

  const [filtered, setFiltered] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    if (searchTerm?.length > 0) {
      setFiltered(
        projects?.filter((project) => {
          const lowerCaseItem = project?.title.toLowerCase();
          return searchTerm
            .split("")
            .every((letter) => lowerCaseItem.includes(letter));
        })
      );
    } else {
      setFiltered(null);
    }
  }, [searchTerm, projects]);

  const handleCardClick = (project) => {
    setSelectedProject(project); // Set the selected project when a card is clicked
  };

  const handleBackClick = () => {
    setSelectedProject(null); // Clear the selected project to show the project list again
  };

  return (
    <div className="w-full py-6 flex items-center justify-center gap-16 flex-wrap ">
      {selectedProject ? (
        <ProjectDetails
          project={selectedProject}
          onBackClick={handleBackClick}
        />
      ) : (
        (filtered || projects)?.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            onClick={() => handleCardClick(project)}
          />
        ))
      )}
    </div>
  );
};

const ProjectCard = ({ project, index, onClick }) => {
  const projectUser = project?.user; // Access the project-specific user

  return (
    <motion.div
      key={index}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="w-full flex-col cursor-pointer md:w-[450px] h-[375px] bg-secondary rounded-md p-4 items-center gap-4"
      onClick={onClick} // Handle card click
    >
      <div
        className="bg-primary w-full h-full rounded-md overflow-hidden "
        style={{ overflow: "hidden", height: "100%" }}
      >
        <iframe
          title="Project"
          srcDoc={project.output}
          style={{ border: "none", width: "100%", height: "100%" }}
        />
      </div>
      <div className="flex items-center justify-start gap-3 w-full ">
        <div className="w-14 h-14 flex items-center justify-center rounded-xl overflow-hidden cursor-pointer bg-emerald-500">
          {project?.user?.photoURL ? (
            <motion.img
              whileHover={{ scale: 0.9 }}
              src={project?.user?.photoURL}
              alt={project?.user?.displayName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          ) : (
            <p className="text-xl text-white font-semibold capitalize">
              {project?.user?.email[0]}
            </p>
          )}
        </div>
        <div>
          <p className="text-white text-lg capitalize">{project?.title}</p>
          <p className="text-primaryText text-sm capitalize">
            {projectUser?.displayName
              ? projectUser?.displayName
              : `${projectUser?.email?.split("@")[0]}`}
          </p>
        </div>
        <motion.div
          className="cursor-pointer ml-auto"
          whileTap={{ scale: 0.9 }}
        >
          <MdBookmark className="text-primaryText text-3xl" />
        </motion.div>
      </div>
    </motion.div>
  );
};

const ProjectDetails = ({ project, onBackClick }) => {
  const [viewCode, setViewCode] = useState(false); // State to toggle between project output and code

  const handleViewCodeToggle = () => {
    setViewCode((prevState) => !prevState); // Toggle code view
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="flex gap-4 mb-4">
        <button
          className="bg-primaryText text-white py-2 px-4 rounded"
          onClick={onBackClick}
        >
          Back to Projects
        </button>
        <button
          className="bg-secondary text-white py-2 px-4 rounded"
          onClick={handleViewCodeToggle}
        >
          {viewCode ? "View Project" : "View Code"}
        </button>
      </div>
      {viewCode ? (
        <div className="w-full bg-secondary p-4 rounded-lg">
          <h2 className="text-2xl text-white mb-4">{project?.title} - Code</h2>
          <div className="bg-primary p-4 rounded-lg overflow-auto max-h-[500px]">
            <h3 className="text-lg text-white mb-2">HTML</h3>
            <pre className="text-white bg-gray-800 p-2 rounded">
              {project?.html}
            </pre>

            <h3 className="text-lg text-white mb-2 mt-4">CSS</h3>
            <pre className="text-white bg-gray-800 p-2 rounded">
              {project?.css}
            </pre>

            <h3 className="text-lg text-white mb-2 mt-4">JavaScript</h3>
            <pre className="text-white bg-gray-800 p-2 rounded">
              {project?.js}
            </pre>
          </div>
        </div>
      ) : (
        <div className="w-full bg-secondary p-4 rounded-lg">
          <h2 className="text-2xl text-white mb-4">{project?.title}</h2>
          <div className="w-full h-[500px] bg-primary rounded-md overflow-hidden mb-4">
            <iframe
              title="ProjectDetails"
              srcDoc={project.output}
              style={{ border: "none", width: "100%", height: "100%" }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
