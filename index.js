const DiscordRPC = require('discord-rpc');
const PKAPI = require('pkapi.js');

const clientId = '757707416719851651';
DiscordRPC.register(clientId);
const client = new DiscordRPC.Client({transport: 'ipc'});

const API = new PKAPI();

var system;

async function setFront() {
	try {
		if(!system) {
			system = await API.getSystem({system: client.user.id});
		}

		var front = await system.getFronters();
		front.members = Array.from(front.members, ([k, v]) => v);

        members = front.members.map(m => m.display_name || m.name).join(", ");
		if (members.length > 127) {
			members = front.members.map(m => m.name).join(", ");
			if (members.length > 127) {
				members = members.slice(0, 120) + "...";
			}
		}

		var activity = {
			details: members || "(none)",
			state: system.name || "---",
			startTimestamp: new Date(front.timestamp),
			instance: false
		}

		if(front.members[0]?.avatar_url) {
			activity.largeImageKey = front.members[0].avatar_url.replace('cdn.discordapp.com', 'media.discordapp.net');
			activity.largeImageText = front.members[0]?.display_name || front.members[0]?.name;
		}

		if(system.avatar_url) {
			activity.smallImageKey = system.avatar_url.replace('cdn.discordapp.com', 'media.discordapp.net');
			activity.smallImageText = system.name || "system";
		}

		client.setActivity(activity)
	} catch(e) {
		if(e.response) {
			if(e.response.data == "Account not found.") {
				console.error("Account doesn't have a system registered.");
			} else if(e.response.response == "Unauthorized to view fronter.") {
				console.error("Account's front is set to private.");
			} else if(e.response.response == "System has no registered switches.") {
				console.error("Account has no registered switches.");
			} else console.error(e.response.data);
		} else console.error(e.message);
		process.exit(1);
	}
}

client.on('ready', ()=> {
	setFront();

	setInterval(()=> setFront(), 15000);
})

client.login({clientId}).catch(console.error).then(()=> console.log("RPC running!"));
