module.exports = {
    name: 'disconnect',
    description: 'alias for leave',
    async execute(message,args,Discord,client){
        client.commands.get('leave').execute(message,args,Discord,client);
    }
}