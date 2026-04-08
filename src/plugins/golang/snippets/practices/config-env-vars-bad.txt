// ❌ Scattered os.Getenv calls throughout the codebase
func ConnectDB() *sql.DB {
  dsn := os.Getenv("DATABASE_URL") // no validation — empty string silently fails
  db, _ := sql.Open("postgres", dsn)
  return db
}

func GetJWTSecret() string {
  return os.Getenv("JWT_SECRET") // could return empty string
}