package main

import (
	"embed"
	"io/fs"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

//go:embed public
var publicFS embed.FS

func main() {
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Serve embedded static files — no external filesystem needed at runtime
	subFS, err := fs.Sub(publicFS, "public")
	if err != nil {
		e.Logger.Fatal(err)
	}

	e.GET("/", func(c echo.Context) error {
		return c.File("public/index.html")
	})

	// Serve entire embedded directory under /static
	e.GET("/static/*", echo.WrapHandler(http.StripPrefix("/static/", http.FileServer(http.FS(subFS)))))

	e.Logger.Fatal(e.Start(":8080"))
}