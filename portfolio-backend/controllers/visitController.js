import { createVisit as recordVisit } from '../queries/visitQueries.js';

export const trackVisit = async (req, res) => {
  try {
    await recordVisit();
    // Send a 204 No Content response as we don't need to send any data back
    res.status(204).send();
  } catch (error) {
    console.error('Error tracking visit:', error);
    // Even if it fails, we send a success status so it doesn't break the client
    res.status(204).send();
  }
};