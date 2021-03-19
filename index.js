require('dotenv').config()

const fs = require('fs')
const Discord = require('discord.js');
const client = new Discord.Client();

const postgres = require('postgres')
client.sql = postgres(process.env.DATABASE_URL, { ssl: { rejectUnauthorized: false } })

client.commands = new Discord.Collection();
client.roles = new Discord.Collection();
client.music = {}

const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
        console.log("Found command: " + command.name + ".js")
	}
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	console.log("Found event: " + event.name + ".js")
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}
client.login(process.env.TOKEN)