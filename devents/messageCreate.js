const Discord = require("discord.js");

module.exports.run = async (client, message, db) => {

    if(message.author.bot) return;
    if(message.channel.type === "DM") return console.log(`| > @${message.author.tag}: ${message.content}`);

    let prefix = process.env.PREFIX;
    if(message.mentions.has(client.user)) return;
    
    if(!message.content.toLowerCase().startsWith(prefix)) return;
    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

    let commandfile = client.commands.get(command.slice(prefix.length)) || client.commands.get(client.aliases.get(command.slice(prefix.length)));
    if(commandfile) commandfile.run(client, message, args, db);
  }

  module.exports.help = {
    name: "messageCreate"
}