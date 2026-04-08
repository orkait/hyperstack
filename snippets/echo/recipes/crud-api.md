package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type User struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

var users = map[int]User{
	1: {ID: 1, Name: "Alice", Email: "alice@example.com"},
}
var nextID = 2

func getUsers(c echo.Context) error {
	list := make([]User, 0, len(users))
	for _, u := range users {
		list = append(list, u)
	}
	return c.JSON(http.StatusOK, list)
}

func getUser(c echo.Context) error {
	id := 0
	if err := echo.PathParamsBinder(c).Int("id", &id).BindError(); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid id")
	}
	u, ok := users[id]
	if !ok {
		return echo.NewHTTPError(http.StatusNotFound, "user not found")
	}
	return c.JSON(http.StatusOK, u)
}

func createUser(c echo.Context) error {
	u := new(User)
	if err := c.Bind(u); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	if err := c.Validate(u); err != nil {
		return err
	}
	u.ID = nextID
	nextID++
	users[u.ID] = *u
	return c.JSON(http.StatusCreated, u)
}

func updateUser(c echo.Context) error {
	id := 0
	if err := echo.PathParamsBinder(c).Int("id", &id).BindError(); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid id")
	}
	if _, ok := users[id]; !ok {
		return echo.NewHTTPError(http.StatusNotFound, "user not found")
	}
	u := new(User)
	if err := c.Bind(u); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	u.ID = id
	users[id] = *u
	return c.JSON(http.StatusOK, u)
}

func deleteUser(c echo.Context) error {
	id := 0
	if err := echo.PathParamsBinder(c).Int("id", &id).BindError(); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid id")
	}
	delete(users, id)
	return c.NoContent(http.StatusNoContent)
}

func main() {
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.GET("/users", getUsers)
	e.POST("/users", createUser)
	e.GET("/users/:id", getUser)
	e.PUT("/users/:id", updateUser)
	e.DELETE("/users/:id", deleteUser)

	e.Logger.Fatal(e.Start(":8080"))
}