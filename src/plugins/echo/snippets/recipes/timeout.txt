package main

import (
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func slowHandler(c echo.Context) error {
	// Simulate slow work — this will be cancelled if it exceeds the timeout
	select {
	case <-c.Request().Context().Done():
		return c.Request().Context().Err()
	case <-time.After(5 * time.Second):
		return c.String(http.StatusOK, "done")
	}
}

func main() {
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Global timeout — cancels any request exceeding 30s
	e.Use(middleware.TimeoutWithConfig(middleware.TimeoutConfig{
		Timeout: 30 * time.Second,
	}))

	e.GET("/slow", slowHandler)

	e.Logger.Fatal(e.Start(":8080"))
}