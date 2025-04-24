/**
 * Authentication service
 * Includes functions for password handling and user authentication
 */

// This is a wrapper around the same bcrypt functionality used in the backend
// We're importing it directly from a shared location to ensure consistent behavior
import { CryptContext } from '../utils/cryptUtils';

// Create a password context with bcrypt configuration
const pwd_context = new CryptContext(['bcrypt'], { deprecated: 'auto' });

/**
 * Hash a password using bcrypt
 * 
 * @param {string} password - Plain text password to hash
 * @returns {string} - Hashed password
 */
export const get_password_hash = (password) => {
  return pwd_context.hash(password);
};

/**
 * Verify a password against a hash
 * 
 * @param {string} plain_password - Plain text password to verify
 * @param {string} hashed_password - Hashed password to compare against
 * @returns {boolean} - True if password matches hash
 */
export const verify_password = (plain_password, hashed_password) => {
  return pwd_context.verify(plain_password, hashed_password);
}; 