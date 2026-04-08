package main

import (
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

// Custom middleware: request timing
func timingMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		start := time.Now()
		err := next(c)
		c.Logger().Infof("Request took %s", time.Since(start))
		return err
	}
}

// Custom middleware: require API key header
func apiKeyMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		key := c.Request().Header.Get("X-API-Key")
		if key != "valid-key" {
			return echo.NewHTTPError(http.StatusUnauthorized, "invalid api key")
		}
		return next(c)
	}
}

func main() {
	e := echo.New()

	// ORDER MATTERS:
	// 1. Logger FIRST — logs ALL requests including those that panic (Recover catches the panic, Logger records it)
	// 2. Recover SECOND — catches panics from all subsequent middleware and handlers
	// 3. CORS (if applicable) — must be before auth so OPTIONS preflight passes
	// 4. Auth middleware — reject unauthorized before expensive processing
	// 5. Custom business middleware last

	e.Use(middleware.Logger())     // 1: log every request
	e.Use(middleware.Recover())    // 2: recover from panics
	e.Use(middleware.RequestID())  // 3: attach X-Request-ID
	e.Use(timingMiddleware)        // 4: time the full request

	// Route-level middleware (more specific)
	api := e.Group("/api")
	api.Use(apiKeyMiddleware) // only on /api routes

	e.GET("/health", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{"status": "ok"})
	})

	api.GET("/data", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{"data": "secret"})
	})

	e.Logger.Fatal(e.Start(":8080"))
}