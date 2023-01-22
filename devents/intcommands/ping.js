const Discord = require("discord.js");
const fs = require("fs");

module.exports.run = async (client, interaction) => {
    
    const mEmbed = new Discord.EmbedBuilder()
    .setColor(0x03a9f4)
    .setDescription(`🔍 **|** ***Calculating...***`)

    const m = await interaction.reply({ embeds: [ mEmbed ], ephemeral: true });

    const pingEmbed = new Discord.EmbedBuilder()
    .setColor(0x00ff00)
    .setTitle(`🏓 PING`)
    .setThumbnail(client.user.displayAvatarURL())
    .setDescription(`***Pong!***\n> 💬 **| Message Latency:** \`${m.createdTimestamp - message.createdTimestamp}\`**ms**
    > 🤖 **| Discord API Heartbeat:** \`${Math.round(client.ws.ping)}\`**ms**`)
    m.edit({ embeds: [ pingEmbed ], ephemeral: true });
  }

  module.exports.help = {
    name: "ping"
}
