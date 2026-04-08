// Fan-out: distribute work across multiple goroutines
func fanOut(in <-chan int, workers int) []<-chan int {
  channels := make([]<-chan int, workers)
  for i := 0; i < workers; i++ {
    channels[i] = worker(in)
  }
  return channels
}

func worker(in <-chan int) <-chan int {
  out := make(chan int)
  go func() {
    defer close(out)
    for n := range in {
      out <- n * n // do work
    }
  }()
  return out
}

// Fan-in: merge multiple channels into one
func fanIn(channels ...<-chan int) <-chan int {
  out := make(chan int)
  var wg sync.WaitGroup

  for _, ch := range channels {
    wg.Add(1)
    go func(c <-chan int) {
      defer wg.Done()
      for n := range c { out <- n }
    }(ch)
  }

  go func() { wg.Wait(); close(out) }()
  return out
}

// Usage
source := generate(1, 2, 3, 4, 5, 6, 7, 8)
workers := fanOut(source, 4)
results := fanIn(workers...)
for r := range results { fmt.Println(r) }