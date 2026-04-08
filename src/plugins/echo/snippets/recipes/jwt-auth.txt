package main

import (
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	echojwt "github.com/labstack/echo-jwt/v4"
)

type JWTClaims struct {
	UserID   int    `json:"user_id"`
	Username string `json:"username"`
	jwt.RegisteredClaims
}

var jwtSecret = []byte("your-secret-key-change-in-production")

func login(c echo.Context) error {
	username := c.FormValue("username")
	password := c.FormValue("password")

	// Validate credentials (use bcrypt comparison in production)
	if username != "alice" || password != "secret" {
		return echo.ErrUnauthorized
	}

	claims := &JWTClaims{
		UserID:   1,
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "myapp",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString(jwtSecret)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, map[string]string{"token": signed})
}

func profile(c echo.Context) error {
	// Claims are set by the JWT middleware
	token := c.Get("user").(*jwt.Token)
	claims := token.Claims.(*JWTClaims)
	return c.JSON(http.StatusOK, map[string]any{
		"user_id":  claims.UserID,
		"username": claims.Username,
	})
}

func main() {
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Public routes
	e.POST("/login", login)

	// Protected routes
	protected := e.Group("/api")
	protected.Use(echojwt.WithConfig(echojwt.Config{
		SigningKey:  jwtSecret,
		NewClaimsFunc: func(c echo.Context) jwt.Claims {
			return new(JWTClaims)
		},
	}))
	protected.GET("/profile", profile)

	e.Logger.Fatal(e.Start(":8080"))
}