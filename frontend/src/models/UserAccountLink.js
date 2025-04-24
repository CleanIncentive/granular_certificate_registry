/**
 * UserAccountLink model
 * 
 * This model mirrors the UserAccountLink model in the backend and provides methods
 * for linking users to accounts directly in the database.
 */

import { EventTypes } from './enums';

/**
 * UserAccountLink class for database operations
 */
export class UserAccountLink {
  /**
   * Create a new UserAccountLink in the database
   * 
   * @param {Object} linkData - Link data
   * @param {Object} writeSession - Database write session
   * @param {Object} readSession - Database read session
   * @param {Object} esdbClient - EventStore client
   * @returns {Promise<Array>} - Array containing the created link
   */
  static async create(linkData, writeSession, readSession, esdbClient) {
    try {
      // 1. Insert the link into the database
      const linkInsertQuery = `
        INSERT INTO user_account_link (user_id, account_id, is_deleted)
        VALUES ($1, $2, $3)
        RETURNING user_id, account_id;
      `;
      
      const linkValues = [
        linkData.user_id,
        linkData.account_id,
        false // is_deleted
      ];
      
      // Execute the insert query
      const linkResult = await writeSession.execute(linkInsertQuery, linkValues);
      const createdLink = linkResult.rows[0];
      
      // 2. Log the event to EventStore
      const event = {
        entity_id: `${createdLink.user_id}-${createdLink.account_id}`,
        entity_name: 'UserAccountLink',
        attributes_before: null,
        attributes_after: {
          user_id: createdLink.user_id,
          account_id: createdLink.account_id,
          is_deleted: false
        },
        timestamp: new Date(),
        event_type: EventTypes.CREATE,
        event_data: { created_by: 'admin_portal' },
        version: 1
      };
      
      // Write the event to EventStore
      await esdbClient.appendToStream(
        `UserAccountLink-${createdLink.user_id}-${createdLink.account_id}`,
        [event],
        { expectedRevision: 'no_stream' }
      );
      
      return [createdLink];
    } catch (error) {
      console.error('Error creating user account link:', error);
      throw error;
    }
  }
  
  /**
   * Get all links for a specific user
   * 
   * @param {number} userId - User ID
   * @param {Object} readSession - Database read session
   * @returns {Promise<Array>} - Array of account links
   */
  static async getByUserId(userId, readSession) {
    try {
      const query = `
        SELECT user_id, account_id, is_deleted
        FROM user_account_link
        WHERE user_id = $1 AND is_deleted = false;
      `;
      
      const result = await readSession.execute(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error(`Error getting account links for user ${userId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get all users for a specific account
   * 
   * @param {number} accountId - Account ID
   * @param {Object} readSession - Database read session
   * @returns {Promise<Array>} - Array of user links
   */
  static async getByAccountId(accountId, readSession) {
    try {
      const query = `
        SELECT user_id, account_id, is_deleted
        FROM user_account_link
        WHERE account_id = $1 AND is_deleted = false;
      `;
      
      const result = await readSession.execute(query, [accountId]);
      return result.rows;
    } catch (error) {
      console.error(`Error getting user links for account ${accountId}:`, error);
      throw error;
    }
  }
} 