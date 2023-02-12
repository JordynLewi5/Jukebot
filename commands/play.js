const ytSearch = require('yt-search');
const { scrapePlaylist } = require("youtube-playlist-scraper");

module.exports = {
    name: 'play',
    description: 'plays track or playlist?',
    async execute(message,args,Discord,client){
        const TextChannel = client.channels.cache.get(JSON.parse(localStorage.getItem('textChannelID')));
        const VoiceChannel = client.channels.cache.get(JSON.parse(localStorage.getItem('voiceChannelID')));
        const RequestedBy = message.guild.members.cache.find(member => member.id === message.author.id);
        const Options = {}
        let searchQuery = args.slice(0,args.length).join(' ');
        let song;
        let maxQueue = JSON.parse(localStorage.getItem('queueLimit')).base;
        if (RequestedBy.roles.cache.some(role => role.id === '822505604764532796'))
            maxQueue = JSON.parse(localStorage.getItem('queueLimit')).premium;
        console.log(maxQueue);
        let queue = await client.player.getQueue(message.guild.id);


        //check if queue length is at limit
        if (!RequestedBy.roles.cache.some(role => role.id === '822505604764532796')) {
            if(queue !== undefined && queue.songs.length >= maxQueue) return TextChannel.send(new Discord.MessageEmbed().setAuthor('Gamenight Music', 'https://i.imgur.com/v4SxY1N.png').setTitle(`You can't add anymore tracks to the queue.`).setDescription(`To save resources, queue lengths are limited to **${maxQueue}** tracks.\n\n**[VIP+](https://upgrade.chat/checkout/775222016080871424)** members can add up to **150** tracks to the queue.`));
        } else {
            if(queue !== undefined && queue.songs.length >= maxQueue) return TextChannel.send(new Discord.MessageEmbed().setAuthor('Gamenight Music', 'https://i.imgur.com/v4SxY1N.png').setTitle(`You can't add anymore tracks to the queue.`).setDescription(`You can't add anymore tracks to the queue.\nTo save resources, queue lengths are limited to **${maxQueue}** tracks for **[VIP+](https://upgrade.chat/checkout/775222016080871424)** members.`));

        }

        //check if search term is provided.
        if (args[0] === undefined) return TextChannel.send(new Discord.MessageEmbed().setAuthor('Gamenight Music', 'https://i.imgur.com/mSf8k1b.png').setDescription('No search term provided. Please enter a title or YouTube playlist URL.'));

        //check if provided search term is 
        if(await isSpotifyPlaylist(searchQuery)) return TextChannel.send(new Discord.MessageEmbed().setAuthor('Gamenight Music', 'https://i.imgur.com/v4SxY1N.png').setDescription(`Spotify **playlists** are not supported by this bot. However, you can convert Spotify playlists to YouTube playlists using `))

        if(await isYTPlaylist(searchQuery)){
            await addPlaylistToQueue(message,args,Discord,client,searchQuery,RequestedBy,TextChannel,VoiceChannel,Options,queue,maxQueue); //if searchQuery is playlist, playlist songs will be added to queue.
        }else{
            //adds song to queue
            if(client.player.isPlaying(message.guild.id)){
                try{    
                    song = await client.player.addToQueue(message.guild.id, searchQuery, Options, RequestedBy);
                    if(song.song === null){
                        song = await client.player.addToQueue(message.guild.id, searchQuery, Options, RequestedBy);
                        if(song.song === null){
                            await TextChannel.send(new Discord.MessageEmbed().setAuthor('Gamenight Music', 'https://i.imgur.com/v4SxY1N.png').setDescription(`Couldn't find what you were looking for.`))
                            return;
                        }

                    }
                    if (client.player.isPlaying(message.guild.id)) await TextChannel.send(new Discord.MessageEmbed().setAuthor('Gamenight Music', 'https://i.imgur.com/XivpRjd.png').setDescription(`**Track added to queue.\n**"[${song.song.name}](${song.song.url})" - ${song.song.duration}\n*By ${song.song.author}*`).setURL(song.song.url).setThumbnail(song.song.thumbnail))

                
                }catch(error){
                    console.log(error);
                }
            }else{
                try{    
                    try{

                        song = await client.player.play(VoiceChannel, searchQuery, Options, RequestedBy);

                        if(song.song === null){
                            await TextChannel.send(new Discord.MessageEmbed().setAuthor('Gamenight Music', 'https://i.imgur.com/v4SxY1N.png').setDescription(`Couldn't find what you were looking for.`))
                            return await VoiceChannel.leave();
                        }

                    } catch (error) {console.log(error);}
                }catch(error){
                    console.log(error);
                }
            }
        }
    }
}

async function addPlaylistToQueue(message,args,Discord,client,searchQuery,RequestedBy,TextChannel,VoiceChannel,Options,queue,maxQueueLength){

    let playlist = await client.player.playlist(message.guild.id, searchQuery, VoiceChannel, maxQueueLength, RequestedBy);
    


    if(await playlist.playlist === null) {
        if (queue === undefined) await VoiceChannel.leave();
        return TextChannel.send(new Discord.MessageEmbed().setAuthor('Gamenight Music', 'https://i.imgur.com/v4SxY1N.png').setDescription(`Invalid YouTube playlist URL provided.`));
    } else {
        TextChannel.send(new Discord.MessageEmbed().setAuthor('Gamenight Music', 'https://i.imgur.com/XivpRjd.png').setDescription(`**Playlist successfully added to the queue.**\n`));
    }


}

//checks if searchQuery is a YT playlist
async function isYTPlaylist(query){
    
    let str = '';
    for(let i = 0; i < query.length; i++){
        str = str + query.charAt(i);
        if(str.includes('youtube.com/playlist?list=')) return true;
        if(i === query.length) return false;       
    }
}

//checks if searchQuery is a Spotify playlist
async function isSpotifyPlaylist(query){
    if(query.includes('open.spotify.com/playlist')) {
        return true;
    } else {
        return false;
    }
}

//gets playlist from ID
async function getPlaylist(id){
    let data = '';
    data = await scrapePlaylist(id);
    if(data.playlist === 'not playlist'){
        return false;
    }
    return data;
  }

//gets ID from URL
function getIDFromURL(url){
    let str = '';
    for(let i = 0; i < url.length; i++){
        str = str + url.charAt(i);
        if(str.includes('youtube.com/playlist?list=')) {  
            return url.slice(str.length,url.length);
        }
        if(i==url.length){
            return false;
        }
                
    }
}
