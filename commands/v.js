module.exports = {
    name: 'v',
    description: 'alias for volume',
    async execute(message,args,Discord,client){
        client.commands.get('volume').execute(message,args,Discord,client);
    }
}