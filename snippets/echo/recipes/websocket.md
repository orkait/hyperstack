package main

import (
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"golang.org/x/net/websocket"
)

func wsHandler(c echo.Context) error {
	websocket.Handler(func(ws *websocket.Conn) {
		defer ws.Close()

		for {
			// Read message
			msg := ""
			if err := websocket.Message.Receive(ws, &msg); err != nil {
				c.Logger().Error("ws receive:", err)
				break
			}

			// Echo the message back
			reply := fmt.Sprintf("echo: %s", msg)
			if err := websocket.Message.Send(ws, reply); err != nil {
				c.Logger().Error("ws send:", err)
				break
			}
		}
	}).ServeHTTP(c.Response(), c.Request())
	return nil
}

// Using gorilla/websocket (more common in production):
// import "github.com/gorilla/websocket"
//
// var upgrader = websocket.Upgrader{
//     CheckOrigin: func(r *http.Request) bool { return true },
// }
//
// func wsHandler(c echo.Context) error {
//     ws, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
//     if err != nil {
//         return err
//     }
//     defer ws.Close()
//
//     for {
//         mt, msg, err := ws.ReadMessage()
//         if err != nil {
//             break
//         }
//         if err := ws.WriteMessage(mt, msg); err != nil {
//             break
//         }
//     }
//     return nil
// }

func main() {
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.GET("/ws", wsHandler)
	e.Static("/", "public")

	e.Logger.Fatal(e.Start(":8080"))
}