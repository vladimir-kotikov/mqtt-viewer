//go:build !server

package main

import (
	"log/slog"
	"mqtt-viewer/backend/env"
	"os"

	"github.com/mitchellh/panicwrap"
	"github.com/wailsapp/wails/v3/pkg/application"
)

func setupPanicWrap() {
	if !env.IsDev {
		exitStatus, err := panicwrap.BasicWrap(panicHandler)
		if err != nil {
			panic(err)
		}
		if exitStatus >= 0 {
			os.Exit(exitStatus)
		}
	}
}

func setupWindows(wailsApp *application.App) {
	wailsApp.Window.NewWithOptions(application.WebviewWindowOptions{
		Title:     "MQTT Viewer",
		Width:     900,
		Height:    700,
		MinWidth:  825,
		MinHeight: 660,
		Mac: application.MacWindow{
			TitleBar:                application.MacTitleBarHiddenInset,
			InvisibleTitleBarHeight: 28,
		},
		BackgroundColour: application.NewRGBA(35, 33, 32, 255),
	})
}

func panicHandler(output string) {
	slog.Error("panic occurred")
	slog.Error(output)
	os.Exit(1)
}
