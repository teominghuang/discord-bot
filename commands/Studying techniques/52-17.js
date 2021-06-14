module.exports = {
	name: '52-17',
	//args: true,
	description: 'Begin study sessions using the 52-17 technique. Study for 52 minutes and rest for 17 minutes.',
	execute(message, args) {
		message.channel.send('52 minutes study session has commenced!').then((arg1)=>{
			(setTimeout(()=>message.channel.send('Your study session has concluded after 52 minutes. Enjoy your 17 minute break!'), 5000))
		});
	},
};