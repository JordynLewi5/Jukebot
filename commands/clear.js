module.exports = {
    name: 'clear',
    description: 'alias for remove',
    async execute(message,args,Discord,client){
        client.commands.get('remove').execute(message,args,Discord,client);
    }
}