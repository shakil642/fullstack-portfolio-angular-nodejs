import * as queries from '../queries/reviewQueries.js';

export const getStats = async (req, res) => {
    try {
        const stats = await queries.getReviewStats();
        res.status(200).json({
            totalReviews: parseInt(stats.total_reviews, 10) || 0,
            averageRating: parseFloat(stats.average_rating) || 0
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching review stats' });
    }
};

// --- Public Controllers ---
export const getApprovedReviews = async (req, res) => {
    try {
        const reviews = await queries.getAllApprovedReviews();
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching reviews' });
    }
};

export const createNewReview = async (req, res) => {
    try {
        const newReview = await queries.createReview(req.body);
        res.status(201).json(newReview);
    } catch (error) {
        res.status(500).json({ message: 'Server error creating review' });
    }
};

// --- Admin Controllers ---
export const getReviewsForAdmin = async (req, res) => {
    try {
        const reviews = await queries.getAllReviewsAdmin();
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching reviews for admin' });
    }
};

export const approveReview = async (req, res) => {
    try {
        const approvedReview = await queries.approveReviewById(req.params.id);
        if (!approvedReview) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json(approvedReview);
    } catch (error) {
        res.status(500).json({ message: 'Server error approving review' });
    }
};

export const deleteReview = async (req, res) => {
    try {
        await queries.deleteReviewById(req.params.id);
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting review' });
    }
};