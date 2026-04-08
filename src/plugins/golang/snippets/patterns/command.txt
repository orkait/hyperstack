// Command pattern using function closures — idiomatic Go
type Job func(context.Context) error

type Worker struct {
  jobs    chan Job
  results chan error
}

func NewWorker(bufSize int) *Worker {
  return &Worker{
    jobs:    make(chan Job, bufSize),
    results: make(chan error, bufSize),
  }
}

func (w *Worker) Start(ctx context.Context) {
  go func() {
    for {
      select {
      case <-ctx.Done():
        return
      case job, ok := <-w.jobs:
        if !ok { return }
        w.results <- job(ctx)
      }
    }
  }()
}

func (w *Worker) Submit(job Job) { w.jobs <- job }

// Usage — commands are just closures
worker := NewWorker(100)
worker.Start(ctx)

worker.Submit(func(ctx context.Context) error {
  return sendEmail(ctx, "alice@example.com", "Hello")
})

worker.Submit(func(ctx context.Context) error {
  return processPayment(ctx, orderID)
})