// External type you don't control
type ThirdPartyLogger struct { ... }
func (l *ThirdPartyLogger) LogMessage(msg string) { ... }

// Your interface
type Logger interface { Log(ctx context.Context, msg string) }

// Adapter wraps it
type loggerAdapter struct { inner *ThirdPartyLogger }
func (a *loggerAdapter) Log(_ context.Context, msg string) { a.inner.LogMessage(msg) }

func NewLogger(inner *ThirdPartyLogger) Logger {
  return &loggerAdapter{inner: inner}
}