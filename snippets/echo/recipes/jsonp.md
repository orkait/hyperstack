package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func dataHandler(c echo.Context) error {
	data := map[string]string{"message": "hello", "status": "ok"}

	// c.JSONP() wraps JSON in a callback function for cross-domain requests
	// The callback name is read from the query param (default: "callback")
	// e.g. GET /data?callback=myFunc → myFunc({"message":"hello",...})
	callback := c.QueryParam("callback")
	if callback == "" {
		// Fallback to regular JSON if no callback specified
		return c.JSON(http.StatusOK, data)
	}
	return c.JSONP(http.StatusOK, callback, data)
}

func main() {
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.GET("/data", dataHandler)

	e.Logger.Fatal(e.Start(":8080"))
}