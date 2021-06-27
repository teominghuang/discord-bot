//Function that allows user to leave voice channel using command
module.exports = {
    name: 'leave',
    description: 'This command stops the music bot and makes it leave the channel.',
    async execute(message, args) {
        const voiceChannel = message.member.voice.channel;
        
        //If user is not in a voice channel, returns print message
        if(!voiceChannel) return message.channel.send("You can only stop the music in a voice channel!");
        await voiceChannel.leave(); //Force bot to leave the voice channel
        await message.channel.send('Leaving channel now :smiling_face_with_tear:') //Send discord message
    }
}