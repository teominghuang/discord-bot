module.exports = {
	name: 'add',
	//args: true,
	description: 'To-do list that helps in productivity!',
	execute(message, args) {
		message.channel.send('\'Study 4 chapters for biology quiz\' has been successfully added!')
	},
};