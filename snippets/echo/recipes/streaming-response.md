package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func streamHandler(c echo.Context) error {
	c.Response().Header().Set(echo.HeaderContentType, echo.MIMETextPlainCharsetUTF8)
	c.Response().WriteHeader(http.StatusOK)

	for i := 1; i <= 10; i++ {
		// Write chunk
		fmt.Fprintf(c.Response(), "chunk %d of 10\n", i)
		// Flush sends the chunk immediately to the client
		c.Response().Flush()
		// Simulate work
		time.Sleep(500 * time.Millisecond)
	}
	return nil
}

func main() {
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.GET("/stream", streamHandler)

	e.Logger.Fatal(e.Start(":8080"))
}