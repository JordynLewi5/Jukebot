module.exports = {
    name: 'current',
    description: 'alias for song',
    async execute(message,args,Discord,client){
        client.commands.get('song').execute(message,args,Discord,client);
    }
}