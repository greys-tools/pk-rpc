# PluralKit RPC
A rich presence client for PluralKit users.

This program will get your currently fronting system member(s) and show them in your Discord status. Make sure you run the program on the same machine as your Discord client in order for it to work.

## How to use
### Automatic way
1. Download the file for your operating system from the [releases page](https://github.com/greys-tools/pk-rpc/releases/latest)
2. Run that file and it should Just Work(TM)!

### Manual way
*This means doing everything by hand. Make sure you're comfortable with a terminal/command prompt*
1. Install Bun from [here](https://bun.com)
2. Download this repo and extract it somewhere handy
3. Install dependencies with `bun install` in the root folder, using your preferred terminal
4. Use `bun run index.ts` to run the program

## Making changes
Making changes requires you to run things the manual way, but with edits made to the `index.ts` file.

If you want to build the new version as a single-file executable for ease of use, you can use `bun run build:[os]` to do so! You can check the [package.json](https://github.com/greys-tools/pk-rpc/blob/main/package.json) file for valid script/OS names.

## Caveats
**This app won't work if your fronters are privated.** In order for the app to see private fronters, it'd need your PK token. If you'd like to make modifications in order for the program to accept a token, feel free- however, this app focuses on using already public information, given that you'll be using this to broadcast who's fronting in your Discord status.

Another caveat is that this program may not update immediately. It runs on a clock cycle that updates every few seconds, so if you switch and don't see immediate changes, please be patient.

## Support
If you need help with this, feel free to DM us @/greysdawn on Discord or join our bot support server [here](https://discord.gg/EvDmXGt)

If you'd like to support *us*, the devs, you can buy us a Ko-Fi [here](https://ko-fi.com/selenated) or consider becoming a Patron [here](https://patreon.com/selenated).
