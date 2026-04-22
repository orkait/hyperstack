# Echo Framework Quick Reference

## Setup

```go
e := echo.New()
e.Use(middleware.Logger())
e.Use(middleware.Recover())
e.Logger.Fatal(e.Start(":8080"))
```

## Routing

```go
e.GET("/users", handler)
e.POST("/users", handler)
e.PUT("/users/:id", handler)
e.PATCH("/users/:id", handler)
e.DELETE("/users/:id", handler)
e.Any("/path", handler)         // all methods

id := c.Param("id")            // path param
q := c.QueryParam("search")    // query string
```

## Groups & Middleware

```go
v1 := e.Group("/v1")
v1.Use(myMiddleware)
v1.GET("/users", handler)

// Pre-router middleware (before routing)
e.Pre(middleware.HTTPSRedirect())
```

## Request Binding

```go
type CreateReq struct { Name string `json:"name"` }
var req CreateReq
if err := c.Bind(&req); err != nil { return err }

// Path param binder (typed)
id := 0
echo.PathParamsBinder(c).Int("id", &id).BindError()
```

## Responses

```go
c.JSON(200, data)
c.String(200, "hello")
c.NoContent(204)
c.Redirect(301, "/new-path")
c.File("public/index.html")
c.Attachment("path/to/file", "filename.pdf")   // download
c.Inline("path/to/file", "filename.pdf")        // browser display
c.JSONP(200, "callback", data)
```

## Error Handling

```go
return echo.NewHTTPError(400, "bad request")
return echo.ErrUnauthorized
return echo.ErrNotFound

// Custom error handler
e.HTTPErrorHandler = func(err error, c echo.Context) {
    code := http.StatusInternalServerError
    var he *echo.HTTPError
    if errors.As(err, &he) { code = he.Code }
    c.JSON(code, map[string]any{"error": err.Error()})
}
```

## Middleware Order (Production)

```
Logger → Recover → CORS → RateLimiter → RequestID → Auth → Custom
```

## Graceful Shutdown

```go
go func() {
    if err := e.Start(":8080"); err != nil && err != http.ErrServerClosed {
        e.Logger.Fatal(err)
    }
}()
quit := make(chan os.Signal, 1)
signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
<-quit
ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
defer cancel()
e.Shutdown(ctx)
```

## TLS

```go
// Auto TLS (Let's Encrypt)
e.AutoTLSManager.HostPolicy = autocert.HostWhitelist("example.com")
e.AutoTLSManager.Cache = autocert.DirCache("/var/www/.cache")
e.Logger.Fatal(e.StartAutoTLS(":443"))

// Manual TLS
e.Logger.Fatal(e.StartTLS(":443", "cert.pem", "key.pem"))
```

## SSE Headers (Required)

```go
c.Response().Header().Set("Content-Type", "text/event-stream")
c.Response().Header().Set("Cache-Control", "no-cache")
c.Response().Header().Set("Connection", "keep-alive")
// After each write:
fmt.Fprintf(c.Response(), "data: %s\n\n", payload)
c.Response().Flush()
```

## Key Gotchas

- `c.Bind()` reads body **once** — never call twice
- `Logger` MUST come before `Recover`
- `Flush()` is REQUIRED for SSE and streaming responses
- Disable Gzip on SSE/streaming routes
- `echo.Context` is NOT goroutine-safe — copy values before goroutines
- `AllowCredentials: true` + wildcard origins = browser rejection