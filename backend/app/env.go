package app

import "mqtt-viewer/backend/env"

type EnvInfo struct {
	IsDev         bool   `json:"isDev"`
	IsServer      bool   `json:"isServer"`
	ServerAddress string `json:"serverAddress"`
	Version       string `json:"version"`
}

func (a *App) GetEnvInfo() EnvInfo {
	return EnvInfo{
		IsDev:         env.IsDev,
		IsServer:      env.IsServer,
		ServerAddress: env.ServerAddress,
		Version:       env.Version,
	}
}
