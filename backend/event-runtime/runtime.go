package eventRuntime

import (
	"github.com/wailsapp/wails/v3/pkg/application"
)

type EventRuntime struct {
	app                 *application.App
	listenerCancelFuncs map[string]func()
}

func InitEventRuntime(app *application.App) *EventRuntime {
	return &EventRuntime{
		app:                 app,
		listenerCancelFuncs: map[string]func(){},
	}
}

func (e *EventRuntime) EventsEmit(
	eventName string,
	optionalData ...interface{},
) {
	// In Wails v3, events are emitted via the application's Event property
	if len(optionalData) > 0 {
		e.app.Event.Emit(eventName, optionalData...)
	} else {
		e.app.Event.Emit(eventName)
	}
}

func (e *EventRuntime) EventsOn(
	eventName string,
	callback func(optionalData ...interface{}),
	key string,
) {
	cancelFunc := e.app.Event.On(eventName, func(event *application.CustomEvent) {
		if event.Data != nil {
			// Convert event data to slice if needed
			if data, ok := event.Data.([]interface{}); ok {
				callback(data...)
			} else {
				callback(event.Data)
			}
		} else {
			callback()
		}
	})
	e.listenerCancelFuncs[key] = cancelFunc
}

func (e *EventRuntime) EventsOff(
	eventName string,
	additionalEventNames ...string,
) {
	// In Wails v3, use the Off method
	e.app.Event.Off(eventName)
	for _, name := range additionalEventNames {
		e.app.Event.Off(name)
	}
}

func (e *EventRuntime) EventsOffKey(
	key string,
) {
	cancelFunc := e.listenerCancelFuncs[key]
	if cancelFunc != nil {
		cancelFunc()
		delete(e.listenerCancelFuncs, key)
	}
}
