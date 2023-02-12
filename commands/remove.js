module.exports = {
    name: 'remove',
    description: 'pauses current track',
    async execute(message,args,Discord,client){
        const TextChannel = client.channels.cache.get(JSON.parse(localStorage.getItem('textChannelID')));
        const VoiceChannel = client.channels.cache.get(JSON.parse(localStorage.getItem('voiceChannelID')));
        
        let queue = await client.player.getQueue(message.guild.id);

        if( queue === undefined || queue.songs.length === 0){
            await TextChannel.send(new Discord.MessageEmbed().setAuthor('Gamenight Music', 'https://i.imgur.com/mSf8k1b.png').setDescription(`Can't empty an empty queue, but that's wierd.. I should have left this channel by now.`))
            return;
        }

        if (args[0] < 1 || args[1] < 1 || args[0] > queue.songs.length || args[1] > queue.songs.length) return TextChannel.send(new Discord.MessageEmbed().setAuthor('Gamenight Music', 'https://i.imgur.com/v4SxY1N.png').setDescription(`Can't remove because specified track # is out of range of the queue.`))
        // if ((args[0] != Math.round(args[0]) || args[1] != Math.round(args[1])) && (args[0] !== 'all' && args[0] !== undefined)) return TextChannel.send(new Discord.MessageEmbed().setAuthor('Gamenight Music', 'https://i.imgur.com/XivpRjd.png').setDescription('Please enter a valid whole number.'))
        args[0] = Math.floor(args[0]);
        args[1] = Math.floor(args[1]);

        if(!isNaN(args[0]) && !isNaN(args[1]) && args[0] > 0){

            if (args[0] > args[1]) {
                let topArg = args[0];
                args[0] = args[1];
                args[1] = topArg;
            }

            args[0] = Math.min(args[0], queue.songs.length)
            args[1] = Math.min(args[1], queue.songs.length)


            let skip = false;
            for (let i = parseInt(args[1]); i >= args[0]; i--){
                try{
                    client.player.remove(message.guild.id, i - 1);
                }catch(error){
                    console.log(error);
                }
                if(i == await JSON.parse(localStorage.getItem('songNum')) + 1){
                    try{
                        if (queue.songs.length !== 0) {
                            client.player.seek(message.guild.id, 0);
                        } else {
                            const song = client.player.skip(message.guild.id);
                        }
                    }catch(error){
                        console.log(error);
                    }
                }
            }
            return await TextChannel.send(new Discord.MessageEmbed().setAuthor('Gamenight Music', 'https://i.imgur.com/XivpRjd.png').setTitle(`Poof!`).setDescription(`All track(s) within range **${args[0]}** to **${args[1]}** have been removed from the queue.`))
        }

        if(args[0] == 'all' || args[0] === undefined){
            client.player.clearQueue(message.guild.id);
            try{
                await client.player.skip(message.guild.id);
            }catch(error){
                console.log(error);
            }
            return await TextChannel.send(new Discord.MessageEmbed().setAuthor('Gamenight Music', 'https://i.imgur.com/XivpRjd.png').setTitle(`Poof!`).setDescription(`**All** track(s) removed from the queue.`))
        }
        if(isNaN(args[0])){
            await TextChannel.send(new Discord.MessageEmbed().setAuthor('Gamenight Music', 'https://i.imgur.com/mSf8k1b.png').setDescription('That track # doesn\'t exist.'))
            return;
        }
        try{


            if(args[0] - 1  == await JSON.parse(localStorage.getItem('songNum'))){
                try{
                    client.player.skip(message.guild.id);
                }catch(error){
                    console.log(error);
                }
            } else {
                try{
                    client.player.remove(message.guild.id, parseInt(args[0])-1);
                }catch(error){
                    console.log(error);
                }
            }
            
            try{
                await TextChannel.send(new Discord.MessageEmbed().setAuthor('Gamenight Music', 'https://i.imgur.com/XivpRjd.png').setTitle(`Poof!`).setDescription(`Track **${args[0]}** removed from the queue.`))
            }catch(error){
                console.log(error);
            }
        }catch(error){
            console.log(error);
        }
    }
}