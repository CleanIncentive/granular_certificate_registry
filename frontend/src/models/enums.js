/**
 * Enum definitions
 * 
 * This file contains enum definitions that mirror those used in the backend.
 */

/**
 * User roles enum
 * 
 * @enum {number}
 */
export const UserRoles = {
  ADMIN: 4,
  PRODUCTION_USER: 3,
  TRADING_USER: 2,
  AUDIT_USER: 1,
  
  // Get the name of a role by its value
  getName: function(value) {
    const entries = Object.entries(this).filter(entry => entry[1] === value);
    return entries.length > 0 ? entries[0][0] : null;
  },
  
  // Get all role names
  getNames: function() {
    return Object.keys(this).filter(key => typeof this[key] === 'number');
  },
  
  // Get all role values
  getValues: function() {
    return Object.values(this).filter(value => typeof value === 'number');
  },
  
  // Get all roles as {value, label} pairs for select inputs
  getOptions: function() {
    return this.getNames().map(name => ({
      value: this[name],
      label: name.replace('_', ' ').toLowerCase()
    }));
  }
};

/**
 * Event types enum
 * 
 * @enum {string}
 */
export const EventTypes = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE'
}; 