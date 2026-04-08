e.Use(middleware.GzipWithConfig(middleware.GzipConfig{
  Level: 5, // 1=fast, 9=best compression
}))