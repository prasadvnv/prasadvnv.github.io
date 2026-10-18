@echo off
cd /d "%~dp0"
start "" http://localhost:8000
where py >nul 2>nul && (py -m http.server 8000 & goto :eof)
where python >nul 2>nul && (python -m http.server 8000 & goto :eof)
echo Python was not found. Install it from python.org, or just double-click index.html.
pause
