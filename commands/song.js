let songMessageStack = [];
module.exports = {
    name: 'song',
    description: 'displays current queue',
    async execute(message,args,Discord,client){
        const TextChannel = client.channels.cache.get(JSON.parse(localStorage.getItem('textChannelID')));
        const VoiceChannel = client.channels.cache.get(JSON.parse(localStorage.getItem('voiceChannelID')));
        let songNum = JSON.parse(localStorage.getItem('songNum'));
        let queue = await client.player.getQueue(message.guild.id);
        let lines = [];

        try{
            songMessageStack.map(async songMsg => {
                if (await client.channels.cache.get(songMsg.channel.id) !== undefined) {
                    if (await client.channels.cache.get(songMsg.channel.id).messages.fetch(songMsg.id) !== undefined) {
                        try {
                            await songMsg.delete(); 
                            await songMessageStack.shift()
                        } catch (error) { console.error(error.name) }
                    }
                }
            })
        } catch (error) { console.log(error) }

        try{
            TextChannel.send(new Discord.MessageEmbed().setAuthor('Gamenight Music', 'https://i.imgur.com/XivpRjd.png')
            .setDescription(`**Current Track **\n "[${queue.songs[songNum].name}](${queue.songs[songNum].url})"\n${client.player.createProgressBar(message.guild.id, 20, '\\🔘', '\\◽')}\nTrack **#${songNum + 1}** of ${queue.songs.length}`)
            .setThumbnail(queue.songs[songNum].thumbnail))
            .then(async message => {
                songMessageStack.push(message);
            });
        } catch (error){
            console.log(error)
            TextChannel.send(JSON.stringify(await error))
        }
    }
}

function shortenName(name, maxLength) {
    let str = '';
    for (let i = 0; i < name.length; i++) {
        if (i < maxLength) {
            if (name.charAt(i) === '*' || name.charAt(i) === '_' || name.charAt(i) === '\\' || name.charAt(i) === `[` || name.charAt(i) === `]`) {
                str += `\\${name.charAt(i)}`;
            } else {
                str += name.charAt(i);
            }
        }
    }
    return str + ' ...';

}

    /**
     * Converts Milliseconds to Time (HH:MM:SS)
     * @param {String} ms Milliseconds
     * @returns {String}
     */
    function MillisecondsToTime(ms) {
        let seconds = ms / 1000;
        let hours = parseInt(seconds / 3600);
        seconds = seconds % 3600;
        let minutes = parseInt(seconds / 60);
        seconds = Math.ceil(seconds % 60);

        seconds = (`0${seconds}`).slice(-2);
        minutes = (`0${minutes}`).slice(-2);
        hours = (`0${hours}`).slice(-2);

        return `${hours === 0 ? '' : `${hours}:`}${minutes}:${seconds}`;
    }

    /**
     * Converts Time (HH:MM:SS) to Milliseconds
     * @param {String} time Time
     * @returns {number}
     */
    function TimeToMilliseconds(time) {
        let items = time.split(':'),
            s = 0, m = 1;

        while (items.length > 0) {
            s += m * parseInt(items.pop(), 10);
            m *= 60;
        }

        return s * 1000;
    }