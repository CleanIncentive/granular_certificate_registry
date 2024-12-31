import datetime

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlmodel import Session, select

from gc_registry.core.database import db
from gc_registry.core.models.base import UserRoles
from gc_registry.settings import settings as st
from gc_registry.user.models import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

CredentialsException = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


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
        HTTPException: If the user does not exist or the password is incorrect, return a 404 or 401 respectively.

    """
    user = get_user(user_name, read_session)
    if user is None:
        raise HTTPException(status_code=404, detail=f"User '{user_name}' not found.")
    if not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Password for '{user_name}' is incorrect.",
        )
    return user


def create_access_token(
    data: dict, expires_delta: datetime.timedelta | None = None
) -> str:
    """Create an access token with the provided data and expiration.

    Args:
        data (dict): The data to encode in the token.
        expires_delta (datetime.timedelta): The time delta in seconds until the token expires.

    Returns:
        encoded_jwt: The encoded JWT token.

    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.datetime.now() + expires_delta
    else:
        expire = datetime.datetime.now() + datetime.timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, st.JWT_SECRET_KEY, algorithm=st.JWT_ALGORITHM)
    return encoded_jwt


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    read_session: Session = Depends(db.get_read_session),
) -> User:
    """Retrieve the current user from the provided token.

    Args:
        token (str): The token to decode.
        read_session (Session): The database session to read from.

    Returns:
        user: The User object matching the provided token.

    Raises:
        CredentialsException: If the token is invalid or the user does not exist, return a 401.

    """
    try:
        payload = jwt.decode(token, st.JWT_SECRET_KEY, algorithms=[st.JWT_ALGORITHM])
        user_name: str = payload.get("sub")
        if user_name is None:
            raise CredentialsException
    except JWTError:
        raise CredentialsException
    user = get_user(user_name, read_session)
    if user is None:
        raise CredentialsException
    return user


async def get_current_active_admin(
    current_user: User = Depends(get_current_user),
):
    """Ensure that the current user is an Admin.

    Args:
        current_user (User): The current user to validate.

    Returns:
        current_user: The validated User object.

    Raises:
        HTTPException: If the user is not an Admin, return a 401.

    """
    if UserRoles.ADMIN not in current_user.roles:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User must be an Admin to perform this action.",
        )
    return current_user
