module.exports = {
    name: 'leave',
    description: 'leaves voiceChannel',
    async execute(message,args,Discord,client){
        let isPlaying = await client.player.isPlaying(message.guild.id);
        const TextChannel = client.channels.cache.get(JSON.parse(localStorage.getItem('textChannelID')));
        const VoiceChannel = client.channels.cache.get(JSON.parse(localStorage.getItem('voiceChannelID')));
        if(!isPlaying){
            await TextChannel.send(new Discord.MessageEmbed().setAuthor('Gamenight Music', 'https://i.imgur.com/mSf8k1b.png').setTitle(`Whoa there!`).setDescription(`Please wait until Jukebot has joined your channel and your music has started.`));
            await VoiceChannel.leave();
            return;
        }
        try{
            await TextChannel.send(new Discord.MessageEmbed().setAuthor('Gamenight Music', 'https://i.imgur.com/XivpRjd.png').setTitle(`Stopping all music in queue.`).setDescription(`I'll go ahead and leave the channel to help other parties.`));
            client.player.stop(message.guild.id);
        }catch{
            await TextChannel.send(new Discord.MessageEmbed().setAuthor('Gamenight Music', 'https://i.imgur.com/mSf8k1b.png').setTitle(`Uh oh..`).setDescription(`Please wait until Jukebot has joined your channel and your music has started.`));
        }        
    }
}