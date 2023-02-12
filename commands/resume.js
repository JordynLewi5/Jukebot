module.exports = {
    name: 'resume',
    description: 'resumes current track',
    async execute(message,args,Discord,client){
        const TextChannel = client.channels.cache.get(JSON.parse(localStorage.getItem('textChannelID')));
        const VoiceChannel = client.channels.cache.get(JSON.parse(localStorage.getItem('voiceChannelID')));
        try{
            const song = client.player.resume(message.guild.id);
            message.react('👍');
        }catch(error){
            console.log(error);
        }
    }
}