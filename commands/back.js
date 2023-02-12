module.exports = {
    name: 'back',
    description: 'skips current track backwards',
    async execute(message,args,Discord,client){
        const TextChannel = client.channels.cache.get(JSON.parse(localStorage.getItem('textChannelID')));
        const VoiceChannel = client.channels.cache.get(JSON.parse(localStorage.getItem('voiceChannelID')));
        try{
            const song = client.player.back(message.guild.id);
            if (!song.backable) return TextChannel.send(new Discord.MessageEmbed().setAuthor('Gamenight Music', 'https://i.imgur.com/XivpRjd.png').setDescription(`Previous track does not exist.`))
            message.react('👍');
        }catch(error){
            console.log(error);
        }
        
    }   
}