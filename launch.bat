@echo off
title Fourth Wing: Codex Oculus — 3D X-Ray Archive Server
echo Starting Fourth Wing: Codex Oculus 3D X-Ray Archive on http://localhost:8080 ...
start "" "http://localhost:8080"
python -m http.server 8080
