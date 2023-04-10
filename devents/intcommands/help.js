const Discord = require("discord.js");

module.exports.run = async (client, interaction, db) => {
  
    let fetchedperms = await db.collection("perms").find().toArray();
    let perms = fetchedperms[0];
    
    const helpEmbed = new Discord.EmbedBuilder()
    .setColor(0x016701)
    .setTitle(`🤖 | HELP`)
    .setThumbnail(client.user.displayAvatarURL())
    .setDescription(`***• Here are ${client.user.username}'s commands:***`)

    if(perms.admin.includes(interaction.member.id) || interaction.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) || interaction.member.roles.cache.has(serveradminrole)) {
      
      helpEmbed.addFields({ name: `❓ | Default (2)`, value: `\`\`\`/help, /ping\`\`\`` }, { name: `🔒 | Administrator (10)`, value: `\`\`\`/announce, /autorole, /citizen, /clear, /dashboard, /gcancel, /gcheck, /gend, /giveaway, /greroll, /uncitizen\`\`\`` }, { name: `🎖️ | Special (3)`, value: `\`\`\`/eval, /geoip, /restart\`\`\`` })
      .setFooter({ iconURL: client.user.displayAvatarURL(), text: `${client.user.username} | Administrator` })
    } else {
      helpEmbed.addFields({ name: `❓ | Default (2)`, value: `\`\`\`/help, /ping\`\`\`` })
      .setFooter({ iconURL: client.user.displayAvatarURL(), text: `${client.user.username} | Default` })
    }
    
    interaction.reply({ embeds: [ helpEmbed ], ephemeral: true });
  }

  module.exports.help = {
    name: "help",
    aliases: [],
    category: ""
}