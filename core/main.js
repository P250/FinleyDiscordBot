const Discord = require('discord.js');
const fs = require('fs');
const { exit } = require('process');
const client = new Discord.Client();
const commandFiles = fs.readdirSync('../commands/').filter(file => file.endsWith('.js'));
const {prefix, token} = require('./config.json');
client.commands = new Discord.Collection();
var channelMemberDisplay;
var channelGuild;
var channelMemberCount;

for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('error', err => {
    console.log(err);
    exit();
});

client.on('ready', () => {
    console.log('Bot ready.');

    client.channels.cache.map(channel => {
        if (channel.name.startsWith("Members:")) {
            channelMemberDisplay = channel;
            
            client.guilds.cache.map(guild => {
                channelGuild = guild.channels.cache.get(channel.id).guild;
                channelMemberCount = channelGuild.memberCount;

                setInterval(updateMemberCount => {
                    channelMemberDisplay.setName("Members: " + channelMemberCount);
                }, 1000 * 300 /** 5 minutes **/);
                return;
            });
        }
    });
});

client.on('guildMemberAdd', member => {
    channelMemberCount++;
});

client.on('guildMemberRemove', member => {
    channelMemberCount--;
});

client.on('message', message => {
    if (!(message.content.startsWith(prefix))) {
        return;
    }

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args[0];

    console.log(command);

    if (command == 'test') {
        client.commands.get('test').execute(message, args);
    }

});

client.login(token);