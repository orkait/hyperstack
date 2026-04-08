func NewServer(addr string, timeout time.Duration) (*Server, error) {
  if addr == "" { return nil, errors.New("addr required") }
  if timeout <= 0 { timeout = 30 * time.Second }
  return &Server{addr: addr, timeout: timeout}, nil
}