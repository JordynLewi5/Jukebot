module.exports = (client, Discord, prefix, config, commands) => {
    const available = require('./handler.js');
    client.on('message', async message => {
        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();
        const textChannelID = message.channel.id;
        const TextChannel = client.channels.cache.get(textChannelID);

        // Filter out regular messages, other commands, and attempts to use Juke commands
        // when author is not in voicechannel or if author is not party leader.
        if (!message.content.startsWith(prefix)) 
            return;
        if (!commands.includes(command)) 
            return;

        //determine the availability of this client
        const availability = await available(client, Discord, prefix, message, config.botNum, config.jukebotRoleID);
        console.log(availability)

        //Use availability to determine which messages to send
        if (message.guild.members.cache.get(message.author.id).voice.channel === null)
            return TextChannel.send(new Discord.MessageEmbed().setAuthor('Gamenight Music', 'https://i.imgur.com/v4SxY1N.png').setDescription(`User not in voice channel.`));
        if (availability === null)
            return TextChannel.send(new Discord.MessageEmbed().setAuthor('Gamenight Music', 'https://i.imgur.com/v4SxY1N.png').setDescription(`It appears all accessible Jukebots are currently being used.\nHowever, if you want access to exclusive Jukebots that regular users don't have access to, **[VIP](https://www.gamenight.li/store)** members have `));
        if (await availability !== config.botNum && availability !== true)
            return console.log('not available');
        if (!(message.member.roles.cache.find(r => r.name === "Admin")||message.member.roles.cache.find(r => r.name === "Bots")||message.member.roles.cache.find(r => r.name === "party leader")||message.member.roles.cache.find(r => r.name === "Host"))) 
            return TextChannel.send(new Discord.MessageEmbed().setAuthor('Gamenight Music', 'https://i.imgur.com/v4SxY1N.png').setDescription(`You don't have permission to use Jukebot in this party. Check out <#789239937429798952> for more information.`));    
        if (client.voice.connections.array().length === 0 && !['play','p'].includes(command) && !availability)
            return TextChannel.send(new Discord.MessageEmbed().setAuthor('Gamenight Music', 'https://i.imgur.com/v4SxY1N.png').setDescription('Jukebot is not playing any music in your voice channel.'));
        console.log(availability)


        if(!['play','p'].includes(command)){
            let queue = await client.player.getQueue(message.guild.id);
            if (queue === undefined) return TextChannel.send(new Discord.MessageEmbed().setAuthor('Gamenight Music', 'https://i.imgur.com/v4SxY1N.png').setDescription('Please wait until your music has started playing.'));
        }
        const voiceChannelID = message.guild.members.cache.get(message.author.id).voice.channel.id;
        const VoiceChannel = client.channels.cache.get(voiceChannelID);

        //update local storage
        localStorage.setItem('textChannelID', JSON.stringify(textChannelID));
        localStorage.setItem('voiceChannelID', JSON.stringify(voiceChannelID));

        try{
            client.commands.get(command).execute(message,args,Discord,client);
        }catch(error){
            // console.log(error)
        }

    })
}

