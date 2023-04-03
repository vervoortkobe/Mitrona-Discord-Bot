module.exports.run = async (client, message, mongoClient) => {

    if(message.author.bot) return;
    if(message.channel.type === "DM") return;

    let prefix = process.env.PREFIX;
    if(message.mentions.has(client.user)) {
      let commandfile = require("./intcommands/help.js");
      if(commandfile) eventfile.run(client, message, args, mongoClient);
    }
    
    if(!message.content.toLowerCase().startsWith(prefix)) return;
    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

    let commandfile = client.commands.get(command.slice(prefix.length)) || client.commands.get(client.aliases.get(command.slice(prefix.length)));
    if(commandfile) commandfile.run(client, message, args, mongoClient);
  }

  module.exports.help = {
    name: "messageCreate"
}