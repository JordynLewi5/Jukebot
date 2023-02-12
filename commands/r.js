module.exports = {
    name: 'r',
    description: 'alias for remove',
    async execute(message,args,Discord,client){
        client.commands.get('remove').execute(message,args,Discord,client);
    }
}