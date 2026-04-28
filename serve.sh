#!/usr/bin/env bash
# Start a local HTTP server for the portfolio site
# Usage: ./serve.sh [port]
# Default port: 8080

PORT="${1:-8080}"
cd "$(dirname "$0")"

echo "Starting server on http://localhost:${PORT}"
echo "Press Ctrl+C to stop"
python3 -m http.server "$PORT"
