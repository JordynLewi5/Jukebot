module.exports = {
    name: 'prev',
    description: 'alias for back',
    async execute(message,args,Discord,client){
        client.commands.get('back').execute(message,args,Discord,client);
    }
}