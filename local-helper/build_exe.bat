@echo off
echo Installing dependencies...
pip install -r requirements.txt

echo Building executable...
pyinstaller --onefile --name SteamCompatScanner scanner.py

echo Build complete! Executable is in the dist folder.
pause
