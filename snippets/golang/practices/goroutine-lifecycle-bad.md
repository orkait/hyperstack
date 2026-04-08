go func() {
  for job := range jobCh { process(job) } // what if jobCh never closes?
}()