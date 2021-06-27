//required libraries
const fs = require('fs');
const Discord = require("discord.js");

//prefix is in config.json
const { prefix, BOT_TOKEN } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

client.once('ready', () => {
	console.log('Bot is online!');
});

//returns an array of all the file names in a directory, e.g. ['ping.js', 'beep.js']
//ensures only command files get returned
const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}

client.login(BOT_TOKEN);

client.on('message', message => {
    //checks if message starts with '!' and ignores all messages by the bot itself, preventing infinite loop
	if (!message.content.startsWith(prefix) || message.author.bot) return;
    
    //stores the user's command in an array
    const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName) || client.commands.find(a=>a.aliases && a.aliases.includes(commandName));

    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;
    
        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }
    
        return message.channel.send(reply);
    }

	try {
        command.execute(message, args, client);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

