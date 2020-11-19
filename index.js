const DiscordRPC = require('discord-rpc');
const axios = require('axios');

const clientId = '757707416719851651';
DiscordRPC.register(clientId);
const client = new DiscordRPC.Client({transport: 'ipc'});

axios.defaults.baseURL = 'https://api.pluralkit.me/v1';

var system;

async function setFront() {
	try {
		if(!system) {
			var data = (await axios(`/a/${client.user.id}`)).data;
			system = data;
		}

		var front = (await axios(`/s/${system.id}/fronters`)).data;

        members = front.members.map(m => m.display_name || m.name).join(", ");
		if (members.length > 127) {
			members = front.members.map(m => m.name).join(", ");
			if (members.length > 127) {
				members = members.slice(0, 120) + "...";
			}
		}
		client.setActivity({
			details: members || "(none)",
			state: system.name || "---",
			startTimestamp: new Date(front.timestamp),
			//uncomment below if you want images & are using your own client
			// largeImageKey: front.members[0]?.id || "none",
			// largeImageText: front.members[0]?.display_name || front.members[0]?.name || "none",
			// smallImageKey: system.id,
			// smallImageText: system.name || "system",
			instance: false
		})
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
