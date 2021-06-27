//A to-do list for the user 
module.exports = {
	name: 'list',
	//args: true,
	description: 'To-do list that helps in productivity!',
	execute(message, args) {
		message.reply('1. Get groceries from the market \n2. Study 4 chapters for biology quiz');
	},
};