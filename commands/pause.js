module.exports = {
    name: 'pause',
    description: 'pauses current track',
    async execute(message,args,Discord,client){
        const TextChannel = client.channels.cache.get(JSON.parse(localStorage.getItem('textChannelID')));
        const VoiceChannel = client.channels.cache.get(JSON.parse(localStorage.getItem('voiceChannelID')));
        try{
            client.player.pause(message.guild.id);
            message.react('👍');
        }catch(error){
            console.log(error);
        }
    }
}