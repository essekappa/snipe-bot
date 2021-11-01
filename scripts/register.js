const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const { token, application_id } = require("../config.json");

const guild = process.argv[2];

const commands = [
	{
		name: "snipe",
		description: "Mostra l ultimo messaggio eliminato in un canale",
		options: [
			{
				type: 7,
				name: "channel",
				description: "The channel to snipe",
			},
		],
	},
	{
		name: "editsnipe",
		description: "Mostra l ultimo messaggio modificato in un canale",
		options: [
			{
				type: 7,
				name: "channel",
				description: "The channel to snipe",
			},
		],
	},
	{
		name: "reactionsnipe",
		description:
			"Mostra l ultima reazione rimossa in un messaggio in un canale",
		options: [
			{
				type: 7, 
				name: "channel",
				description: "The channel to snipe",
			},
		],
	},
	{
		name: "Github",
		description: "Mostra i file del bot",
	},
];

const rest = new REST({ version: "9" }).setToken(token);

(async () => {
	try {
		console.log("[sniper] :: Started refreshing application (/) commands.");

		await rest.put(
			guild
				? Routes.applicationGuildCommands(application_id, guild)
				: Routes.applicationCommands(application_id),
			{
				body: commands,
			}
		);

		console.log(
			"[sniper] :: Successfully reloaded application (/) commands."
		);
	} catch (error) {
		console.error(error);
	}
})();
