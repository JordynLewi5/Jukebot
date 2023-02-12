module.exports = {
    name: 'volume',
    description: 'changes volume or displays current volume if no argument is provided',
    async execute(message,args,Discord,client){
        const TextChannel = client.channels.cache.get(JSON.parse(localStorage.getItem('textChannelID')));
        const VoiceChannel = client.channels.cache.get(JSON.parse(localStorage.getItem('voiceChannelID')));
        const song = client.player.nowPlaying(message.guild.id);
        if (song === undefined) return TextChannel.send(new Discord.MessageEmbed().setAuthor('Gamenight Music', 'https://i.imgur.com/v4SxY1N.png').setDescription('Please wait until your music has started playing.'));
        if(isNaN(args[0])||args[0] === undefined){
            try{
                await TextChannel.send(new Discord.MessageEmbed().setAuthor('Gamenight Music', 'https://i.imgur.com/XivpRjd.png').setDescription(`Volume is currently set to **${song.queue.volume}**%.`));
            }catch(error){
                await TextChannel.send(new Discord.MessageEmbed().setAuthor('Gamenight Music', 'https://i.imgur.com/v4SxY1N.png').setTitle(`Uh oh..`).setDescription(`Please wait until Jukebot has joined your channel and your music has started.`))
            } 
            return;
        }

        if(args[0] < 0 || (args[0] > 200 && message.author.id !== '599075619178807312')){
            try{
                await TextChannel.send(new Discord.MessageEmbed().setAuthor('Gamenight Music', 'https://i.imgur.com/v4SxY1N.png').setTitle(`Uh oh..`).setDescription(`You must enter a numeric value between **0%** and **200%**.`))
            }catch(error){
                await TextChannel.send(new Discord.MessageEmbed().setAuthor('Gamenight Music', 'https://i.imgur.com/v4SxY1N.png').setTitle(`Uh oh..`).setDescription(`Please wait until Jukebot has joined your channel and your music has started.`))
            } 
            return;
        }
        try{
        song.queue.volume = parseInt(args[0]);
        client.player.setVolume(message.guild.id, parseInt(args[0]));
        await TextChannel.send(new Discord.MessageEmbed().setAuthor('Gamenight Music', 'https://i.imgur.com/XivpRjd.png').setDescription(`Volume is currently set to **${song.queue.volume}**%.`));
        }catch(error){
            await TextChannel.send(new Discord.MessageEmbed().setAuthor('Gamenight Music', 'https://i.imgur.com/v4SxY1N.png').setTitle(`Uh oh..`).setDescription(`Please wait until Jukebot has joined your channel`))
        } 
    }
}