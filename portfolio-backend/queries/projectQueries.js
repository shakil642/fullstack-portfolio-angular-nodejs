import pool from '../config/db.js';

export const getAllProjects = async () => {
  const result = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
  return result.rows;
};

export const createProject = async (project) => {
  const { title, description, image_url, github_link, live_link, tags } = project;
  const result = await pool.query(
    'INSERT INTO projects (title, description, image_url, github_link, live_link, tags) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [title, description, image_url, github_link, live_link, tags]
  );
  return result.rows[0];
};

export const deleteProjectById = async (id) => {
  const result = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

export const updateProjectById = async (id, project) => {
  const { title, description, image_url, github_link, live_link, tags } = project;
  const result = await pool.query(
    'UPDATE projects SET title = $1, description = $2, image_url = $3, github_link = $4, live_link = $5, tags = $6 WHERE id = $7 RETURNING *',
    [title, description, image_url, github_link, live_link, tags, id]
  );
  return result.rows[0];
};