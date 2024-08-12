@echo off
cd /D "%~dp0"

where node.exe >nul 2>nul
if not %errorlevel%==0 (
	echo Downloading node...
	call bitsadmin /cancel node_download >nul
	call bitsadmin /create node_download >nul
	call bitsadmin /addfile node_download "https://nodejs.org/dist/v14.15.4/node-v14.15.4-x64.msi" "%~dp0\node.msi" >nul
	call bitsadmin /resume node_download >nul
	goto repeat
) else goto npm

:repeat
bitsadmin /info node_download /verbose | find  "STATE: TRANSFERRED" >nul 2>&1 && goto :finished
goto repeat

:finished
call bitsadmin /complete node_download >nul
echo Download completed! Installing...
call ".\node.msi"
echo Installation completed!
del ".\node.msi"

:npm
if NOT EXIST ".\node_modules\" (
	echo Installing deps...
	call npm install
	echo Installation done!
)

echo Starting RPC...
node index.js
pause
