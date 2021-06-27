//Importing all the necessary libraries and packages
const { time } = require("console");
const discord = require("discord.js")
const fs = require('fs');
const ms = require("ms")
const { prefix } = require('../../config.json');

//Pomodoro command
module.exports = {
  name: 'pomodoro',
  description: 'A pomodoro is by-default 25 minutes of focused work followed by 5 minutes of break. \nThe ratio of 25:5 is scalable by entering a number after pomodoro',
  aliases: ['pom'], //Pseudo-name to initiate this function
  guildOnly: true, 
  usage: 'Input \'!pomodoro 2\' to set a timer for 50 minutes of work then 10 minutes of break.',
  async execute(message, args) {

    //Ensure that an argument is present when command is initialised. 
    if (!args[0]) { return message.reply("Please input a factor of scale. You may use !help pomodoro for more information") }

	  //Initialise key-pair value to allow for variables management.
    let setAlarm = { active: false, id: null };
    let setRest = { active: false, id: null };

	  //Default timers for pomodoro
    let defaultWorkTime = ms('10s');
    let defaultRestTime = ms('20s');

	  //Set alarm for 25mins * factor 
    let timeStudying = defaultWorkTime * args[0];
    let timeResting = defaultRestTime * args[0];
    let restOver = timeStudying + timeResting;

    //Conversion of time to allow for javascript to handle 
    timeStudying = ms(timeStudying, { long: true });
    timeResting = ms(timeResting, { long: true });

    //Initialisation of variables for user assurance
    let encourage = 'Your time starts now! All the best'; //to add : a randomizer for messages
    let endMessage = 'Great Job! Ready for another?';

    //Creates an embed to let the user know that an alarm has been set for pomodoro, together with an encouraging message
	  //Sends it in to the same channel where the user created the alarm
    const embed = new discord.MessageEmbed()
      .setAuthor(`${message.author.tag} Pomodoro Alarm`, message.author.displayAvatarURL())
      .setColor("RANDOM")
      .setDescription(`Time: \`${timeStudying}\`\n \`${encourage}\``)
      .setTimestamp()
    message.channel.send(embed)
    try {
      			//Actual code for setting an embed to PM user when (52 * factor) minutes of studying has passed
      setAlarm.active = true; //change status of alarm
      setAlarm.id = setTimeout(() => {
        const embed = new discord.MessageEmbed()
          .setAuthor(`${message.author.tag} Pomodoro timer`, message.author.displayAvatarURL())
          .setColor("RANDOM")
          .setDescription(`Time: \`${timeStudying}\`\n \`Great Job! Take a break\`\nAlarm set in server: \`${message.guild.name}\``)
          .setTimestamp();
        message.author.send(embed);
        setAlarm.active = false;
      }, ms(timeStudying))
		      //Actual code for setting an embed to PM user when (17 * factor) minutes of resting has passed
      setRest.active = true;
      setRest.id = setTimeout(() => {
        const embed = new discord.MessageEmbed()
          .setAuthor(`${message.author.tag} Pomodoro timer`, message.author.displayAvatarURL())
          .setColor("RANDOM")
          .setDescription(`Time: \`${timeResting}\`\n \`${endMessage}\`\nAlarm set in server: \`${message.guild.name}\``)
          .setTimestamp();
        message.author.send(embed);
        setRest.active = false;
      }, restOver)
    } catch (error) {
      message.reply('Unable not set a timer. Please contact Admin');
    }
    //This block of code actively looks out if users would want to cancel the timer. 
		//Requires user to specify if its cancelling a study or rest timer, returns an error message to user if used wrongly
    //The rest timer is coded to start same time as the timer for studying, but the duration is longer by (break time) mins
    message.client.on('message', message => {
      if (setRest.active == false) { return };
      //checks if message starts with '!' and ignores all messages by the bot itself, preventing infinite loop
      if (!message.author.bot && message.content === `${prefix}stop work`) {
        if (setAlarm.active == false) {
          //returns error message to user, no alarm activated
          return message.reply('There isn\'t an alarm set for studying. Did you mean to stop rest?')
        }
        try {
          clearTimeout(setAlarm.id); 
          message.reply('Work alarm has successfully stopped');
          clearTimeout(setRest.id); //stopping rest timer as well since rest timer starts together with the study timer
        } catch (error) {
          message.channel.send('There isn\'t an alarm set for studying. Did you mean to stop rest?');
        }
      } else if (message.content === `${prefix}stop rest`) {
        if (setAlarm.active == true) { return message.reply('There isn\'t a timer set for rest. Did you mean to stop work?')}
        try {
          clearTimeout(setRest.id);
          message.reply('Rest timer has successfully stopped');
        } catch (error) {
          message.channel.send('There isn\'t a timer set for rest. Did you mean to stop work?');
        }
      } else if (message.content === `${prefix}time check`) {
		    let timeLeft = ms(Math.ceil((setRest.id._idleStart + setRest.id._idleTimeout - Date.now()) / 1000), { long: true });
	    	message.reply(timeLeft);
      }
    })
  },
};