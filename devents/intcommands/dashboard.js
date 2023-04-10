const Discord = require("discord.js");

module.exports.run = async (client, interaction, db) => {
  
    let fetchedperms = await db.collection("perms").find().toArray();
    let perms = fetchedperms[0];
  
    if(perms.admin.includes(interaction.member.id) || interaction.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) || interaction.member.roles.cache.has(serveradminrole)) {

      const dashboardUrlButton = new Discord.ActionRowBuilder()
      .addComponents(
        new Discord.ButtonBuilder()
        .setLabel(`🌐 ${client.user.username} Dashboard`)
        .setStyle(Discord.ButtonStyle.Link)
        .setURL("https://mitrona.tsunami2360.repl.co/")
      );

      const dashboardEmbed = new Discord.EmbedBuilder()
      .setColor(process.env.COLOR)
      .setTitle("🌐 DASHBOARD")
      .setDescription(`✅ **|** ***Here you can visit the*** **[${client.user.username} Dashboard](https://mitrona.tsunami2360.repl.co/)** ***!***`)
      interaction.reply({ embeds: [ dashboardEmbed ], components: [ dashboardUrlButton ], ephemeral: true });
    }
  }

  module.exports.help = {
    name: "dashboard",
    aliases: [],
    category: ""
}