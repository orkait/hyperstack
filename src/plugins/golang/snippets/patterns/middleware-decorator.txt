type Handler func(ctx context.Context, req Request) (Response, error)

func WithLogging(next Handler) Handler {
  return func(ctx context.Context, req Request) (Response, error) {
    start := time.Now()
    resp, err := next(ctx, req)
    log.Printf("req=%v duration=%v err=%v", req, time.Since(start), err)
    return resp, err
  }
}

func WithAuth(next Handler) Handler {
  return func(ctx context.Context, req Request) (Response, error) {
    if !isAuthorized(ctx) { return Response{}, ErrUnauthorized }
    return next(ctx, req)
  }
}

// Stack middleware
handler := WithLogging(WithAuth(actualHandler))