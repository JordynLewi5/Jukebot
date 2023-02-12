
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json')
const token = config.token;
const prefix = config.prefix;
const { Player } = require("discord-music-player");
const player = new Player(client, {
    leaveOnEnd: true,
    leaveOnStop: true,
    leaveOnEmpty: true,
    timeout: 0,
    quality: 'low',
});
client.player = player;
const fs = require('fs');
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
let commands = [];
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name,command);
    commands.push(command.name);
}
client.login(token);

//require message eventListener
const messageEvent = require('./eventListeners/message');
//eventlisteners
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({ activity: { type: "PLAYING", name: `Music`}, status: 'online', })
    messageEvent(client, Discord, prefix, config, commands);    
  });