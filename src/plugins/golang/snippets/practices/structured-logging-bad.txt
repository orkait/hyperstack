// ❌ Unstructured log.Printf — hard to parse, search, or alert on
log.Printf("user %s created with email %s in %v", userID, email, latency)

// ❌ log.Fatal in a library — kills the whole process
func (r *Repo) Connect() {
  db, err := sql.Open("postgres", dsn)
  if err != nil {
    log.Fatal(err) // never use Fatal in libraries
  }
}