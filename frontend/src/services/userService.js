/**
 * Direct database interaction service for user operations
 * This bypasses API endpoints and directly applies database operations
 * similar to how seed.py works
 */

import { get_password_hash } from './authService';
import { db, events } from '../utils/databaseConnector';

/**
 * Create a user directly in the database
 * 
 * @param {Object} userData - User data including name, email, password, role, and optional organisation
 * @returns {Promise<Object>} - Created user object
 */
export const createUserInDatabase = async (userData) => {
  try {
    // Set up database sessions
    const write_session = db.get_write_session();
    const read_session = db.get_read_session();
    const esdb_client = events.get_esdb_client();
    
    try {
      // Create user object similar to seed.py
      const userToCreate = {
        email: userData.email,
        name: userData.name,
        hashed_password: get_password_hash(userData.password),
        role: userData.role,
        organisation: userData.organisation || null
      };
      
      // Create the user using the User model's create method
      const [user] = await User.create(
        userToCreate,
        write_session,
        read_session,
        esdb_client
      );
      
      // Return the created user
      return user;
    } finally {
      // Close database sessions to prevent leaks
      write_session.close();
      read_session.close();
    }
  } catch (error) {
    console.error('Error creating user in database:', error);
    throw error;
  }
}; 