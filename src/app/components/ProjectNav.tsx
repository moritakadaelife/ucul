import { useEffect, useState } from 'react';

export default function ProjectNav() {
  const [projects, setProjects] = useState<{ [key: string]: {} }>({});
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        if (!data || Object.keys(data).length === 0) {
          throw new Error('No projects found');
        }
        setProjects(data);
        const firstProject = Object.keys(data)[0];
        setActiveProject(firstProject);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchProjects();
  }, []);

  const handleTabClick = (project: string) => {
    setActiveProject((prevActiveProject) =>
      prevActiveProject === project ? null : project
    );
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <nav className="ucul-project-nav">
      <ul className="ucul-project-nav-list">
        {Object.keys(projects).map((project) => (
          <li
            key={project}
            className={`ucul-project-nav-list__item ${
              activeProject === project ? 'is-active' : ''
            }`}
            onClick={() => handleTabClick(project)}
          >
            {project}
          </li>
        ))}
      </ul>
    </nav>
  );
}
