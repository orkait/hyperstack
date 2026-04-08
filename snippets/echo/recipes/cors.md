package main

import (
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Permissive CORS for development
	e.Use(middleware.CORS())

	// OR: Production CORS with explicit config
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{"https://app.example.com", "https://admin.example.com"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Authorization", "Content-Type", "X-Request-ID"},
		ExposeHeaders:    []string{"X-Request-ID"},
		AllowCredentials: true,
		MaxAge:           86400, // 24 hours preflight cache
	}))

	e.GET("/api/data", func(c echo.Context) error {
		return c.JSON(200, map[string]string{"status": "ok"})
	})

	e.Logger.Fatal(e.Start(":8080"))
}