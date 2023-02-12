module.exports = {
    name: 'to',
    description: 'alias for jump',
    async execute(message,args,Discord,client){
        client.commands.get('jump').execute(message,args,Discord,client);
    }
}