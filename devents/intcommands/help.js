const Discord = require("discord.js");

module.exports.run = async (client, interaction, db) => {
  
    let fetchedperms = await db.collection("perms").find().toArray();
    let perms = fetchedperms[0];
    
    const helpAdminEmbed = new Discord.EmbedBuilder()
    .setColor(0x016701)
    .setTitle(`🤖 | HELP`)
    .setThumbnail(client.user.displayAvatarURL())
    .setDescription(`***• Here are ${client.user.username}'s commands:***`)
    .setFooter({ iconURL: client.user.displayAvatarURL(), text: "Administrator" })

    if(perms.admin.includes(interaction.member.id) || interaction.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) || interaction.member.roles.cache.has(serveradminrole) || perms.eval.includes(interaction.member.id)) helpAdminEmbed.addFields(
        { name: `❓ | Default (2)`, value: `\`\`\`/help, /ping\`\`\`` },
        { name: `🔒 | Administrator (10)`, value: `\`\`\`/announce, /autorole, /citizen, /clear, /dashboard, /gcancel, /gcheck, /gend, /giveaway, /greroll, /uncitizen\`\`\`` },
        { name: `🎖️ | Special (3)`, value: `\`\`\`/eval, /geoip, /restart\`\`\`` }
      )
    else helpAdminEmbed.addFields(
      { name: `❓ | Default (2)`, value: `\`\`\`/help, /ping\`\`\`` }
    )
    
    if(interaction.isChatInputCommand() && interaction.isCommand()) interaction.reply({ embeds: [ helpAdminEmbed ], ephemeral: true });
    else interaction.reply(helpAdminEmbed);
  }

  module.exports.help = {
    name: "help",
    aliases: [],
    category: ""
}