//go:build server

package app

import "errors"

var errNotAvailableInServerMode = errors.New("not available in server mode")

func (a *App) ChooseCertFile(_ string) (string, error) {
	return "", errNotAvailableInServerMode
}

func (a *App) ChooseDirectory(_ string) (string, error) {
	return "", errNotAvailableInServerMode
}
