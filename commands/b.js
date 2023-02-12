module.exports = {
    name: 'b',
    description: 'alias for back',
    async execute(message,args,Discord,client){
        client.commands.get('back').execute(message,args,Discord,client);
    }
}