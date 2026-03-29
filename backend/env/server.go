//go:build server

package env

// IsServer is true when the binary is built with -tags server (Docker / web mode).
var IsServer = true
