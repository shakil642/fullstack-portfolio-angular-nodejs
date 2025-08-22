import pool from '../config/db.js';

// Get all published blog posts for the public site
export const getAllPublishedBlogs = async () => {
  const result = await pool.query(
    'SELECT id, title, slug, excerpt, image_url, created_at FROM blogs WHERE is_published = true ORDER BY created_at DESC'
  );
  return result.rows;
};

// Get a single blog post by its URL slug
export const getBlogBySlug = async (slug) => {
  const result = await pool.query('SELECT * FROM blogs WHERE slug = $1 AND is_published = true', [slug]);
  return result.rows[0];
};

// --- Admin Queries ---

// Get all blog posts (published and drafts) for the admin panel
export const getAllBlogsAdmin = async () => {
    // CHANGE THIS LINE to select all columns with '*'
    const result = await pool.query('SELECT * FROM blogs ORDER BY created_at DESC');
    return result.rows;
};

// Create a new blog post
export const createBlog = async (blog) => {
    const { title, slug, content, excerpt, image_url, is_published } = blog;
    const result = await pool.query(
        'INSERT INTO blogs (title, slug, content, excerpt, image_url, is_published) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [title, slug, content, excerpt, image_url, is_published]
    );
    return result.rows[0];
};

// Update an existing blog post
export const updateBlogById = async (id, blog) => {
    const { title, slug, content, excerpt, image_url, is_published } = blog;
    const result = await pool.query(
        'UPDATE blogs SET title = $1, slug = $2, content = $3, excerpt = $4, image_url = $5, is_published = $6 WHERE id = $7 RETURNING *',
        [title, slug, content, excerpt, image_url, is_published, id]
    );
    return result.rows[0];
};

// Delete a blog post
export const deleteBlogById = async (id) => {
    await pool.query('DELETE FROM blogs WHERE id = $1', [id]);
};