//go:build !server

package env

// IsServer is false for normal desktop builds.
var IsServer = false
