# PluralKit RPC
A rich presence client for RPC users.

This program will get your currently fronting system member and show it in your Discord status. Make sure you run the program on the same machine as your Discord client in order for it to work.

## How to use
### Automatic way
*This involves letting the included .bat and .sh files work their magic.*
1. Download this repo and extract it somewhere
2. Run whatever file suits your system
	- Windows: `run.bat`
	- Mac: `run-mac.sh`
	- Linux: `run-linux.sh`
3. That's it :)

### Manual way
*This means doing everything by hand. Make sure you're comfortable with a terminal/command prompt*
1. Install Nodejs from [this link](https://nodejs.org/en/download/)
2. Download this repo and extract it somewhere handy
3. Install dependencies with `npm install` in the root folder, using your preferred terminal
4. Use `node index` to run the program

## Adding avatars
*This will allow your members' avatars to show up in the fronting list. Note that only the first fronter in the list will have their avatar shown*
1. Go to the [Discord developers area](https://discord.com/developers/applications)
2. Click the button at the top right that says to create a new application, following the prompt that comes up
3. Once it's created, navigate to it and go to the "Rich Presence" tab, then "art assets"
4. Start uploading icons. **Make sure they're named to match your members' IDs**
5. Once you're done, go back to the "General Information" tab. Click the button to copy the application's ID (below the description box)
6. Open up the `index.js` file you downloaded in a program like Notepad. Find the line that looks like [this](https://github.com/greysdawn/pk-rpc/blob/master/index.js#L4) and replace the numbers at the end with your new client ID
7. Find [these](https://github.com/greysdawn/pk-rpc/blob/master/index.js#L33-L36) lines and remove the `//` on each line. Do NOT touch the one that says "uncomment BELOW"
8. Save the file, restart the program, and you should be all set!

## Caveats
*This app won't work if your fronters are privated.* In order for the app to see your fronters, it'd need your app token. If you'd like to make modifications in order for the program to accept a token, feel free- however, this app focuses on using already public information, given that you'll be using this to broadcast who's fronting in your Discord status.

Another caveat is that this program may not update immediately. It runs on a clock cycle that updates every few seconds, so if you switch and don't see immediate changes, please be patient.

## Support
If you need help with this, feel free to DM us @ (GS)#6969 on Discord or join our bot support server [here](https://discord.gg/EvDmXGt)

If you'd like to support us, the devs, you can buy us a Ko-Fi [here](https://ko-fi.com/greysdawn) or consider becoming a Patron [here](https://patreon.com/greysdawn).
