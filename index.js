const DiscordRPC = require('discord-rpc');
const PKAPI = require('pkapi.js').default;

// CHANGE THIS if setting up your own icons
const clientId = '757707416719851651';

const useDisplayName = true

DiscordRPC.register(clientId);
const client = new DiscordRPC.Client({transport: 'ipc'});

const API = new PKAPI({
	debug: false
});

var system;

async function setFront() {
	try {
		if(!system) {
			system = await API.getSystem({system: client.user.id});
		}

		var front = await system.getFronters();
		if(!front) throw new Error("Can't get fronters")
		front.members = Array.from(front.members, ([k, v]) => v);

        var members = front.members.map(m => {
        	if(useDisplayName) return m.display_name ?? m.name
        	else return m.name
    	}).join(", ");

		if (members.length > 127 && useDisplayName) {
			members = front.members.map(m => m.name).join(", ");
		}

		if (members.length > 127) {
			members = members.slice(0, 120) + "...";
		}

		var activity = {
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
		if(front.members[0]?.avatar_url) {
			activity.largeImageKey = front.members[0].avatar_url.replace('cdn.discordapp.com', 'media.discordapp.net');
			activity.largeImageText = front.members[0]?.display_name || front.members[0]?.name;
		}

		if(system.avatar_url) {
			activity.smallImageKey = system.avatar_url.replace('cdn.discordapp.com', 'media.discordapp.net');
			activity.smallImageText = system.name || "system";
		}
		// COMMENT BLOCK ENDS HERE- don't get rid of anything else!

		await client.setActivity(activity);
	} catch(e) {
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
			} else console.error(e.message);
		} else console.error(e);
		// process.exit(1);
	}
}

client.on('ready', ()=> {
	setFront();

	setInterval(()=> {
		try {
			setFront()
		} catch(e) {
			console.log(e.message);
		}
	}, 15000);
})

process.on('SIGINT', () => process.exit(0));
process.on('SIGKILL', () => process.exit(0));

var retrying = true;
var retries = 0;

async function connect() {
	while(retrying && retries < 5) {
		try {
			await client.login({clientId})
			console.log("RPC running!");
			retries = 0;
			retrying = false;
		} catch(e) {
			console.error(e.message);
			if(e.message == "Could not connect") {
				console.log("Couldn't connect to discord. Retrying in a few seconds...");
				retrying = true;
				retries += 1;
				await sleep(15000)
			}
		}
	}

	if(retries >= 5) {
		console.error(
			"Failed connection to Discord 5 times; " +
			"program is shutting down. Make sure Discord is running before trying again."
		)
	}
}

async function sleep(ms) {
	return new Promise((res, rej) => {
		setTimeout(() => res(), ms ?? 1000)
	})
}

connect();
