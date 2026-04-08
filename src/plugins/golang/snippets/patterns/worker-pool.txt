func WorkerPool(ctx context.Context, jobs <-chan Job, concurrency int) error {
  g, ctx := errgroup.WithContext(ctx)
  sem := make(chan struct{}, concurrency)

  for job := range jobs {
    job := job // capture
    sem <- struct{}{}
    g.Go(func() error {
      defer func() { <-sem }()
      return process(ctx, job)
    })
  }
  return g.Wait()
}