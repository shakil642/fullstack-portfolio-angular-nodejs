import pool from '../config/db.js';

export const searchContent = async (searchTerm) => {
  // This new logic handles prefixes. e.g., 'ang' will match 'Angular'
  // It splits the search term by spaces and adds a prefix operator ':*' to the last word.
  const queryText = searchTerm.trim().split(' ').join(' & ') + ':*';

  const searchQuery = `
    SELECT 
      id, title, description, 'project' AS type, created_at, tags, image_url, github_link, live_link, 
      NULL AS slug
    FROM projects
    WHERE to_tsvector('english', title || ' ' || description || ' ' || tags) @@ to_tsquery('english', $1)
    
    UNION ALL
    
    SELECT 
      id, title, excerpt AS description, 'blog' AS type, created_at, NULL AS tags, image_url, NULL AS github_link, NULL AS live_link,
      slug
    FROM blogs
    WHERE is_published = true AND to_tsvector('english', title || ' ' || content || ' ' || excerpt) @@ to_tsquery('english', $1)
    
    ORDER BY created_at DESC;
  `;

  const result = await pool.query(searchQuery, [queryText]);
  return result.rows;
};