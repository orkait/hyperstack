package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"golang.org/x/net/http2"
)

func main() {
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.GET("/", func(c echo.Context) error {
		// HTTP/2 Server Push
		pusher, ok := c.Response().Writer.(http.Pusher)
		if ok {
			if err := pusher.Push("/static/style.css", nil); err != nil {
				e.Logger.Warn("Failed to push:", err)
			}
		}
		return c.File("public/index.html")
	})

	e.Static("/static", "assets")

	// Start with TLS (HTTP/2 requires TLS in browsers)
	s := e.TLSServer
	s.Addr = ":443"

	// Enable HTTP/2 explicitly
	if err := http2.ConfigureServer(s, &http2.Server{}); err != nil {
		e.Logger.Fatal(err)
	}

	e.Logger.Fatal(e.StartTLS(":443", "cert.pem", "key.pem"))
}