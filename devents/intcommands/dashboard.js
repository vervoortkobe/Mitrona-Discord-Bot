const Discord = require("discord.js");
const fs = require("fs");
let perms = JSON.parse(fs.readFileSync("./perms.json", "utf-8"));

module.exports.run = async (client, interaction) => {
  
    const dashboardUrlButton = new Discord.ActionRowBuilder()
    .addComponents(
      new Discord.ButtonBuilder()
      .setLabel(`🌐 ${client.user.username} Dashboard`)
      .setStyle(Discord.ButtonStyle.Link)
      .setURL("https://mitrona.tsunami2360.repl.co/")
    );

    const dashboardEmbed = new Discord.EmbedBuilder()
    .setColor(0x00ff00)
    .setTitle("🌐 DASHBOARD")
    .setDescription(`✅ **|** ***Here you can visit the*** **[${client.user.username} Dashboard](https://mitrona.tsunami2360.repl.co/)** ***!***`)
    interaction.reply({ embeds: [ dashboardEmbed ], components: [ dashboardUrlButton ], ephemeral: true });
  }

  module.exports.help = {
    name: "dashboard",
    aliases: [],
    category: ""
}