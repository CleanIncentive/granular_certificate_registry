import sys
import traceback
from gc_registry.seed import seed_data

def run_seed():
    try:
        print("Starting database seeding...")
        seed_data()
        print("Database seeding completed successfully!")
    except Exception as e:
        print("\nError during seeding:")
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {str(e)}")
        print("\nFull traceback:")
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    run_seed() 