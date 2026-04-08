go func() {
  defer wg.Done()
  for {
    select {
    case <-ctx.Done(): return // clean exit
    case job := <-jobCh: process(job)
    }
  }
}()