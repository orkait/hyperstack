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

	// Health endpoint — no auth
	e.GET("/health", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{"status": "ok"})
	})

	// API v1 group
	v1 := e.Group("/v1")
	v1.GET("/status", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{"version": "1"})
	})

	// Admin group with its own middleware
	admin := e.Group("/admin")
	admin.Use(middleware.BasicAuth(func(username, password string, c echo.Context) (bool, error) {
		return username == "admin" && password == "secret", nil
	}))
	admin.GET("/dashboard", func(c echo.Context) error {
		return c.String(http.StatusOK, "admin dashboard")
	})

	// Nested groups for sub-resources
	users := v1.Group("/users")
	users.GET("", func(c echo.Context) error {
		return c.JSON(http.StatusOK, []string{"alice", "bob"})
	})
	users.GET("/:id", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{"id": c.Param("id")})
	})
	users.GET("/:id/posts", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{"user": c.Param("id"), "posts": "..."})
	})

	e.Logger.Fatal(e.Start(":8080"))
}