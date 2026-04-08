package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func sseHandler(c echo.Context) error {
	c.Response().Header().Set("Content-Type", "text/event-stream")
	c.Response().Header().Set("Cache-Control", "no-cache")
	c.Response().Header().Set("Connection", "keep-alive")
	c.Response().WriteHeader(http.StatusOK)

	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-c.Request().Context().Done():
			// Client disconnected
			return nil
		case t := <-ticker.C:
			// Write SSE event
			fmt.Fprintf(c.Response(), "data: %s\n\n", t.Format(time.RFC3339))
			// Flush is REQUIRED — without it the client never receives data
			c.Response().Flush()
		}
	}
}

func main() {
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.GET("/events", sseHandler)

	e.Logger.Fatal(e.Start(":8080"))
}