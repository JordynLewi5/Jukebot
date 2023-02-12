let queueMessageStack = [];
module.exports = {
    name: 'queue',
    description: 'displays current queue',
    async execute(message,args,Discord,client){
        const TextChannel = client.channels.cache.get(JSON.parse(localStorage.getItem('textChannelID')));
        const VoiceChannel = client.channels.cache.get(JSON.parse(localStorage.getItem('voiceChannelID')));

        const pageLength = 15;
        let page = 0;
        let lines = [];
        let footerLines = [];

        let queue = await client.player.getQueue(message.guild.id);
        let songNum = JSON.parse(localStorage.getItem('songNum'));
        let maxQueue = JSON.parse(localStorage.getItem('queueLimit')).base;
        if (message.member.roles.cache.some(role => role.id === '822505604764532796'))
            maxQueue = JSON.parse(localStorage.getItem('queueLimit')).premium;
        console.log(maxQueue);
        maxQueue = Math.max(queue.songs.length, maxQueue);
        console.log(maxQueue);

        let maxPage = Math.floor(((queue.songs.length)/pageLength));
        maxPage = Math.min((Math.ceil(maxQueue / pageLength)) - 1, maxPage )
        let totalDuration = 0;
        
        if (queue.songs.length % pageLength === 0 && queue.songs.length < maxQueue) maxPage--;

        if(isNaN(args[0]) || args[0] === undefined || args[0] <= 0){
            page = 0;
        }else{
            page = Math.min(maxPage,args[0]-1);
        }

        if( queue === undefined || queue.songs.length === 0)
            return TextChannel.send(new Discord.MessageEmbed().setAuthor('Gamenight Music', 'https://i.imgur.com/mSf8k1b.png').setTitle(`Your queue is empty.`).setDescription(`Nothing to see here.`))
            
        //try to create queue display


        try{
            queue.songs.map((song) => {
                totalDuration += TimeToMilliseconds(song.duration)
            })
            totalDuration = MillisecondsToTime(totalDuration);

            for (let i = (page)*pageLength; i < ((page == maxPage + 1)?(page)*pageLength+queue.songs.length%pageLength:(page)*pageLength+pageLength); i++){
                try {
                    //header of the queue
                    lines.push(`${i === page * pageLength?'__ ᅟᅟ ᅟᅟᅟᅟ ᅟᅟᅟᅟᅟ ᅟᅟᅟᅟᅟᅟᅟᅟᅟᅟᅟᅟᅟᅟᅟᅟᅟᅟᅟ__\n':''}`);
                    //if not on first page, display the number of previous songs
                    (i === (page)*pageLength && page !== 0)?lines.push(`__*...${i} previous track(s)*__`):'';
                    //add each song to queue display with special formatting for current songNum
                    lines.push(`\n${i+1}) [${i === songNum?'\`':''}${shortenName(queue.songs[i].name, 20)}${i === songNum?'\`':''}](${queue.songs[i].url}) • ${shortenName(queue.songs[i].author, 15)} - ${queue.songs[i].duration} ${i === songNum?'':''}`);
                    //number of remaining songs
                    (i === (page)*pageLength+pageLength-1 && page !== maxPage)?lines.push(`\n__*${queue.songs.length - (i+1)} more track(s)...*__`):'';
                } catch {}
            }
            lines.push(`\n__ ᅟᅟ ᅟᅟᅟᅟ ᅟᅟᅟᅟᅟ ᅟᅟᅟᅟᅟᅟᅟᅟᅟᅟᅟᅟᅟᅟᅟᅟᅟᅟᅟ__\n`);
            lines.push(`\n**Total Duration:** **[**${totalDuration}**]**`);
            lines.push(`\n**Total Tracks:** ${queue.songs.length}`);
            lines.push(`\n\`Page ${page+1}/${maxPage + 1}\` Use *-queue [page #]*\n`);
            lines.push(`\n**Current track:**\n\`${songNum+1}) ${shortenName(queue.songs[songNum].name, 60)}\``);
            lines.push('\n' + client.player.createProgressBar(message.guild.id, 30, '\\🔘', '\\◽'));


        }catch(error){
            console.log(error);
            return TextChannel.send(new Discord.MessageEmbed().setAuthor('Gamenight Music', 'https://i.imgur.com/mSf8k1b.png').setDescription('Please wait until your music has started playing.'));
        }
        try{
            queueMessageStack.map(async queueMsg => {
                if (await client.channels.cache.get(queueMsg.channel.id) !== undefined) {
                    if (await client.channels.cache.get(queueMsg.channel.id).messages.fetch(queueMsg.id) !== undefined) {
                        try {
                            let msg = await TextChannel.messages.fetch(queueMsg.id);
                            console.log(msg.deleted)
                            if (!queueMsg.deleted) await queueMsg.delete();
                            setTimeout( async () => {
                                if (queueMsg.deleted) await queueMessageStack.shift()
                            },1000);
                        } catch (error) { 
                            await queueMessageStack.shift();
                        }
                    }
                }
            })
        } catch (error) { console.log(error) }

        try {
            await TextChannel.send(new Discord.MessageEmbed().setAuthor('Gamenight Music', 'https://i.imgur.com/XivpRjd.png').setDescription(lines.join('')))
            .then(message => {
                queueMessageStack.push(message);
            });
        } catch (err) {
            console.log(err); 
        }
    }
}

function shortenName(name, maxLength) {
    let str = '';
    let i;
    for (i = 0; i < maxLength; i++) {
        if (i >= name.length) break;


        switch (name.charAt(i)) {
            case '*':
                str += `\\*`;
            break;

            case '_':
                str += `\\_`;

            break;

            case '[':
                str += `﹝`;

            break;

            case ']':
                str += `﹞`;

            break;

            default:
                str += name.charAt(i);
            break;
        }          
    }

    if (i < name.length) str += ' ...'; 
    return '' + str + '';
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