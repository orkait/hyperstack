e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
  AllowOrigins: []string{"https://example.com"},
  AllowMethods: []string{echo.GET, echo.POST, echo.PUT, echo.DELETE},
}))