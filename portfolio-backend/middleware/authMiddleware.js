import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const protect = (req, res, next) => {
  let token;

  // Check if the token is in the Authorization header and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (e.g., "Bearer eyJhbGciOi...")
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using your secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the decoded user info to the request for later use (optional)
      req.user = decoded;

      // If token is valid, proceed to the next function (the controller)
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};