const queue = require("./queue");

module.exports = {
    name: 'jump',
    description: 'skips to specified track',
    async execute(message,args,Discord,client){
        const TextChannel = client.channels.cache.get(JSON.parse(localStorage.getItem('textChannelID')));
        const VoiceChannel = client.channels.cache.get(JSON.parse(localStorage.getItem('voiceChannelID')));
        let queue = await client.player.getQueue(message.guild.id);
        console.log( Math.round(args[0]))
        if (args[0] != Math.round(args[0]) || args[0] != Math.round(args[0])) return TextChannel.send(new Discord.MessageEmbed().setAuthor('Gamenight Music', 'https://i.imgur.com/XivpRjd.png').setDescription('Please enter a valid whole number.'))
        if (isNaN(args[0]) || args[0] > queue.songs.length || args[0] < 1 || args[0].includes('.')) return TextChannel.send(new Discord.MessageEmbed().setAuthor('Gamenight Music', 'https://i.imgur.com/v4SxY1N.png').setDescription(`Can't jump to track **#${args[0]}**. It is either invalid or out of range of the queue.`))

        try{
            const song = client.player.jump(message.guild.id, args[0]);
            message.react('👍');
        }catch(error){
            console.log(error);
        }
        
    }   
}