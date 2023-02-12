module.exports = {
    name: 'skip',
    description: 'skips current track',
    async execute(message,args,Discord,client){
        const TextChannel = client.channels.cache.get(JSON.parse(localStorage.getItem('textChannelID')));
        const VoiceChannel = client.channels.cache.get(JSON.parse(localStorage.getItem('voiceChannelID')));
        
        let queue = await client.player.getQueue(message.guild.id);
        try{
            const song = client.player.skip(message.guild.id);
            message.react('👍');
        }catch(error){
            console.log(error);
        }

    }   
}