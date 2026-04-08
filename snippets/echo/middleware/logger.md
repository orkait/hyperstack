e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
  Format: "${method} ${uri} ${status} ${latency_human}\n",
}))