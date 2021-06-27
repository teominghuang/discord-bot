//Importing of required library, packages. Importing of prefix and bot-token for activation of the app 
const fs = require("fs");
const Discord = require("discord.js");
const { prefix, BOT_TOKEN } = require("./config.json");

//Initialisation of Client for activation of discord
//Initialisation of commands as a map - extends js native map class and has extra utilities
const client = new Discord.Client();
client.commands = new Discord.Collection();

//Prints "Bot is online!" when bot comes online - debugging tool to ensure bot comes online
client.once("ready", () => {
  console.log("Bot is online!");
});

// Returns an array of all the folders and files in 'command' directory, ['help.js', 'leave.js'] - Level 0 search
const commandFolders = fs.readdirSync("./commands");

// Loops through all the files within the folders that are situated in 'command' directory - Level 1 search
for (const folder of commandFolders) {
  const commandFiles = fs
    .readdirSync(`./commands/${folder}`)
    .filter((file) => file.endsWith(".js")); //Filter for files that ends with .js
  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`); 
    client.commands.set(command.name, command); 
  }
}

// Code starts when node gets initiated and activated.
client.on("message", (message) => {

  //checks if message starts with '!' + ignores all messages by the bot itself - prevents infinite loop
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  //stores the user's command in an array - args can be used for further customisation. 
  //Code below allows user to type in capital letters and even then, the commands should work.
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  //Get files that aligns with the command of user
  const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

  //checks for channel-only commands
  if (command.guildOnly && message.channel.type === "dm") {
    return message.reply("I can't execute that command inside DMs!");
  }

  //Try executing code else print error
  try {
    command.execute(message, args, commandName);
  } catch (error) {
    console.error(error);
    message.reply("there was an error trying to execute that command!");
  }
});

//Login and access bot using bot-token
client.login(BOT_TOKEN);
