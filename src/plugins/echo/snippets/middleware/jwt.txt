import echojwt "github.com/labstack/echo-jwt/v4"

group.Use(echojwt.WithConfig(echojwt.Config{
  SigningKey: []byte("secret"),
}))