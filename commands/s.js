module.exports = {
    name: 's',
    description: 'alias for skip',
    async execute(message,args,Discord,client){
        client.commands.get('skip').execute(message,args,Discord,client);
    }
}