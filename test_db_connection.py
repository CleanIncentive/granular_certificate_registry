import os
import psycopg2
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def test_db_connection():
    try:
        # Get database connection parameters from environment variables
        db_params = {
            'host': os.getenv('DATABASE_HOST_WRITE'),
            'port': os.getenv('DATABASE_PORT'),
            'database': os.getenv('POSTGRES_DB'),
            'user': os.getenv('POSTGRES_USER'),
            'password': os.getenv('POSTGRES_PASSWORD')
        }
        
        # Attempt to connect to the database
        conn = psycopg2.connect(**db_params)
        
        # Create a cursor
        cur = conn.cursor()
        
        # Execute a simple query to test the connection
        cur.execute('SELECT version();')
        version = cur.fetchone()
        
        print("Successfully connected to the database!")
        print(f"PostgreSQL version: {version[0]}")
        
        # Close the cursor and connection
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"Error connecting to the database: {e}")

if __name__ == "__main__":
    test_db_connection() 