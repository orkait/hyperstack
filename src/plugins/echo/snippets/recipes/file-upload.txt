package main

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func uploadFile(c echo.Context) error {
	// Retrieve the file from form data
	file, err := c.FormFile("file")
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "file is required")
	}

	// Validate file size (10 MB limit)
	if file.Size > 10<<20 {
		return echo.NewHTTPError(http.StatusRequestEntityTooLarge, "file too large")
	}

	// Open the uploaded file
	src, err := file.Open()
	if err != nil {
		return err
	}
	defer src.Close()

	// Create destination file — sanitize the filename
	safeFilename := filepath.Base(file.Filename)
	dst, err := os.Create(fmt.Sprintf("uploads/%s", safeFilename))
	if err != nil {
		return err
	}
	defer dst.Close()

	// Copy content
	if _, err = io.Copy(dst, src); err != nil {
		return err
	}

	return c.JSON(http.StatusOK, map[string]string{
		"filename": safeFilename,
		"size":     fmt.Sprintf("%d bytes", file.Size),
	})
}

func main() {
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Limit request body size at middleware level
	e.Use(middleware.BodyLimit("10M"))

	e.POST("/upload", uploadFile)

	// Ensure upload directory exists
	os.MkdirAll("uploads", 0755)

	e.Logger.Fatal(e.Start(":8080"))
}