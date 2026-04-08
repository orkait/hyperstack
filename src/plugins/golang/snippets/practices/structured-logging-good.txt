import "log/slog"

// Setup: JSON in production, text in development
func NewLogger(env string) *slog.Logger {
  if env == "production" {
    return slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
      Level: slog.LevelInfo,
    }))
  }
  return slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{
    Level: slog.LevelDebug,
  }))
}

// Usage: structured key-value pairs, not format strings
logger.Info("user created",
  slog.String("user_id", user.ID),
  slog.String("email", user.Email),
  slog.Duration("latency", time.Since(start)),
)

// With context for trace propagation
logger.InfoContext(ctx, "request completed",
  slog.Int("status", statusCode),
  slog.String("path", r.URL.Path),
)