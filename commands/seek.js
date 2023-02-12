module.exports = {
    name: 'seek',
    description: 'seek a timestamp or second',
    async execute(message,args,Discord,client){
        const TextChannel = client.channels.cache.get(JSON.parse(localStorage.getItem('textChannelID')));
        const VoiceChannel = client.channels.cache.get(JSON.parse(localStorage.getItem('voiceChannelID')));
        let song = await client.player.nowPlaying(message.guild.id);
        if (args[0] === undefined || args[0].includes('-') || (isNaN(args[0]) && !args[0].includes(':'))) return TextChannel.send(new Discord.MessageEmbed().setAuthor('Gamenight Music', 'https://i.imgur.com/mSf8k1b.png').setDescription('Please provide a valid timestamp or time in seconds.'));
        console.log(timestampToMS(song.duration) < timestampToMS(args[0]));
        if (timestampToMS(song.duration) < timestampToMS(args[0]) || timestampToMS(args[0]) === false) return TextChannel.send(new Discord.MessageEmbed().setAuthor('Gamenight Music', 'https://i.imgur.com/mSf8k1b.png').setDescription('Please provide a valid timestamp or time in seconds.'));
        
        try{
            client.player.seek(message.guild.id, timestampToMS(args[0]));
        } catch(error) {
            console.log(error);
        }
    }
}

//methods
function timestampToMS(timeStamp) {
    let seconds = 0;
    let seek = true;
    const arr = timeStamp.split(':');
    if (timeStamp.includes(':')) { 
        if (arr.length > 3) 
            seek = false;
        for(let i = 0; i < arr.length; i++){
            console.log(parseInt(arr[arr.length - 1 - i]) > 59)
            if ((isNaN(seconds) || parseInt(arr[arr.length - 1 - i]) > 59) && i < arr.length)
                return seek = false;
            let slotVal = parseInt(arr[arr.length - 1 - i]);
            seconds += slotVal * Math.pow(60, i);
        }
    } else {
        seconds = timeStamp;
        if (seconds < 0 || isNaN(seconds))
            return () => {
                console.log('seek is false')
                seek = false;
            }
    }
    if (!seek) return seek;
    let ms = seconds * 1000;
    return ms;
}