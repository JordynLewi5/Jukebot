module.exports = {
    name: 'q',
    description: 'alias for queue',
    async execute(message,args,Discord,client){
        client.commands.get('queue').execute(message,args,Discord,client);
    }
}