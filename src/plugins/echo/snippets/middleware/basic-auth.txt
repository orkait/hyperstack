group.Use(middleware.BasicAuth(func(username, password string, c echo.Context) (bool, error) {
  // Use constant-time comparison to prevent timing attacks
  if subtle.ConstantTimeCompare([]byte(username), []byte("admin")) == 1 &&
     subtle.ConstantTimeCompare([]byte(password), []byte("secret")) == 1 {
    return true, nil
  }
  return false, nil
}))
