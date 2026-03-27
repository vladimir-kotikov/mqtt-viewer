package app

import (
	"context"
	db "mqtt-viewer/backend/db"
	eventRuntime "mqtt-viewer/backend/event-runtime"
	"mqtt-viewer/backend/mqtt"
	"mqtt-viewer/backend/paths"
	"mqtt-viewer/backend/protobuf"
	topicmatching "mqtt-viewer/backend/topic-matching"
	"mqtt-viewer/backend/update"
	"mqtt-viewer/events"

	"github.com/wailsapp/wails/v3/pkg/application"
)

type App struct {
	wailsApp       *application.App
	Mode           AppMode
	Paths          paths.Paths
	Db             *db.DB
	EventRuntime   *eventRuntime.EventRuntime
	Events         *events.ConnectionEvents
	Version        string
	AppConnections map[uint]*AppConnection
	Updater        *update.Updater
	ProtoRegistry  *protobuf.ProtoRegistry
}

type AppConnection struct {
	ctx                 *context.Context
	ConnectionId        uint
	MqttManager         *mqtt.MqttManager
	SubscriptionMatcher *topicmatching.SubscriptionMatcher
	MqttMessageBuffer   *mqtt.MessageBuffer
	EventSet            *events.ConnectionEventsSet
}

func NewApp(appMode AppMode, version string) *App {
	return &App{
		Mode:    appMode,
		Version: version,
	}
}

// SetWailsApp stores the Wails application reference. Must be called before app.Run().
func (a *App) SetWailsApp(wailsApp *application.App) {
	a.wailsApp = wailsApp
}
