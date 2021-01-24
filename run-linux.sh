#! /bin/bash

if ! command -v node &> /dev/null
then
    echo "Installing node..."
    packagesNeeded='node npm'
    if [ -x "$(command -v apk)" ];	 then sudo apk add --no-cache $packagesNeeded
    elif [ -x "$(command -v apt-get)" ]; then sudo apt-get install $packagesNeeded
    elif [ -x "$(command -v dnf)" ];	 then sudo dnf install $packagesNeeded
    elif [ -x "$(command -v zypper)" ];	 then sudo zypper install $packagesNeeded
    elif [ -x "$(command -v yum)" ];	 then sudo yum install $packagesNeeded
    elif [ -x "$(command -v pacman)" ];	 then sudo pacman install $packagesNeeded
    else echo "FAILED TO INSTALL PACKAGE: Package manager not found. You must manually install: $packagesNeeded">&2; fi

    echo "Installation done!"
fi

if [ ! -d "./node_modules" ]
then
    echo "Installing dependencies..."
    npm install
    echo "Installation done!" 
fi

echo "Starting RPC..."
node index.js
