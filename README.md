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
**Edits are no longer needed to make avatars work!** This program will instead use the avatars set up in PK. This *should* thankfully work out of the box!

Note that if you have multiple fronters, *only the first one* will show up in terms of their avatar. For example, if you have a fronter list that looks like `Jake, John, Jerry`, then only Jake's avatar will show up (alongside your system avatar, if set up)

## Caveats
*This app won't work if your fronters are privated.* In order for the app to see your fronters, it'd need your app token. If you'd like to make modifications in order for the program to accept a token, feel free- however, this app focuses on using already public information, given that you'll be using this to broadcast who's fronting in your Discord status.

Another caveat is that this program may not update immediately. It runs on a clock cycle that updates every few seconds, so if you switch and don't see immediate changes, please be patient.

## Support
If you need help with this, feel free to DM us @ (GS)#6969 on Discord or join our bot support server [here](https://discord.gg/EvDmXGt)

If you'd like to support us, the devs, you can buy us a Ko-Fi [here](https://ko-fi.com/greysdawn) or consider becoming a Patron [here](https://patreon.com/greysdawn).
