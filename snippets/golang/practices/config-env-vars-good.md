// Load typed config from environment variables at startup
type Config struct {
  Port        string        `env:"PORT,required"`
  DatabaseURL string        `env:"DATABASE_URL,required"`
  JWTSecret   string        `env:"JWT_SECRET,required"`
  LogLevel    string        `env:"LOG_LEVEL" envDefault:"info"`
  Timeout     time.Duration `env:"REQUEST_TIMEOUT" envDefault:"30s"`
}

func LoadConfig() (*Config, error) {
  var cfg Config
  if err := env.Parse(&cfg); err != nil {
    return nil, fmt.Errorf("config: %w", err)
  }
  return &cfg, nil
}

func main() {
  cfg, err := LoadConfig()
  if err != nil {
    log.Fatalf("failed to load config: %v", err)
  }
  // Pass cfg to constructors — never use os.Getenv() deep in the code
  db := NewDB(cfg.DatabaseURL)
  srv := NewServer(cfg.Port, db)
  srv.Run()
}