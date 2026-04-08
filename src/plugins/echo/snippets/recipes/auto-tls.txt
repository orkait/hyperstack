package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"golang.org/x/crypto/acme/autocert"
)

func main() {
	e := echo.New()
	e.AutoTLSManager.Prompt = autocert.AcceptTOS
	e.AutoTLSManager.HostPolicy = autocert.HostWhitelist("example.com", "www.example.com")
	// Certificates are cached to disk
	e.AutoTLSManager.Cache = autocert.DirCache("/var/www/.cache")

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Redirect HTTP → HTTPS
	e.Pre(middleware.HTTPSRedirect())

	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, TLS!")
	})

	// Start HTTP server for ACME challenge + redirect
	go func() {
		if err := e.Start(":80"); err != http.ErrServerClosed {
			e.Logger.Fatal(err)
		}
	}()

	// Start HTTPS server
	e.Logger.Fatal(e.StartAutoTLS(":443"))
}