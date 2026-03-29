test PATH='./...': set -o pipefail && go test {{PATH}} fmt -json | tparse -all

new-migration NAME: atlas migrate diff --env gorm {{NAME}}

dev: ~/go/bin/wails3 dev -port 5173

build VERSION="v0.0.1-defaultv": ~/go/bin/wails3 build -ldflags "-X mqtt-viewer/backend/env.Version={{VERSION}}"

build-pi VERSION="v0.0.1-defaultv": ~/go/bin/wails3 build -ldflags "-X mqtt-viewer/backend/env.Version={{VERSION}}"

vendor: ./scripts/apply-patches.sh

build-server VERSION="0.0.0-local": ./scripts/apply-patches.sh && cd frontend && pnpm build && GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -mod=vendor -tags server \ -ldflags "-s -w -X mqtt-viewer/backend/env.Version={{VERSION}}" \ -o "build/bin/mqtt-viewer-server-linux" .

run-server: "build/bin/mqtt-viewer-server-linux"

build-docker TAG="mqtt-viewer:latest": docker build -f Dockerfile.server -t {{TAG}} .

run-docker TAG="mqtt-viewer:latest" PORT="8080": docker run --rm -p {{PORT}}:8080 -v mqtt-viewer-data:/data {{TAG}}

compose-up: docker compose up --build

compose-down: docker compose down
