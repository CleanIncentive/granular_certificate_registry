/**
 * User model
 * 
 * This model mirrors the User model in the backend and provides methods
 * for creating, reading, updating, and deleting users directly in the database.
 */

import { EventTypes } from './enums';

/**
 * User class for database operations
 */
export class User {
  /**
   * Create a new User in the database
   * 
   * @param {Object} userData - User data
   * @param {Object} writeSession - Database write session
   * @param {Object} readSession - Database read session
   * @param {Object} esdbClient - EventStore client
   * @returns {Promise<Array>} - Array containing the created user
   */
  static async create(userData, writeSession, readSession, esdbClient) {
    try {
      // 1. Insert the user into the database
      const userInsertQuery = `
        INSERT INTO registry_user (name, email, role, hashed_password, organisation, is_deleted)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, name, email, role, organisation;
      `;
      
      const userValues = [
        userData.name,
        userData.email,
        userData.role,
        userData.hashed_password,
        userData.organisation || null,
        false // is_deleted
      ];
      
      // Execute the insert query
      const userResult = await writeSession.execute(userInsertQuery, userValues);
      const createdUser = userResult.rows[0];
      
      // 2. Log the event to EventStore
      const event = {
        entity_id: createdUser.id,
        entity_name: 'User',
        attributes_before: null,
        attributes_after: {
          id: createdUser.id,
          name: createdUser.name,
          email: createdUser.email,
          role: createdUser.role,
          organisation: createdUser.organisation,
          is_deleted: false
        },
        timestamp: new Date(),
        event_type: EventTypes.CREATE,
        event_data: { created_by: 'admin_portal' },
        version: 1
      };
      
      // Write the event to EventStore
      await esdbClient.appendToStream(
        `User-${createdUser.id}`,
        [event],
        { expectedRevision: 'no_stream' }
      );
      
      return [createdUser];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  
  /**
   * Get all users from the database
   * 
   * @param {Object} readSession - Database read session
   * @returns {Promise<Array>} - Array of users
   */
  static async all(readSession) {
    try {
      const query = `
        SELECT id, name, email, role, organisation, is_deleted
        FROM registry_user
        WHERE is_deleted = false
        ORDER BY id;
      `;
      
      const result = await readSession.execute(query);
      return result.rows;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }
  
  /**
   * Get a user by ID
   * 
   * @param {number} id - User ID
   * @param {Object} readSession - Database read session
   * @returns {Promise<Object>} - User object
   */
  static async get(id, readSession) {
    try {
      const query = `
        SELECT id, name, email, role, organisation, is_deleted
        FROM registry_user
        WHERE id = $1 AND is_deleted = false;
      `;
      
      const result = await readSession.execute(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error(`Error getting user with ID ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Get a user by email
   * 
   * @param {string} email - User email
   * @param {Object} readSession - Database read session
   * @returns {Promise<Object>} - User object
   */
  static async getByEmail(email, readSession) {
    try {
      const query = `
        SELECT id, name, email, role, organisation, is_deleted, hashed_password
        FROM registry_user
        WHERE email = $1 AND is_deleted = false;
      `;
      
      const result = await readSession.execute(query, [email]);
      return result.rows[0] || null;
    } catch (error) {
      console.error(`Error getting user with email ${email}:`, error);
      throw error;
    }
  }
} 