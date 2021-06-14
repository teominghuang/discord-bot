module.exports = {
	name: 'list',
	//args: true,
	description: 'To-do list that helps in productivity!',
	execute(message, args) {
		message.channel.send('1. Get groceries from the market \n2. Study 4 chapters for biology quiz');
	},
};