const Discord = require("discord.js");
const fs = require("fs");

module.exports.run = async (client, message) => {

    if(message.author.bot) return;
    if(message.channel.type === "DM") return;

    let prefix = process.env.PREFIX;
    if(message.mentions.has(client.user) && message.content.includes("help")) {

        const mentionEmbed = new Discord.MessageEmbed()
        .setColor(0x03a9f4)
        .setAuthor(`🤖 | Mention`)
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(`Hey, ${message.author}!\n**» Current Prefix:** \`${prefix}\`\n**» Help Command:** \`${prefix}help\`\n**» Website: [rexbot.ga](https://rexbot.ga)**`)
        message.channel.send({ embeds: [ mentionEmbed ]})
        .then(message.react("🤖"));

    }
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
