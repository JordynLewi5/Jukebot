module.exports = async (client, Discord, prefix, message, botNum, jukebotRoleID) => {
    const guild = message.guild;
    const member = message.member;
    const voiceChannel = member.voice.channel;

    if (voiceChannel === null) return;

    if (await thisBotInChannel(client, voiceChannel)) return true;

    if (await firstAvailable(client, voiceChannel, guild, message, jukebotRoleID) == botNum) return botNum;

    return await firstAvailable(client, voiceChannel, guild, message, jukebotRoleID);

    // if (firstAvailable(client, voiceChannel, guild, message) === null) return null;

    // return false;
}



//check if this Jukebot is in channel
async function thisBotInChannel(client, voiceChannel) {
    available = false;
    await voiceChannel.members.map(_member => {
        if (_member && _member.user.id === client.user.id) available = true;
    })
    console.log('Juke4 in channel?', available);
    return available;
}

//find first available bot
async function firstAvailable(client, voiceChannel, guild, message, jukebotRoleID) {
    available = null;
    await message.guild.roles.cache.get(jukebotRoleID).members.map(member => {
        console.log(member.user.username, member.voice.channel === null && member.user.presence.status == 'online' && available === null);
        if (member.voice.channel === null && member.user.presence.status == 'online' && available === null) available = member.user.username.substring(member.user.username.length - 1, member.user.username.length);
    });
    await voiceChannel.members.map(_member => {
        if (_member.user.bot) available = false;
    })
    return available;
    
}
