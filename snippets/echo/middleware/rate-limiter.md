import "golang.org/x/time/rate"

e.Use(middleware.RateLimiterWithConfig(middleware.RateLimiterConfig{
  Skipper: middleware.DefaultSkipper,
  Store: middleware.NewRateLimiterMemoryStoreWithConfig(
    middleware.RateLimiterMemoryStoreConfig{
      Rate:      rate.Limit(10), // 10 req/s
      Burst:     30,
      ExpiresIn: 3 * time.Minute,
    },
  ),
  IdentifierExtractor: func(ctx echo.Context) (string, error) {
    id := ctx.RealIP()
    return id, nil
  },
  ErrorHandler: func(context echo.Context, err error) error {
    return context.JSON(http.StatusTooManyRequests, map[string]string{"error": "rate limit exceeded"})
  },
  DenyHandler: func(context echo.Context, identifier string, err error) error {
    return context.JSON(http.StatusTooManyRequests, map[string]string{"error": "rate limit exceeded"})
  },
}))