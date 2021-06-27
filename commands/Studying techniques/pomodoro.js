const refreshrate = 20000; //refresh rate in millisecodns

const twentyfive = 1500000; //number of milliseconds
const fiveminutes = 300000; 

let timer = twentyfive;

const getText = () => {
	return `Time left : ${timer}s...`
}

const updateTimer = async (message) => {
	message.edit(getText())
	timer -= refreshrate

	if (timer <= 0) {
		message.channel.send('Well done! Here\'s a 5 minutes break') //to vary response

	}
	setTimeout(() => {
		updateTimer(message)
	}, refreshrate)
}

async function startTimer (client) {
	try {
		updateTimer(message);
	} catch (error) {
		client.channel.send('There was an error executing the timer, please try again.');
	}

}

module.exports = {
	name: 'pomodoro',
	aliases: ['pomo', 'pomod'],
	//args: true,
	description: 'Begin study sessions using the Pomodoro technique. Study for 25minutes then rest for 5 minutes!',
	execute(message, args, client) {
		//startTimer(client);
		message.channel.send('hello');
	},
};

