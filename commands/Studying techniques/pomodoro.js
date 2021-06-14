module.exports = {
	name: 'pomodoro',
	//args: true,
	description: 'Begin study sessions using the Pomodoro technique. Study for 25minutes and rest for 5 minutes!',
	execute(message, args) {
		message.channel.send('Pomodoro study session has commenced!').then((arg1)=>{
			(setTimeout(()=>message.channel.send('Your study session has concluded after 25 minutes. Enjoy your 5 minute break!'), 5000))
		});
	},
};