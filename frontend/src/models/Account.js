/**
 * Account model
 * 
 * This model mirrors the Account model in the backend and provides methods
 * for creating, reading, updating, and deleting accounts directly in the database.
 */

import { EventTypes } from './enums';

/**
 * Account class for database operations
 */
export class Account {
  /**
   * Create a new Account in the database
   * 
   * @param {Object} accountData - Account data
   * @param {Object} writeSession - Database write session
   * @param {Object} readSession - Database read session
   * @param {Object} esdbClient - EventStore client
   * @returns {Promise<Array>} - Array containing the created account
   */
  static async create(accountData, writeSession, readSession, esdbClient) {
    try {
      // 1. Insert the account into the database
      const accountInsertQuery = `
        INSERT INTO account (account_name, is_deleted)
        VALUES ($1, $2)
        RETURNING id, account_name;
      `;
      
      const accountValues = [
        accountData.account_name,
        false // is_deleted
      ];
      
      // Execute the insert query
      const accountResult = await writeSession.execute(accountInsertQuery, accountValues);
      const createdAccount = accountResult.rows[0];
      
      // 2. Log the event to EventStore
      const event = {
        entity_id: createdAccount.id,
        entity_name: 'Account',
        attributes_before: null,
        attributes_after: {
          id: createdAccount.id,
          account_name: createdAccount.account_name,
          is_deleted: false
        },
        timestamp: new Date(),
        event_type: EventTypes.CREATE,
        event_data: { created_by: 'admin_portal' },
        version: 1
      };
      
      // Write the event to EventStore
      await esdbClient.appendToStream(
        `Account-${createdAccount.id}`,
        [event],
        { expectedRevision: 'no_stream' }
      );
      
      return [createdAccount];
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  }
  
  /**
   * Get all accounts from the database
   * 
   * @param {Object} readSession - Database read session
   * @returns {Promise<Array>} - Array of accounts
   */
  static async all(readSession) {
    try {
      const query = `
        SELECT id, account_name, is_deleted
        FROM account
        WHERE is_deleted = false
        ORDER BY id;
      `;
      
      const result = await readSession.execute(query);
      return result.rows;
    } catch (error) {
      console.error('Error getting all accounts:', error);
      throw error;
    }
  }
  
  /**
   * Get an account by ID
   * 
   * @param {number} id - Account ID
   * @param {Object} readSession - Database read session
   * @returns {Promise<Object>} - Account object
   */
  static async get(id, readSession) {
    try {
      const query = `
        SELECT id, account_name, is_deleted
        FROM account
        WHERE id = $1 AND is_deleted = false;
      `;
      
      const result = await readSession.execute(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error(`Error getting account with ID ${id}:`, error);
      throw error;
    }
  }
} 