module.exports = {
    name: 'mix',
    description: 'alias for shuffle',
    async execute(message,args,Discord,client){
        client.commands.get('shuffle').execute(message,args,Discord,client);
    }
}