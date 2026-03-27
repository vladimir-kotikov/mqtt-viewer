test PATH='./...': set -o pipefail && go test {{PATH}} fmt -json | tparse -all

new-migration NAME: atlas migrate diff --env gorm {{NAME}}

dev: ~/go/bin/wails3 dev -port 5173

build VERSION="v0.0.1-defaultv": ~/go/bin/wails3 build -ldflags "-X mqtt-viewer/backend/env.Version={{VERSION}}"

build-pi VERSION="v0.0.1-defaultv": ~/go/bin/wails3 build -ldflags "-X mqtt-viewer/backend/env.Version={{VERSION}}"

build-server VERSION="v0.0.1-defaultv": go build -tags server -ldflags "-X mqtt-viewer/backend/env.Version={{VERSION}}" -o "build/bin/MQTT Viewer Server" .

run-server: "build/bin/MQTT Viewer Server"
