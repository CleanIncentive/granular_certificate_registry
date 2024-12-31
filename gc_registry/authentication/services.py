from fastapi import HTTPException
from passlib.context import CryptContext
from sqlmodel import Session, select

from gc_registry.user.models import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify that the provided password matches the hashed password."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash the provided password."""
    return pwd_context.hash(password)


def get_user(user_name: str, read_session: Session) -> User | None:
    """Retrieve a User from the database matching the provided name.

    Args:
        user_name (str): The name of the User to retrieve.
        read_session (Session): The database session to read from.

    Returns:
        user: The User object matching the provided name.

    """
    # check if user exists:
    if read_session.exec(select(User).filter_by(name=user_name).exists()).scalar():
        user = read_session.exec(select(User).where(User.name == user_name)).first()
    else:
        return None
    return user


def authenticate_user(user_name: str, password: str, read_session: Session) -> User:
    """Authenticate a user by verifying their password.

    Args:
        user_name (str): The name of the User to authenticate.
        password (str): The password to verify.
        read_session (Session): The database session to read from.

    Returns:
        user: The User object matching the provided name.

    Raises:
        HTTPException: If the user does not exist or the password is incorrect, return a 404 or 403 respectively.

    """
    user = get_user(user_name, read_session)
    if user is None:
        raise HTTPException(status_code=404, detail=f"User '{user_name}' not found.")
    if not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=403, detail=f"Password for '{user_name}' is incorrect."
        )
    return user
