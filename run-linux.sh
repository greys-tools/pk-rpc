#! /bin/bash

if ! command -v node &> /dev/null
then
    apt update && apt install node npm
fi

if [ ! -d "./node_modules" ]
then
	echo "Installing dependencies..."
	npm install
	echo "Installation done!" 
fi

echo "Starting RPC..."
node index.js