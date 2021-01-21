#! /bin/bash
# NOT TESTED. please report any problems to us

if ! command -v node &> /dev/null
then
    curl https://nodejs.org/dist/v14.15.4/node-v14.15.4.pkg -o node.pkg
	installer -pkg node.pkg -target CurrentUserHomeDirectory
	rm node.pkg
fi

if [ ! -d "./node_modules" ]
then
	echo "Installing dependencies..."
	npm install
	echo "Installation done!" 
fi

echo "Starting RPC..."
node index.js