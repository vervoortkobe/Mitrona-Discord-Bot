module.exports.run = async (client, message, mongoClient) => {

    if(message.author.bot) return;
    if(message.channel.type === "DM") return;

    let prefix = process.env.PREFIX;
    if(message.mentions.has(client.user)) message.reply({ content: "Pong!" });
    
    if(!message.content.toLowerCase().startsWith(prefix)) return;
    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

    let commandfile = client.commands.get(command.slice(prefix.length)) || client.commands.get(client.aliases.get(command.slice(prefix.length)));
    if(commandfile) commandfile.run(client, message, args);
  }

  module.exports.help = {
    name: "messageCreate"
}