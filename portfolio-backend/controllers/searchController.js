import { searchContent as performSearch } from '../queries/searchQueries.js';

export const search = async (req, res) => {
  try {
    const searchTerm = req.query.q; 
    if (!searchTerm) {
      return res.status(400).json({ message: 'Search term is required' });
    }
    const results = await performSearch(searchTerm);
    res.status(200).json(results);
  } catch (error) {
    console.error('Error performing search:', error);
    res.status(500).json({ message: 'Server error while performing search' });
  }
};