from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.db import supabase

bearer_scheme = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
):
    try:
        response = supabase.auth.get_user(credentials.credentials)
    except Exception as error:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token",
        ) from error

    if response.user is None:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated",
        )

    return response.user
