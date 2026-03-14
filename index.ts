import RPCClient from './modules/client';
import { PKAPI, type System, type Member, type Switch } from 'pkapi.js';

// CHANGE THIS if setting up your own icons
const clientId = '757707416719851651';

const useDisplayName = true

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

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

interface Activity {
	details: string;
	state: string;
	startTimestamp: Date;
	instance: boolean;
	largeImageKey?: string;
	largeImageText?: string;
	smallImageKey?: string;
	smallImageText?: string;
}


async function setFront() {
	try {
		if(!system) {
			system = await API.getSystem({system: client.user.id});
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
			if(useDisplayName) return m.display_name ?? m.name
				else return m.name;
		}).join(", ");

		if (members.length > 127 && useDisplayName) {
			members = mArr.map((m: any) => m.name).join(", ");
		}

		if (members.length > 127) {
			members = members.slice(0, 120) + "...";
		}

		var activity: Activity = {
			details: members || "(none)",
			state: system.name || "---",
			startTimestamp: new Date(front.timestamp),
			instance: false,

			// uncomment BELOW if setting up your own avatars
			/*
			largeImageKey: front.members[0]?.id,
			largeImageText: front.members[0]?.display_name || front.members[0]?.name,
			smallImageKey: "system",
			smallImageText: system.name ?? "system"
			*/
		}

		// COMMENT OUT/REMOVE below if setting up your own avatars
		if(mArr[0]?.avatar_url) {
			activity.largeImageKey = mArr[0].avatar_url.replace('cdn.discordapp.com', 'media.discordapp.net');
			activity.largeImageText = mArr[0]?.display_name || mArr[0]?.name;
		}

		if(system.avatar_url) {
			activity.smallImageKey = system.avatar_url.replace('cdn.discordapp.com', 'media.discordapp.net');
			activity.smallImageText = system.name || "system";
		}
		// COMMENT BLOCK ENDS HERE- don't get rid of anything else!

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