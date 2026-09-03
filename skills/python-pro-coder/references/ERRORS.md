# Error Handling (ER-1 .. ER-4)

## ER-1: `HTTPException` for expected HTTP outcomes, domain exceptions for domain failures

The service layer should not import `HTTPException`. It raises what it means, and one handler maps
domain errors to responses at the edge.

```python
class AppError(Exception):
    def __init__(self, message: str, status_code: int = 400, code: str | None = None):
        self.message = message
        self.status_code = status_code
        self.code = code

@app.exception_handler(AppError)
async def app_error_handler(request: Request, exc: AppError) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message, "code": exc.code},
    )
```

This keeps the service usable from a worker, a CLI, or a test without an HTTP layer, and gives one
place to change the error envelope.

## ER-2: Never leak internals in production

An unhandled exception returns a generic 500 with a correlation id; the traceback goes to the logs and
the error tracker. Debug pages, SQL text, file paths, and library versions in a response body are
reconnaissance material.

```python
@app.exception_handler(Exception)
async def unhandled(request: Request, exc: Exception) -> JSONResponse:
    logger.exception("unhandled_error", path=request.url.path, request_id=get_request_id())
    return JSONResponse(status_code=500, content={"detail": "Internal server error",
                                                  "request_id": get_request_id()})
```

The correlation id in the body is what makes a user's report findable in the logs (OB-2).

## ER-3: Let validation errors be validation errors

FastAPI already returns 422 with the failing field, its location, and the reason. Catching
`ValidationError` to reformat it into `{"error": "bad request"}` destroys the only part clients can act
on. Override `RequestValidationError` only to reshape the envelope consistently, never to flatten the
detail away.

Inside validators raise `ValueError`, not `HTTPException`: Pydantic collects the former into the same
422 with field context (PD-5).

## ER-4: Make writes idempotent where a retry is plausible

Any `POST` that creates a resource will be retried: by a proxy, by a mobile client on a flaky network,
by an impatient user. Accept an `Idempotency-Key` header, store the key with the created resource id,
and return the original result on a repeat.

For internal callers, a natural key with a unique constraint achieves the same thing more cheaply.
Either way, the second identical request must not create the second row.
