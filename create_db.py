import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def create_database(host, name):
    # Connection parameters for the default database
    params = {
        'host': host,
        'user': os.getenv('POSTGRES_USER'),
        'password': os.getenv('POSTGRES_PASSWORD'),
        'port': os.getenv('DATABASE_PORT'),
        'database': 'postgres'  # Connect to default database first
    }

    try:
        # Connect to default database
        conn = psycopg2.connect(**params)
        conn.autocommit = True  # This is required for database creation
        cur = conn.cursor()
        
        # Create the registry database
        cur.execute("DROP DATABASE IF EXISTS registry;")
        cur.execute("CREATE DATABASE registry;")
        
        print(f"Successfully created 'registry' database on {name} instance!")
        
    except Exception as e:
        print(f"An error occurred on {name} instance: {e}")
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()

# Create database on write instance
print("\nCreating database on write instance...")
create_database(os.getenv('DATABASE_HOST_WRITE'), 'write')

# Create database on read instance
print("\nCreating database on read instance...")
create_database(os.getenv('DATABASE_HOST_READ'), 'read') 