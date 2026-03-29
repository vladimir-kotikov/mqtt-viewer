package main

import (
	"embed"
	"log/slog"
	"mqtt-viewer/backend/app"
	"mqtt-viewer/backend/env"
	"mqtt-viewer/events"

	"github.com/wailsapp/wails/v3/pkg/application"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	setupPanicWrap()

	appInstance := app.NewApp(app.AppModes.Wails, env.Version)
	connectionEvents := events.NewConnectionEvents()

	wailsApp := application.New(application.Options{
		Name: "MQTT Viewer",
		Services: []application.Service{
			application.NewService(appInstance),
			application.NewService(connectionEvents),
		},
		Assets: application.AssetOptions{
			Handler: application.AssetFileServerFS(assets),
		},
		Server: application.ServerOptions{
			Host: "localhost",
			Port: 8080,
		},
	})

	appInstance.SetWailsApp(wailsApp)
	setupWindows(wailsApp)

	err := wailsApp.Run()
	if err != nil {
		slog.Error(err.Error())
		panic(err)
	}
}
