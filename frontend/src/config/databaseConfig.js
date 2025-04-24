/**
 * Database configuration
 * 
 * This configuration matches the database settings used by the backend
 * and provides connection information for direct database access.
 */

// Environment-specific configuration
const environments = {
  development: {
    write: {
      host: process.env.REACT_APP_DB_WRITE_HOST || 'localhost',
      port: parseInt(process.env.REACT_APP_DB_WRITE_PORT || '5432'),
      database: process.env.REACT_APP_DB_NAME || 'granular_certificate_registry',
      user: process.env.REACT_APP_DB_USER || 'postgres',
      password: process.env.REACT_APP_DB_PASSWORD || 'postgres',
      ssl: process.env.REACT_APP_DB_SSL === 'true',
      max: 10, // max number of clients in the pool
      idleTimeoutMillis: 30000, // how long a client is kept idle (ms)
    },
    read: {
      host: process.env.REACT_APP_DB_READ_HOST || 'localhost',
      port: parseInt(process.env.REACT_APP_DB_READ_PORT || '5432'),
      database: process.env.REACT_APP_DB_NAME || 'granular_certificate_registry',
      user: process.env.REACT_APP_DB_USER || 'postgres',
      password: process.env.REACT_APP_DB_PASSWORD || 'postgres',
      ssl: process.env.REACT_APP_DB_SSL === 'true',
      max: 20, // read connections can have higher pool limit
      idleTimeoutMillis: 30000,
    },
    eventstore: {
      connectionString: process.env.REACT_APP_EVENTSTORE_CONNECTION_STRING || 
                         'esdb://localhost:2113?tls=false',
      defaultCredentials: {
        username: process.env.REACT_APP_EVENTSTORE_USER || 'admin',
        password: process.env.REACT_APP_EVENTSTORE_PASSWORD || 'changeit',
      },
    },
  },
  production: {
    write: {
      host: process.env.REACT_APP_DB_WRITE_HOST,
      port: parseInt(process.env.REACT_APP_DB_WRITE_PORT || '5432'),
      database: process.env.REACT_APP_DB_NAME,
      user: process.env.REACT_APP_DB_USER,
      password: process.env.REACT_APP_DB_PASSWORD,
      ssl: true,
      max: 10,
      idleTimeoutMillis: 30000,
    },
    read: {
      host: process.env.REACT_APP_DB_READ_HOST,
      port: parseInt(process.env.REACT_APP_DB_READ_PORT || '5432'),
      database: process.env.REACT_APP_DB_NAME,
      user: process.env.REACT_APP_DB_USER,
      password: process.env.REACT_APP_DB_PASSWORD,
      ssl: true,
      max: 20,
      idleTimeoutMillis: 30000,
    },
    eventstore: {
      connectionString: process.env.REACT_APP_EVENTSTORE_CONNECTION_STRING,
      defaultCredentials: {
        username: process.env.REACT_APP_EVENTSTORE_USER,
        password: process.env.REACT_APP_EVENTSTORE_PASSWORD,
      },
    },
  },
};

// Determine the current environment
const nodeEnv = process.env.NODE_ENV || 'development';
const environment = nodeEnv === 'production' ? 'production' : 'development';

// Export the appropriate configuration
export const connectionConfig = environments[environment]; 