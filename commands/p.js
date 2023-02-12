module.exports = {
    name: 'p',
    description: 'alias for play',
    async execute(message,args,Discord,client){
        client.commands.get('play').execute(message,args,Discord,client);
    }
}