const Discord = require("discord.js");

module.exports.run = async (client, message, db) => {

    if(message.author.bot) return;
    if(message.channel.type === "DM") return;

    let prefix = process.env.PREFIX;
    if(message.mentions.has(client.user)) {
      let fetchedperms = await db.collection("perms").find().toArray();
      let perms = fetchedperms[0];
      
      const helpEmbed = new Discord.EmbedBuilder()
      .setColor(0x016701)
      .setTitle(`🤖 | HELP`)
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription(`***• Here are ${client.user.username}'s commands:***`)
  
      if(perms.admin.includes(message.author.id) || message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) || message.member.roles.cache.has(serveradminrole) || perms.eval.includes(message.author.id)) {
        helpEmbed.addFields({ name: `❓ | Default (2)`, value: `\`\`\`/help, /ping\`\`\`` }, { name: `🔒 | Administrator (10)`, value: `\`\`\`/announce, /autorole, /citizen, /clear, /dashboard, /gcancel, /gcheck, /gend, /giveaway, /greroll, /uncitizen\`\`\`` }, { name: `🎖️ | Special (3)`, value: `\`\`\`/eval, /geoip, /restart\`\`\`` })
        .setFooter({ iconURL: client.user.displayAvatarURL(), text: `${client.user.username} | Administrator` })
      } else {
        helpEmbed.addFields({ name: `❓ | Default (2)`, value: `\`\`\`/help, /ping\`\`\`` })
        .setFooter({ iconURL: client.user.displayAvatarURL(), text: `${client.user.username} | Default` })
      }
      
      message.reply({ embeds: [helpEmbed] });
    }
    
    if(!message.content.toLowerCase().startsWith(prefix)) return;
    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

    let commandfile = client.commands.get(command.slice(prefix.length)) || client.commands.get(client.aliases.get(command.slice(prefix.length)));
    if(commandfile) commandfile.run(client, message, args, db);
  }

  module.exports.help = {
    name: "messageCreate"
}