import { 
  getAllProjects as fetchAllProjects, 
  createProject as addNewProject,
  deleteProjectById as removeProjectById,
  updateProjectById as modifyProjectById 
} from '../queries/projectQueries.js';

export const getAllProjects = async (req, res) => {
  try {
    const projects = await fetchAllProjects();
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Server error while fetching projects' });
  }
};

export const createProject = async (req, res) => {
  try {
    const newProject = await addNewProject(req.body);
    res.status(201).json(newProject); 
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Server error while creating project' });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params; 
    const deletedProject = await removeProjectById(id);

    if (!deletedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Server error while deleting project' });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProject = await modifyProjectById(id, req.body);
    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Server error while updating project' });
  }
};