package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Subdomain routing via Host header matching
	// api.example.com routes
	api := e.Host("api.example.com")
	api.GET("/users", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{"host": "api"})
	})

	// admin.example.com routes
	admin := e.Host("admin.example.com")
	admin.Use(middleware.BasicAuth(func(u, p string, c echo.Context) (bool, error) {
		return u == "admin" && p == "secret", nil
	}))
	admin.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "admin panel")
	})

	// Wildcard subdomain — :subdomain captures the dynamic part
	wildcard := e.Host(":subdomain.example.com")
	wildcard.GET("/", func(c echo.Context) error {
		sub := c.Param("subdomain")
		return c.JSON(http.StatusOK, map[string]string{"subdomain": sub})
	})

	e.Logger.Fatal(e.Start(":8080"))
}