from __future__ import annotations

import base64
import json
import threading
import time
from urllib import parse as urllib_parse
from urllib import request as urllib_request

from app.config import SETTINGS

_CACHE_LOCK = threading.Lock()
_CACHED_ACCESS_TOKEN: str | None = None
_CACHED_ACCESS_TOKEN_EXP: int = 0


def build_main_api_auth_headers() -> dict[str, str]:
    headers = {"Accept": "application/json"}

    access_token = get_access_token()
    if access_token:
        headers["Authorization"] = f"Bearer {access_token}"

    return headers


def get_access_token() -> str | None:
    global _CACHED_ACCESS_TOKEN
    global _CACHED_ACCESS_TOKEN_EXP

    refresh_token = SETTINGS.auth_refresh_token.strip()
    if not refresh_token:
        return None

    with _CACHE_LOCK:
        now = int(time.time())
        if _CACHED_ACCESS_TOKEN and now < _CACHED_ACCESS_TOKEN_EXP - 30:
            return _CACHED_ACCESS_TOKEN

        access_token = _exchange_refresh_token(refresh_token)
        if not access_token:
            return None

        exp = _extract_jwt_exp(access_token)
        if exp is None:
            exp = now + 60

        _CACHED_ACCESS_TOKEN = access_token
        _CACHED_ACCESS_TOKEN_EXP = exp
        return access_token


def _exchange_refresh_token(refresh_token: str) -> str | None:
    url = urllib_parse.urljoin(
        SETTINGS.api_base_url.rstrip("/") + "/",
        SETTINGS.auth_refresh_endpoint.lstrip("/"),
    )
    payload = json.dumps({"refreshToken": refresh_token}).encode("utf-8")
    request = urllib_request.Request(
        url,
        data=payload,
        headers={"Content-Type": "application/json", "Accept": "application/json"},
        method="POST",
    )

    try:
        with urllib_request.urlopen(request, timeout=SETTINGS.garment_config_timeout_seconds) as response:
            if response.getcode() < 200 or response.getcode() >= 300:
                return None
            body = json.loads(response.read().decode("utf-8"))
    except Exception:
        return None

    data = body.get("data") if isinstance(body, dict) else None
    access_token = data.get("accessToken") if isinstance(data, dict) else None
    if not isinstance(access_token, str) or not access_token.strip():
        return None

    return access_token.strip()


def _extract_jwt_exp(token: str) -> int | None:
    parts = token.split(".")
    if len(parts) != 3:
        return None

    payload = parts[1]
    padding = "=" * (-len(payload) % 4)

    try:
        decoded = base64.urlsafe_b64decode(payload + padding)
        data = json.loads(decoded.decode("utf-8"))
    except Exception:
        return None

    exp = data.get("exp") if isinstance(data, dict) else None
    return exp if isinstance(exp, int) else None
