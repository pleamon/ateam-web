import { useState, useCallback } from 'react';

// export default function useGlobalModel() {
//   const [currentProject, setCurrentProject] = useState<API.Project | null>(null);

//   const selectProject = useCallback((project: API.Project | null) => {
//     setCurrentProject(project);
//     if (project) {
//       localStorage.setItem('currentProjectId', project.id);
//     } else {
//       localStorage.removeItem('currentProjectId');
//     }
//   }, []);

//   const getCurrentProjectId = useCallback(() => {
//     return currentProject?.id || localStorage.getItem('currentProjectId') || null;
//   }, [currentProject]);

//   return {
//     currentProject,
//     setCurrentProject: selectProject,
//     currentProjectId: getCurrentProjectId(),
//   };
// }

export default function useProjectModel() {
  const [currentProject, setCurrentProject] = useState<API.Project | null>(null);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(localStorage.getItem('currentProjectId') || null);

  const selectProject = useCallback((project: API.Project | null) => {
    setCurrentProject(project);
    if (project) {
      localStorage.setItem('currentProjectId', project.id);
      setCurrentProjectId(project.id);
    } else {
      localStorage.removeItem('currentProjectId');
    }
  }, []);

  const getCurrentProjectId = useCallback(() => {
    return currentProjectId;
  }, [currentProjectId]);

  return {
    currentProject,
    setCurrentProject: selectProject,
    currentProjectId: getCurrentProjectId(),
    setCurrentProjectId,
  };
}