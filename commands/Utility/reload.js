//Importing of necessary packages from the library
const fs = require('fs');

//Function to initiate reload
module.exports = {
	name: 'reload',
	description: 'Reloads a command',
	args: true,
	execute(message, args) {
        //Users get to start command even with capital letters when initialising
		const commandName = args[0].toLowerCase();
		const command = message.client.commands.get(commandName) //Get command with command name or alias
			|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        //Informing user that there are no commands or aliases that identify with the one he yped in
		if (!command) {
			return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);
		}
        
        //Search through all the folders and find relevant folders 
        const commandFolders = fs.readdirSync('./commands');
        const folderName = commandFolders.find(folder => fs.readdirSync(`./commands/${folder}`).includes(`${command.name}.js`));

        //Delete command from cache
        delete require.cache[require.resolve(`../${folderName}/${command.name}.js`)];

        //Reload feature by re-initialising command
        try {
            const newCommand = require(`../${folderName}/${command.name}.js`);
            message.client.commands.set(newCommand.name, newCommand);
            message.channel.send(`Command \`${newCommand.name}\` was reloaded!`); //Confirmation to user that function has reloaded
        } catch (error) { //Error handling
            console.error(error);
            message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
        }
	},
};