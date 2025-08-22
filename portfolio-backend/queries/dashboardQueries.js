import pool from '../config/db.js';

export const getDashboardStats = async () => {
  // We can run multiple queries at once for efficiency
  const projectCountPromise = pool.query('SELECT COUNT(*) FROM projects');
  const blogCountPromise = pool.query('SELECT COUNT(*) FROM blogs');
  const reviewCountPromise = pool.query('SELECT COUNT(*) FROM reviews');
  const messageCountPromise = pool.query('SELECT COUNT(*) FROM messages');
  const visitCountPromise = pool.query('SELECT COUNT(*) FROM visits');

  const [
    projectResult,
    blogResult,
    reviewResult,
    messageResult,
    visitResult
  ] = await Promise.all([
    projectCountPromise,
    blogCountPromise,
    reviewCountPromise,
    messageCountPromise,
    visitCountPromise
  ]);

  return {
    totalProjects: parseInt(projectResult.rows[0].count, 10),
    totalBlogs: parseInt(blogResult.rows[0].count, 10),
    totalReviews: parseInt(reviewResult.rows[0].count, 10),
    totalMessages: parseInt(messageResult.rows[0].count, 10),
    totalVisits: parseInt(visitResult.rows[0].count, 10)
  };
};

// --- This is the new function you are adding ---
export const getProjectTagStats = async () => {
  const result = await pool.query('SELECT tags FROM projects WHERE tags IS NOT NULL');
  const tagCounts = {};

  // Loop through each project's tags
  result.rows.forEach(row => {
    const tags = row.tags.split(',').map(tag => tag.trim());
    tags.forEach(tag => {
      if (tag) { 
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      }
    });
  });

  // Convert the tagCounts object into two separate arrays that Chart.js can use
  const labels = Object.keys(tagCounts);
  const data = Object.values(tagCounts);
  
  return { labels, data };
};

// --- ADD THIS NEW FUNCTION ---
export const getRecentActivity = async () => {
  const query = `
    SELECT id, title AS text, 'Project' AS type, created_at FROM projects
    UNION ALL
    SELECT id, title AS text, 'Blog' AS type, created_at FROM blogs
    UNION ALL
    SELECT id, 'New review from ' || name AS text, 'Review' AS type, created_at FROM reviews
    UNION ALL
    SELECT id, 'New message from ' || name AS text, 'Message' AS type, received_at AS created_at FROM messages
    ORDER BY created_at DESC
    LIMIT 10;
  `;
  const result = await pool.query(query);
  return result.rows;
};

export const getTopSkill = async () => {
  const result = await pool.query('SELECT tags FROM projects WHERE tags IS NOT NULL AND tags != \'\'');
  const tagCounts = {};

  result.rows.forEach(row => {
    const tags = row.tags.split(',').map(tag => tag.trim());
    tags.forEach(tag => {
      if (tag) {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      }
    });
  });

  // Find the tag with the highest count
  let topSkill = 'Not available';
  let maxCount = 0;
  for (const tag in tagCounts) {
    if (tagCounts[tag] > maxCount) {
      maxCount = tagCounts[tag];
      topSkill = tag;
    }
  }

  return { topSkill };
};

export const getReviewApprovalStats = async () => {
  // This single query calculates both counts at once for maximum efficiency
  const statsResult = await pool.query(`
    SELECT
      COUNT(*) AS total_reviews,
      COUNT(*) FILTER (WHERE is_approved = true) AS approved_reviews
    FROM reviews
  `);
  return statsResult.rows[0];
};

export const getBusiestMonth = async () => {
  const query = `
    SELECT
      TO_CHAR(activity_date, 'Month YYYY') AS month,
      COUNT(*) AS activity_count
    FROM (
      SELECT created_at AS activity_date FROM projects
      UNION ALL
      SELECT created_at AS activity_date FROM blogs
      UNION ALL
      SELECT created_at AS activity_date FROM reviews
      UNION ALL
      SELECT received_at AS activity_date FROM messages
    ) AS all_activities
    GROUP BY month
    ORDER BY activity_count DESC
    LIMIT 1;
  `;
  const result = await pool.query(query);
  return result.rows[0];
};