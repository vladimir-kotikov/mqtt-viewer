package env

import (
	"fmt"
	"log/slog"
	"mqtt-viewer/backend/machine"
	"os"
	"strings"
)

var (
	IsDev                  = true
	ServerAddress          = "http://localhost:8090"
	Version                = "0.0.0-dev"
	MachineIdProtectString = "dev-protect-string" // Hashes the machine id to protect anonymity
	MachineId              = ""
	CloudUsername          = "dev-username"
	CloudPassword          = "dev-password"
	IsAppImage             = "false"
)

func init() {
	if !strings.Contains(Version, "-dev") {
		IsDev = false
	}
	if !IsDev {
		ServerAddress = "https://cloud.mqttviewer.app"
		slog.Info("running in prod mode")
	} else {
		slog.Info("running in dev mode")
	}
	if MachineIdProtectString == "" {
		panic("MachineIdProtectString must be set")
	}
	mid, err := machine.GetMachineId(MachineIdProtectString)
	if err != nil {
		// Fallback for environments without /etc/machine-id (e.g. Alpine containers).
		// Allow explicit override via env var; otherwise derive from hostname.
		if envMid := os.Getenv("MQTT_VIEWER_MACHINE_ID"); envMid != "" {
			MachineId = envMid
		} else {
			hostname, _ := os.Hostname()
			if hostname == "" {
				hostname = "unknown-machine"
			}
			MachineId = hostname
			slog.Warn(fmt.Sprintf("machine ID unavailable (%v), using hostname as fallback: %s", err, hostname))
		}
	} else {
		MachineId = mid
	}

	slog.Info(fmt.Sprintf("using server address %s", ServerAddress))
}
