module.exports = {
    name: 'unloop',
    description: 'unloops queue',
    async execute(message,args,Discord,client){
        message.channel.send(new Discord.MessageEmbed().setAuthor('Gamenight Music', 'https://i.imgur.com/v4SxY1N.png').setDescription('Looping has been disabled. Sorry for any inconvenience.'))
    }
}