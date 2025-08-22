import pool from '../config/db.js';

// Get all skills, grouped by category
export const getAllSkills = async () => {
  const result = await pool.query('SELECT * FROM skills ORDER BY category, id');
  // We'll group them here in the backend for convenience
  const skillsByCategory = result.rows.reduce((acc, skill) => {
    const { category, name } = skill;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(name);
    return acc;
  }, {});
  return skillsByCategory;
};

// Replace all skills with a new list
export const updateAllSkills = async (skills) => {
  // Start a transaction
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Delete all old skills
    await client.query('DELETE FROM skills');
    // Insert all new skills
    for (const skill of skills) {
      await client.query(
        'INSERT INTO skills (name, category) VALUES ($1, $2)',
        [skill.name, skill.category]
      );
    }
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};