import RPCClient from './modules/client';
import { PKAPI, type System, type Member, type Switch } from 'pkapi.js';

// CLIENT ID - change this to use your own discord app client
const clientId = '757707416719851651';

// USE DISPLAY NAME - change this to use base names instead of displaynames
const useDisplayName = true;

const client = new RPCClient();
const API = new PKAPI({
	debug: false
});

var system: System;
var latest: Switch;

// Source - https://stackoverflow.com/a/16436975
// Posted by enyo, modified by community. See post 'Timeline' for change history
// Retrieved 2026-03-13, License - CC BY-SA 4.0

function arraysEqual(a: any, b: any) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

interface Activity {
	type: number;
	status_display_type: number;
	details: string;
	details_url?: string;
	state: string;
	state_url?: string;
	startTimestamp: Date;
	instance: boolean;
	largeImageKey?: string;
	largeImageText?: string;
	smallImageKey?: string;
	smallImageText?: string;
	buttons?: Button[];
}

interface Button {
	label: string;
	url: string;
}


async function setFront() {
	try {
		if(!system) {
			system = await API.getSystem({system: client.user.id});
		}

		// BUTTONS - edit these if you want to change the buttons on the status
		const buttons: Button[] = [
			{
				label: 'Profile',
				url: `https://dash.pluralkit.me/s/${system.id}`
			},
			{
				label: 'Fronters',
				url: `https://pluralkit.xyz/f/${system.id}`
			}
		]

		// URLS - edit these if you want to change what each part of the status links to
		const URLS = {
			details: `https://pluralkit.xyz/f/${system.id}`, // link on member names
			state: `https://dash.pluralkit.me/s/${system.id}`, // link on system name
		}

		var front = await system.getFronters();
		if(!front) throw new Error("Can't get fronters");

		if(latest?.id === front.id) {
			var fmembs = Array.from((front.members as Map<string, Member>).keys());
			var lmembs = Array.from((latest.members as Map<string, Member>).keys());

			if(arraysEqual(fmembs, lmembs)) return; // don't update if it's the same switch
		}
		latest = front;

		var mArr: Member[] = Array.from((front.members as Map<string, Member>).entries() || [], ([k, v]) => v);

		var members: string = mArr.map((m: any) => {
			if(useDisplayName) return m.display_name ?? m.name;
			else return m.name;
		}).join(", ");

		if (members.length > 127) {
			members = members.slice(0, 120) + "...";
		}

		var activity: Activity = {
			type: 3,
			status_display_type: 3,
			details: members || "(none)",
			state: system.name || "---",
			details_url: URLS.details,
			state_url: URLS.state,
			startTimestamp: new Date(front.timestamp),
			instance: true,
			buttons,
		}

		// ASSETS - change these if you want to edit the images shown on the status
		if(mArr[0]?.avatar_url) {
			activity.largeImageKey = mArr[0].avatar_url;
			activity.largeImageText = mArr[0]?.display_name || mArr[0]?.name;
		}

		if(system.avatar_url) {
			activity.smallImageKey = system.avatar_url.replace('cdn.discordapp.com', 'media.discordapp.net');
			activity.smallImageText = system.name || "system";
		}

		await client.setActivity(activity);
	} catch(e: any) {
		console.error(e);
		if(e.message) {
			if(e.message == "System not found.") {
				console.error(
					"Couldn't get your system! Make sure you have a system " +
					"registered on PluralKit before using this program."
					);
				process.exit(1);
			} else if(e.message == "Can't get fronters") {
				console.error(
					"Couldn't get your current fronters! " +
					"Make sure your switch history and fronters are public " +
					"and that you have at least one registered switch before " +
					"running this program."
					);
				process.exit(1);
			}
		}
	}
}

client.on('ready', ()=> {
	setFront();

	setInterval(()=> {
		try {
			setFront()
		} catch(e: any) {
			console.log(e.message);
		}
	}, 15000);
})

process.on('SIGINT', () => process.exit(0));

var retrying = true;
var retries = 0;

async function connect() {
	while(retrying && retries < 5) {
		try {
			await client.login({ clientId, reset: true })
			console.log("RPC running!");
			retries = 0;
			retrying = false;
		} catch(e: any) {
			console.error(e.message);
			console.log("Couldn't connect to discord. Retrying in a few seconds...");
			retrying = true;
			retries += 1;
			await sleep(15000)
		}
	}

	if(retries >= 5) {
		console.error(
			"Failed connection to Discord 5 times; " +
			"program is shutting down. Make sure Discord is running before trying again."
			)
	}
}

async function sleep(ms: number) {
	return new Promise<void>((res) => {
		setTimeout(() => res(), ms ?? 1000)
	})
}

connect();