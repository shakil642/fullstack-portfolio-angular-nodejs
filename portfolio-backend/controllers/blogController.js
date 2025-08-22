import * as queries from '../queries/blogQueries.js';

// Helper function to create a URL-friendly "slug" from a title
const createSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
};

// --- Public Controllers ---
export const getPublishedBlogs = async (req, res) => {
    try {
        const blogs = await queries.getAllPublishedBlogs();
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching blogs' });
    }
};

export const getSingleBlog = async (req, res) => {
    try {
        const blog = await queries.getBlogBySlug(req.params.slug);
        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching blog post' });
    }
};


// --- Admin Controllers ---
export const getBlogsForAdmin = async (req, res) => {
    try {
        const blogs = await queries.getAllBlogsAdmin();
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching blogs for admin' });
    }
};

export const createNewBlog = async (req, res) => {
    try {
        const blogData = { ...req.body, slug: createSlug(req.body.title) };
        const newBlog = await queries.createBlog(blogData);
        res.status(201).json(newBlog);
    } catch (error) {
        res.status(500).json({ message: 'Server error creating blog post' });
    }
};

export const updateExistingBlog = async (req, res) => {
    try {
        const blogData = { ...req.body, slug: createSlug(req.body.title) };
        const updatedBlog = await queries.updateBlogById(req.params.id, blogData);
        if (!updatedBlog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        res.status(200).json(updatedBlog);
    } catch (error) {
        res.status(500).json({ message: 'Server error updating blog post' });
    }
};

export const deleteExistingBlog = async (req, res) => {
    try {
        await queries.deleteBlogById(req.params.id);
        res.status(200).json({ message: 'Blog post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting blog post' });
    }
};