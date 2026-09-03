# Security (SE-1 .. SE-6)

## SE-1: Password hashing with `pwdlib`

```python
from pwdlib import PasswordHash

password_hash = PasswordHash.recommended()
hashed = password_hash.hash(plain)
ok = password_hash.verify(plain, hashed)
```

`passlib` is unmaintained and breaks on Python 3.13 and later. Keep it only as a read path while
migrating existing hashes, and rehash on successful login. Never store a plain or reversibly encrypted
password, never log the plain value, and keep the hash out of every response model (SE-6).

## SE-2: JWT with a maintained library, and validate every claim

Use `PyJWT`, or `joserfc` when JWE or full JOSE support is needed. `python-jose` is abandoned and
carries CVE-2024-33664.

| Control | Value |
|---|---|
| Access token lifetime | minutes, not hours |
| Refresh token | rotated on use, revocable, stored server-side |
| Verified claims | `exp`, `nbf`, `iss`, `aud`, and the signing algorithm |
| Algorithm | pinned explicitly, never read from the token header |

Decoding without an explicit `algorithms=[...]` list is how `alg: none` and algorithm-confusion attacks
land. Verify the signature before reading any claim from the payload.

## SE-3: `OAuth2PasswordBearer` and scopes, not hand-rolled header parsing

```python
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login", scopes={"users:read": "Read users"})
```

The built-in security utilities produce the OpenAPI security scheme, drive the docs authorize button,
and handle the missing-header and wrong-scheme cases consistently. Authorization decisions live in a
dependency, so a route cannot forget them by omission.

## SE-4: CORS explicit, never wildcard with credentials

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://app.example.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type"],
)
```

`allow_origins=["*"]` together with `allow_credentials=True` is rejected by browsers and is a sign the
configuration was copied rather than decided. List the origins, list the methods, list the headers.

## SE-5: Rate limit before the expensive work

Login, password reset, token refresh, signup, and any endpoint that sends mail or calls a paid API.
Prefer the edge (gateway, ingress, CDN) because it protects the process itself. In-process limiting
with `slowapi` or `fastapi-limiter` is a second layer, and both need shared storage such as Redis to
mean anything across replicas.

Rate limit by an identity the client cannot trivially change; a bare remote address behind a proxy is
whatever `X-Forwarded-For` says unless the proxy is trusted and the header is sanitized.

## SE-6: Never return an internal model

The response model is the boundary. Returning an ORM object or an internal Pydantic model is how
`hashed_password`, `is_admin`, `internal_notes`, and soft-delete flags reach clients.

```python
@router.get("/{user_id}", response_model=UserResponse)
```

Two habits enforce it: `response_model` on every route (EP-1), and a test that asserts the response
body has exactly the expected keys (TQ-3). Field-level exclusion via `response_model_exclude` is a
patch over a wrong model, not a design.
