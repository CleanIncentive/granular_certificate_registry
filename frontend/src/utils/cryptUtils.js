/**
 * Cryptography utilities
 * 
 * This provides a JavaScript implementation of the CryptContext used in the backend.
 * It wraps bcrypt functionality to maintain consistency with the Python implementation.
 */

import bcrypt from 'bcryptjs';

/**
 * CryptContext class that provides a similar interface to Python's passlib.context
 */
export class CryptContext {
  /**
   * Create a new CryptContext
   * 
   * @param {Array<string>} schemes - List of hash schemes (only bcrypt supported currently)
   * @param {Object} options - Configuration options
   */
  constructor(schemes, options = {}) {
    this.schemes = schemes;
    this.options = options;
    
    // Verify that we support the requested schemes
    if (!schemes.includes('bcrypt')) {
      throw new Error('Only bcrypt is currently supported');
    }
  }
  
  /**
   * Hash a password using bcrypt
   * 
   * @param {string} password - Plain text password to hash
   * @param {number} rounds - Number of rounds for bcrypt (defaults to 12)
   * @returns {string} - Hashed password
   */
  hash(password, rounds = 12) {
    // Generate a salt
    const salt = bcrypt.genSaltSync(rounds);
    
    // Hash the password with the salt
    return bcrypt.hashSync(password, salt);
  }
  
  /**
   * Verify a password against a hash
   * 
   * @param {string} password - Plain text password to verify
   * @param {string} hash - Hashed password to compare against
   * @returns {boolean} - True if password matches hash
   */
  verify(password, hash) {
    return bcrypt.compareSync(password, hash);
  }
} 