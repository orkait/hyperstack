type Option func(*Server)

func WithTimeout(d time.Duration) Option {
  return func(s *Server) { s.timeout = d }
}
func WithMaxConns(n int) Option {
  return func(s *Server) { s.maxConns = n }
}

func NewServer(addr string, opts ...Option) *Server {
  s := &Server{addr: addr, timeout: 30 * time.Second, maxConns: 100}
  for _, opt := range opts { opt(s) }
  return s
}

// Usage
srv := NewServer(":8080", WithTimeout(60*time.Second), WithMaxConns(200))