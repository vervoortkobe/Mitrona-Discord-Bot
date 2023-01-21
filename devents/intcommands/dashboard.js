const Discord = require("discord.js");
const fs = require("fs");

module.exports.run = async (client, interaction, commandName, options, fs) => {
  console.log("test");    
    if(!interaction.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
      const autoroleErrorReplyEmbed = new Discord.EmbedBuilder()
      .setColor(0xff0000)
      .setDescription(`❌ **|** ***Error: You don't have the sufficient permissions to use this command!***`)
      return interaction.reply({ embeds: [ autoroleErrorReplyEmbed ], ephemeral: true });
    }

    const dashboardEmbed = new Discord.EmbedBuilder()
    .setColor(0x00ff00)
    .setTitle("🌐 DASHBOARD")
    .setDescription(`✅ **|** ***Visit the dashboard with this URL: [Mitrona Dashboard](https://mitrona.tsunami2360.repl.co/)***`)
    interaction.reply({ embeds: [ dashboardEmbed ], ephemeral: true });
  }

  module.exports.help = {
    name: "dashboard"
}