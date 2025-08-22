import { 
  getDashboardStats as fetchDashboardStats,
  getProjectTagStats as fetchTagStats,
  getRecentActivity as fetchRecentActivity,
  getTopSkill as fetchTopSkill,
  getReviewApprovalStats as fetchApprovalStats,
  getBusiestMonth as fetchBusiestMonth
 } from '../queries/dashboardQueries.js';

export const getStats = async (req, res) => {
  try {
    const stats = await fetchDashboardStats();
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error fetching dashboard stats' });
  }
};

export const getTagStats = async (req, res) => {
  try {
    const tagStats = await fetchTagStats();
    res.status(200).json(tagStats);
  } catch (error) {
    console.error('Error fetching project tag stats:', error);
    res.status(500).json({ message: 'Server error fetching tag stats' });
  }
};

// --- ADD THIS NEW FUNCTION ---
export const getActivity = async (req, res) => {
  try {
    const activity = await fetchRecentActivity();
    res.status(200).json(activity);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({ message: 'Server error fetching recent activity' });
  }
};

export const getTopSkillStat = async (req, res) => {
  try {
    const { topSkill } = await fetchTopSkill();
    res.status(200).json({ topSkill });
  } catch (error) {
    console.error('Error fetching top skill:', error);
    res.status(500).json({ message: 'Server error fetching top skill' });
  }
};

export const getApprovalRate = async (req, res) => {
  try {
    const stats = await fetchApprovalStats();
    const total = parseInt(stats.total_reviews, 10);
    const approved = parseInt(stats.approved_reviews, 10);

    // Calculate the percentage, avoiding division by zero
    const approvalRate = total > 0 ? (approved / total) * 100 : 0;

    res.status(200).json({ approvalRate: Math.round(approvalRate) }); // Send back a whole number
  } catch (error) {
    console.error('Error fetching approval stats:', error);
    res.status(500).json({ message: 'Server error fetching approval stats' });
  }
};

export const getBusiestMonthStat = async (req, res) => {
  try {
    const result = await fetchBusiestMonth();
    // If there's no activity yet, result might be undefined
    const busiestMonth = result ? result.month : 'Not available';
    res.status(200).json({ busiestMonth });
  } catch (error) {
    console.error('Error fetching busiest month:', error);
    res.status(500).json({ message: 'Server error fetching busiest month' });
  }
};