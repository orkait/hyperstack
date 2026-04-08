package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func downloadFile(c echo.Context) error {
	filename := c.Param("filename")

	// IMPORTANT: Validate/sanitize filename to prevent path traversal
	// In production, look up the file from a database by ID, not by user-supplied name
	filePath := "uploads/" + filename

	// c.Attachment() sets Content-Disposition: attachment — triggers browser download dialog
	return c.Attachment(filePath, filename)
}

func viewFile(c echo.Context) error {
	filename := c.Param("filename")
	filePath := "uploads/" + filename

	// c.Inline() sets Content-Disposition: inline — browser renders if it can
	return c.Inline(filePath, filename)
}

func serveFile(c echo.Context) error {
	// For general static file serving with cache headers
	return c.File("public/index.html")
}

func main() {
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.GET("/download/:filename", downloadFile)
	e.GET("/view/:filename", viewFile)
	e.GET("/", serveFile)

	// Serve entire directory
	e.Static("/static", "assets")

	if err := e.Start(":8080"); err != http.ErrServerClosed {
		e.Logger.Fatal(err)
	}
}