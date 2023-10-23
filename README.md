# PluralKit RPC
A rich presence client for PluralKit users.

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
**Edits *may* be needed to make avatars work!** If your avatars are hosted on Discord, you'll need to edit the program to make them work. Here's what to do:
1. Go to the [Discord developers website](https://discord.com/developers/applications) and create a new application. Name it whatever you'd like
  - ![Guide image 1, showing the url and button to press to set up the application](https://cdn.greysdawn.com/6418.jpeg)
2. Navigate to your application (this should be done automatically, but if not, simply select it in the list of applications)
3. In the sidebar, find the option for "Rich Presence." Clicking this should navigate to the assets page automatically, but if not, select that one
  - If you don't see the sidebar, you'll need to click the 3 bars in the top left of the page
  - ![Guide image 2, showing the Rich Presence option](https://cdn.greysdawn.com/c665.jpeg)
  - ![Guide image 3, showing the Art Assets option below the Rich Presence option](https://cdn.greysdawn.com/7208.jpeg)
4. After the first section of the page, you should see a button to upload assets (NOT the invite image). You can use this to upload your members' icons
  - Keep in mind that you can only have up to 300 assets uploaded at once
  - You should rename the uploads to use your members' IDs, rather than name. This way they'll always be unique
  - If you'd like a system icon as well, upload an asset called "system"
  - ![Guide image 4, showing the button to upload assets and underlining the 300 image limit](https://cdn.greysdawn.com/0268.jpeg)
  - ![Guide image 5, showing a system member icon named with their ID along with a system icon named "system"](https://cdn.greysdawn.com/4daf.jpeg)
5. Make the following changes to the `index.js` file:
  - Change the client ID on line 5 to be your app's ID (found under the application sidebar: OAuth2 > "Client ID")
  - Delete the `/*` and `*/` on lines 38 and 43(/42 if you delete 38 first)
  - Delete or comment out (add the two symbols from before above and below that block) the lines below the comment on line 46 and above the comment that says to stop

After that, restart the RPC and you should have avatars show up when someone is fronting!

Note that if you have multiple fronters, **only the first one will show up** in terms of their avatar. For example, if you have a fronter list that looks like `Jake, John, Jerry`, then only Jake's avatar will show up (alongside your system avatar, if set up)

## Caveats
**This app won't work if your fronters are privated.** In order for the app to see your fronters, it'd need your PK token. If you'd like to make modifications in order for the program to accept a token, feel free- however, this app focuses on using already public information, given that you'll be using this to broadcast who's fronting in your Discord status.

Another caveat is that this program may not update immediately. It runs on a clock cycle that updates every few seconds, so if you switch and don't see immediate changes, please be patient.

## Support
If you need help with this, feel free to DM us @/greysdawn on Discord or join our bot support server [here](https://discord.gg/EvDmXGt)

If you'd like to support *us*, the devs, you can buy us a Ko-Fi [here](https://ko-fi.com/greysdawn) or consider becoming a Patron [here](https://patreon.com/greysdawn).
