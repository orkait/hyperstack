e.Use(middleware.SecureWithConfig(middleware.SecureConfig{
  XSSProtection:      "1; mode=block",
  ContentTypeNosniff: "nosniff",
  XFrameOptions:      "SAMEORIGIN",
  HSTSMaxAge:         31536000,
}))