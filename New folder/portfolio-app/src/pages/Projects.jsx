import React from 'react';
import ProjectCard from '../components/ProjectCard';

const Projects = () => {
  const projects = [
    {
      title: 'Project One',
      description: 'Description of project one.',
      link: '#',
    },
    {
      title: 'Project Two',
      description: 'Description of project two.',
      link: '#',
    },
    {
      title: 'Project Three',
      description: 'Description of project three.',
      link: '#',
    },
  ];

  return (
    <div>
      <h1>My Projects</h1>
      <div className="projects-container">
        {projects.map((project, index) => (
          <ProjectCard
            key={index}
            title={project.title}
            description={project.description}
            link={project.link}
          />
        ))}
      </div>
    </div>
  );
};

export default Projects;