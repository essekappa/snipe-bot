const { Client, Intents, MessageEmbed } = require("discord.js");
const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
	],
	partials: ["MESSAGE", "REACTION", "USER"],
});
const { token } = require("../config.json");

const snipes = {};
const editSnipes = {};
const reactionSnipes = {};

const formatEmoji = (emoji) => {
	return !emoji.id || emoji.available
		? emoji.toString()
		: `[:${emoji.name}:](${emoji.url})`; 
};

client.on("ready", () => {
	console.log(`[sniper] :: Online come: ${client.user.tag}.`);
});

client.on("messageDelete", async (message) => {
	if (message.partial || (message.embeds.length && !message.content)) return; 

	snipes[message.channel.id] = {
		author: message.author,
		content: message.content,
		createdAt: message.createdTimestamp,
		image: message.attachments.first()
			? message.attachments.first().proxyURL
			: null,
	};
});

client.on("messageUpdate", async (oldMessage, newMessage) => {
	if (oldMessage.partial) return; 

	editSnipes[oldMessage.channel.id] = {
		author: oldMessage.author,
		content: oldMessage.content,
		createdAt: newMessage.editedTimestamp,
	};
});

client.on("messageReactionRemove", async (reaction, user) => {
	if (reaction.partial) reaction = await reaction.fetch();

	reactionSnipes[reaction.message.channel.id] = {
		user: user,
		emoji: reaction.emoji,
		messageURL: reaction.message.url,
		createdAt: Date.now(),
	};
});

client.on("interactionCreate", async (interaction) => {
	if (!interaction.isCommand()) return;

	const channel =
		interaction.options.getChannel("channel") || interaction.channel;

	if (interaction.commandName === "snipe") {
		const snipe = snipes[channel.id];

		if (!snipe) return interaction.reply("mh, non c'è niente da individuare");

		const embed = new MessageEmbed()
			.setAuthor(snipe.author.tag)
			.setFooter(`#${channel.name}`)
			.setTimestamp(snipe.createdAt);
		snipe.content ? embed.setDescription(snipe.content) : null;
		snipe.image ? embed.setImage(snipe.image) : null;

		await interaction.reply({ embeds: [embed] });
	} else if (interaction.commandName === "editsnipe") {
		const snipe = editSnipes[channel.id];

		await interaction.reply(
			snipe
				? {
						embeds: [
							new MessageEmbed()
								.setDescription(snipe.content)
								.setAuthor(snipe.author.tag)
								.setFooter(`#${channel.name}`)
								.setTimestamp(snipe.createdAt),
						],
				  }
				: "mh, non c'è niente da individuare"
		);
	} else if (interaction.commandName === "reactionsnipe") {
		const snipe = reactionSnipes[channel.id];

		await interaction.reply(
			snipe
				? {
						embeds: [
							new MessageEmbed()
								.setDescription(
									`Reagito con ${formatEmoji(
										snipe.emoji
									)} su: [this message](${snipe.messageURL})`
								)
								.setAuthor(snipe.user.tag)
								.setFooter(`#${channel.name}`)
								.setTimestamp(snipe.createdAt),
						],
				  }
				: "mh, non c'è niente da individuare"
		);
	}else if (interaction.commandName === "github") {
	const button = new MessageButton()
	.setLabel('Github')
	.setStyle('LINK')
	.setURL("https://github.com/essekappa/snipe-bot")
		const git = new MessageEmbed()
		.setTitle("Mio github")
		.setDescription("(qui)[https://github.com/essekappa/snipe-bot] ci sono tutti i miei file.")
		await interaction.reply({embeds: [git], components: [button]})

	}
});

client.login(token);
