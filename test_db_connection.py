import sys
from gc_registry.core.database.db import get_db_name_to_client, get_write_session
from gc_registry.settings import settings

def test_connection():
    print("Database settings:")
    print(f"Host (write): {settings.DATABASE_HOST_WRITE}")
    print(f"Port: {settings.DATABASE_PORT}")
    print(f"Database: {settings.POSTGRES_DB}")
    print(f"Username: {settings.POSTGRES_USER}")
    print("\nTesting connection...")
    
    try:
        _ = get_db_name_to_client()
        session = get_write_session()
        print("\nConnection successful!")
        session.close()
    except Exception as e:
        print("\nConnection failed!")
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    test_connection() 