# Go Engineering Quick Reference

## Error Handling

```go
// Wrap with context
return fmt.Errorf("userRepo.FindByID %s: %w", id, err)

// Check sentinel errors (works through wrapping)
if errors.Is(err, ErrNotFound) { ... }

// Extract typed error
var dbErr *DBError
if errors.As(err, &dbErr) { ... }

// Handle once: return OR log, never both
```

## Interfaces

```go
// Small (1-2 methods), defined at consumer, not producer
type Storer interface { Store(ctx context.Context, item Item) error }

// Accept interfaces, return concrete types
func NewService(store Storer) *Service { return &Service{store: store} }
```

## Concurrency

```go
// Always pass context
func FetchUser(ctx context.Context, id string) (*User, error) { ... }

// errgroup over WaitGroup when errors matter
g, ctx := errgroup.WithContext(ctx)
g.Go(func() error { return fetchUsers(ctx) })
if err := g.Wait(); err != nil { return err }

// Goroutines need a clear exit
go func() {
  for { select { case <-ctx.Done(): return; case job := <-jobCh: process(job) } }
}()
```

## Security

```go
// crypto/rand — NEVER math/rand for security
token := make([]byte, 32)
crypto_rand.Read(token)

// Parameterized queries — NEVER string concat
db.QueryRowContext(ctx, "SELECT * FROM users WHERE id = $1", id)

// Bcrypt for passwords
hash, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
bcrypt.CompareHashAndPassword(hash, []byte(input))
```

## Constructor Pattern

```go
func NewServer(addr string, opts ...Option) (*Server, error) {
  if addr == "" { return nil, errors.New("addr required") }
  s := &Server{addr: addr, timeout: 30 * time.Second}
  for _, opt := range opts { opt(s) }
  return s, nil
}
```

## Functional Options

```go
type Option func(*Server)
func WithTimeout(d time.Duration) Option { return func(s *Server) { s.timeout = d } }
srv := NewServer(":8080", WithTimeout(60*time.Second))
```

## Graceful Shutdown

```go
go func() { e.Start(":8080") }()
quit := make(chan os.Signal, 1)
signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
<-quit
ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
defer cancel()
server.Shutdown(ctx)
```

## Patterns Quick Reference

| Pattern | When |
|---------|------|
| Functional Options | 5+ optional constructor params |
| Adapter | Wrap external/legacy type |
| Middleware/Decorator | Cross-cutting behavior |
| Worker Pool | Bounded parallelism |
| Pipeline | Stage-by-stage stream processing |
| Fan-Out/Fan-In | Parallel work + merge results |
| Consumer-Side Interface | Always — decouple without import cycles |
| Strategy | Swappable algorithms at runtime |
| Observer | Event bus with channels |
| Command | Job queues, closures as tasks |

## Anti-Patterns to Avoid

| Anti-Pattern | Fix |
|---|---|
| Global mutable state | Dependency injection |
| Ignoring errors (`_ =`) | Always handle: return, wrap, or log |
| Business logic in handlers | Thin handlers, service layer |
| SQL string concatenation | Parameterized queries |
| `math/rand` for security | `crypto/rand` |
| Goroutine leaks | Always pass ctx, select on ctx.Done() |
| Missing context | First param is always `context.Context` |
| Not closing rows | `defer rows.Close()` immediately after query |
| Log AND return error | Choose one |
| `time.Sleep` in tests | Use channels/sync primitives |