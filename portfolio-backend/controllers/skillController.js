import { getAllSkills as fetchAllSkills, updateAllSkills as replaceAllSkills } from '../queries/skillQueries.js';

export const getAllSkills = async (req, res) => {
  try {
    const skills = await fetchAllSkills();
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching skills' });
  }
};

export const updateSkills = async (req, res) => {
  try {
    // Expects an array of skill objects: [{ name: 'Angular', category: 'Frameworks' }]
    const skills = req.body;
    await replaceAllSkills(skills);
    res.status(200).json({ message: 'Skills updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating skills' });
  }
};