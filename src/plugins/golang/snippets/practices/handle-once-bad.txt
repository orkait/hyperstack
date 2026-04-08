if err != nil {
  log.Printf("error: %v", err)
  return err // logged AND returned — duplicate log entry upstream
}