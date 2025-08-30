// controllers/authController.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import 'dotenv/config';
import pool from '../config/db.js';
import { sendEmail } from '../utils/sendEmail.js';

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid Credential' });
    }

    const user = userResult.rows[0];
    const passwordHash = user.password_hash;

    const isPasswordCorrect = await bcrypt.compare(password, passwordHash);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid Credential' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email }, 
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    // 1. Get user based on posted email
    const { email } = req.body;
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (userResult.rows.length === 0) {
      // It's more secure to not reveal if the user exists or not
      return res.status(200).json({ message: 'A reset password link has been sent to your email.' });
    }
    const user = userResult.rows[0];

    // 2. Generate the random reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // 3. Hash the token and set expiration date (e.g., 10 minutes)
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const tokenExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // 4. Save the hashed token and expiration to the database
    await pool.query(
      'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE id = $3',
      [hashedToken, tokenExpires, user.id]
    );

    // 5. Create the reset URL and send the email
    // const resetURL = `https://localhost:4200/reset-password/${resetToken}`; 
    const resetURL = `https://shakil64it.me/reset-password/${resetToken}`;

    const message = `
      <h1>You have requested a password reset</h1>
      <p>Please go to this link to reset your password:</p>
      <a href="${resetURL}" clicktracking=off>${resetURL}</a>
      <p>This link will expire in 10 minutes.</p>
    `;

    await sendEmail({
      email: user.email,
      subject: 'Your Password Reset Token (Valid for 10 min)',
      html: message
    });

    res.status(200).json({ message: 'A reset password link has been sent to your email.' });

  } catch (error) {
    console.error('Forgot password error:', error);
    // In a real app, you might want more robust error handling here
    res.status(500).json({ message: 'There was an error sending the email. Please try again later.' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    // 1. Get the token from the URL params
    const resetToken = req.params.token;
    const { password } = req.body;

    // 2. Hash the token from the URL so we can compare it to the one in the database
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // 3. Find the user by the hashed token and check if the token has not expired
    const userResult = await pool.query(
      'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()',
      [hashedToken]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'Token is invalid or has expired' });
    }
    const user = userResult.rows[0];

    // 4. If token is valid, hash the new password
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(password, salt);

    // 5. Update the user's password and clear the reset token fields
    await pool.query(
      'UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2',
      [newPasswordHash, user.id]
    );

    res.status(200).json({ message: 'Password has been successfully reset. Please log in.' });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'An error occurred while resetting the password.' });
  }
};
