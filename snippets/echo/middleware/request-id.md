e.Use(middleware.RequestID())
// Access in handler:
// reqID := c.Response().Header().Get(echo.HeaderXRequestID)