const Discord = require("discord.js");

module.exports.run = async (client, interaction, db) => {
    
    const mEmbed = new Discord.EmbedBuilder()
    .setColor(0x03a9f4)
    .setDescription(`🔍 **|** ***Calculating...***`)

    const m = Date.now();
    await interaction.reply({ embeds: [ mEmbed ], ephemeral: true });
  
    const pingEmbed = new Discord.EmbedBuilder()
    .setColor(0x00ff00)
    .setTitle(`🏓 PING`)
    .setThumbnail(client.user.displayAvatarURL())
    .setDescription(`***Pong!***\n> 💬 **| Message Latency:** \`${Date.now() - m}\`**ms**
    > 🤖 **| Discord API Heartbeat:** \`${Math.round(client.ws.ping)}\`**ms**`)
    interaction.editReply({ embeds: [ pingEmbed ], ephemeral: true });
  }

  module.exports.help = {
    name: "ping",
    aliases: [],
    category: ""
}