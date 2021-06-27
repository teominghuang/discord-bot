//Importing of necessary packages from libraries
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

//Global music queue for the bot
const queue = new Map();

//Command to start playlist
module.exports = {
    name: 'play',
    aliases: ['skip', 'stop'], //Use aliases to skip and stop the bot from playing
    cooldown: 0, 
    description: 'This is a music bot that allows the user to enjoy music while studying. Some common commands include queueing music, skipping the music in queue and stopping the bot.',
    async execute(message, args, commandName){

        //Checking for all necessary criteria before execution of main code - permissions & user in a channel
        const voice_channel = message.member.voice.channel;
        if (!voice_channel) return message.channel.send('You need to be in a channel to execute this command!');
        const permissions = voice_channel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) return message.channel.send('You dont have the correct permissins');
        if (!permissions.has('SPEAK')) return message.channel.send('You dont have the correct permissins');

        //Getting server queue from global queue
        const server_queue = queue.get(message.guild.id);

        //Execute if the user initiate a 'play' command.
        if (commandName === 'play'){
            //Check for presence of necessary argument
            if (!args.length) return message.channel.send('You need to send the second argument!');
            let song = {};

            //If the first argument is a link. Set the song object to have two keys - Title and URl.
            if (ytdl.validateURL(args[0])) {
                const song_info = await ytdl.getInfo(args[0]);
                song = { title: song_info.videoDetails.title, url: song_info.videoDetails.video_url }
            } else {
                //If there was no link, we use keywords to search for a video. Set the song object to have two keys - Title and URl.
                const video_finder = async (query) =>{
                    const video_result = await ytSearch(query);
                    return (video_result.videos.length > 1) ? video_result.videos[0] : null; //Return the first video available int he list
                }
            
                const video = await video_finder(args.join(' '));
                if (video){
                    song = { title: video.title, url: video.url } //If there exists a video to be streamed
                } else {
                     message.channel.send('Error finding video.'); //Error finding video
                }
            }

            //If server queue doesnt exist, create a constructor for it to be added to our global queue.
            if (!server_queue){

                const queue_constructor = {
                    voice_channel: voice_channel,
                    text_channel: message.channel,
                    connection: null,
                    songs: []
                }
                
                //Add key-value pair into global queue, which will be used to get our server queue.
                queue.set(message.guild.id, queue_constructor);
                queue_constructor.songs.push(song);
    
                //Establish a connection and play the song with the video_player function.
                try {
                    const connection = await voice_channel.join();
                    queue_constructor.connection = connection; //Establsh connection
                    video_player(message.guild, queue_constructor.songs[0]);
                } catch (err) { //Error-handling
                    queue.delete(message.guild.id); //Delete queue if failed
                    message.channel.send('There was an error connecting!');
                    throw err; 
                }
            } else{
                server_queue.songs.push(song); //Push song to server queue
                return message.channel.send(`👍 **${song.title}** added to queue!`); //User confirmation - song added
            }
        }
        
        //Execute if the user initiate a 'skip' command.
        else if(commandName === 'skip') skip_song(message, server_queue);
        //Execute if the user initiate a 'stop' command. 
        else if(commandName === 'stop') stop_song(message, server_queue);
    }
    
}

//Queueing system for the video-player. If has song in queue, continue, else bot exits voice channel and delete key-pair value
const video_player = async (guild, song) => {
    const song_queue = queue.get(guild.id);

    //If no song is left in the server queue. Leave the voice channel and delete the key and value pair from the global queue.
    if (!song) {
        song_queue.voice_channel.leave(); //Leave voice channel
        queue.delete(guild.id); //Delete key-pair value from global queue
        return;
    }
    const stream = ytdl(song.url, { filter: 'audioonly' }); //Stream video to be audio only
    song_queue.connection.play(stream, { seek: 0, volume: 0.5 }) //Stream at volume 0.5 and seek 0
    .on('finish', () => {
        song_queue.songs.shift();  //Shift queue and allow next song to be played
        video_player(guild, song_queue.songs[0]); //Play song
    });
    await song_queue.text_channel.send(`🎶 Now playing **${song.title}**`) //Confirmation and inform user that next song is being played
}

//Function to skip to the next song in queue
const skip_song = (message, server_queue) => {
    //If user is not in a voice channel, he cannot execute this command
    if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command!');
    //Inform user if there are no songs in the queue
    if(!server_queue){
        return message.channel.send(`There are no songs in queue 😔`); 
    }
    //End server queue
    server_queue.connection.dispatcher.end();
}

//Function to stop play all the songs, including those in queue.
const stop_song = (message, server_queue) => {
    //If user is not in a voice channel, he cannot execute this command
    if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command!');
    //Re-initialise list to remove all songs
    server_queue.songs = [];
    //End server queue
    server_queue.connection.dispatcher.end();
}