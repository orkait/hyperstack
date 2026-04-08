e.Use(middleware.KeyAuthWithConfig(middleware.KeyAuthConfig{
  KeyLookup: "header:X-API-Key",
  Validator: func(key string, c echo.Context) (bool, error) {
    return key == os.Getenv("API_KEY"), nil
  },
}))
