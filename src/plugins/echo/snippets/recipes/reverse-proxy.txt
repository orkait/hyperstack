package main

import (
	"net/http/httputil"
	"net/url"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Single backend target
	target, err := url.Parse("http://localhost:9090")
	if err != nil {
		e.Logger.Fatal(err)
	}

	// Using Echo's built-in proxy middleware with multiple targets (load balancing)
	targets := []*middleware.ProxyTarget{
		{URL: target},
		// Add more targets for load balancing
		// {URL: mustParse("http://localhost:9091")},
	}

	e.Use(middleware.ProxyWithConfig(middleware.ProxyConfig{
		Balancer: middleware.NewRoundRobinBalancer(targets),
	}))

	// OR: Manual proxy for specific routes only
	proxy := httputil.NewSingleHostReverseProxy(target)
	e.Any("/api/*", func(c echo.Context) error {
		proxy.ServeHTTP(c.Response(), c.Request())
		return nil
	})

	e.Logger.Fatal(e.Start(":8080"))
}