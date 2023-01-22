const Discord = require("discord.js");
const fs = require("fs");

module.exports.run = async (client, interaction) => {
    
    if(!interaction.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
      const autoroleErrorReplyEmbed = new Discord.EmbedBuilder()
      .setColor(0xff0000)
      .setDescription(`❌ **|** ***Error: You don't have the sufficient permissions to use this command!***`)
      return interaction.reply({ embeds: [ autoroleErrorReplyEmbed ], ephemeral: true });
    }

    let mode = interaction.options.get("mode").value;
    let role;
    let rolenameid;
    if(interaction.options.get("role") && interaction.options.get("role").value) {
      role = interaction.options.get("role").value;
      rolenameid = interaction.guild.roles.cache.find(r => r.id === role.replace("<@&", "").replace(">", ""));
      if(!rolenameid) {
        const autoroleRoleErrorReplyEmbed = new Discord.EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`❌ **|** ***Error: I couldn't !***`)
        return interaction.reply({ embeds: [ autoroleRoleErrorReplyEmbed ], ephemeral: true });
      }
    }

    let autoroles = JSON.parse(fs.readFileSync("./autoroles.json", "utf-8"));
      
    let text = "";
    if(!autoroles[interaction.guild.id]) {
      text = `> ❌ \`Not configured yet\``;
    } else {
      autoroles[interaction.guild.id].forEach(ar => {
        text += `> ✅ <@&${ar}>\n`;
      });
    }

    if(!mode || !mode === "check" || !mode === "add" || !mode === "remove" || !role || !rolenameid) {
      const autoroleUsageEmbed = new Discord.EmbedBuilder()
      .setColor(0xff0000)
      .setTitle(`⚙️ AUTOROLE`)
      .setDescription(`❌ **|** ***Usage: /autorole <add/remove> <@role/role ID>***\n**» Autorole(s):**\n${text}`)
      return interaction.reply({ embeds: [ autoroleUsageEmbed ], ephemeral: true });
    }

    if(mode === "check") {
      const autoroleUsageEmbed = new Discord.EmbedBuilder()
      .setColor(`${process.env.COLOR}`)
      .setTitle(`⚙️ AUTOROLE`)
      .setDescription(`**» Autorole(s):**\n${text}`)
      return interaction.reply({ embeds: [ autoroleUsageEmbed ], ephemeral: true });
    }

    if(mode === "add") {
      if(autoroles[interaction.guild.id].includes(rolenameid.id)) {
        const autoroleRemoveErrorReplyEmbed = new Discord.EmbedBuilder()
        .setColor(0xff0000)
        .setTitle(`⚙️ AUTOROLE`)
        .setDescription(`❌ **|** ***Error: I couldn't add ${rolenameid} to the autoroles, because that role is an autorole already!***`)
        return interaction.reply({ embeds: [ autoroleRemoveErrorReplyEmbed ], ephemeral: true });
      }

      if(!autoroles[interaction.guild.id]) {
        autoroles[interaction.guild.id] = [];
      }

      autoroles[interaction.guild.id] = 
        autoroles[interaction.guild.id].push(rolenameid.id);

      fs.writeFile("./autoroles.json", JSON.stringify(autoroles), (err) => {
        if(err) console.log(err);
      });

      delete require.cache[require.resolve("../autoroles.json")];
      const autoroleAddEmbed = new Discord.EmbedBuilder()
      .setColor(0x00ff00)
      .setTitle("⚙️ AUTOROLE")
      .setDescription(`✅ **|** ***An autorole has been added: ${rolenameid}***`)
      interaction.reply({ embeds: [ autoroleAddEmbed ], ephemeral: true });
    }

    if(mode === "remove") {
      if(!autoroles[interaction.guild.id].includes(rolenameid.id)) {
        const autoroleRemoveErrorReplyEmbed = new Discord.EmbedBuilder()
        .setColor(0xff0000)
        .setTitle(`⚙️ AUTOROLE`)
        .setDescription(`❌ **|** ***Error: I couldn't remove ${rolenameid} from the autoroles, because that role is not an autorole!***`)
        return interaction.reply({ embeds: [ autoroleRemoveErrorReplyEmbed ], ephemeral: true });
      }

      if(!autoroles[interaction.guild.id]) {
        autoroles[interaction.guild.id] = [];
      }

      autoroles[interaction.guild.id] = 
        autoroles[interaction.guild.id].filter(e => e !== rolenameid.id);

      fs.writeFile("./autoroles.json", JSON.stringify(autoroles), (err) => {
        if(err) console.log(err);
      });

      delete require.cache[require.resolve("../autoroles.json")];
      const autoroleRemoveEmbed = new Discord.EmbedBuilder()
      .setColor(0x00ff00)
      .setTitle("⚙️ AUTOROLE")
      .setDescription(`✅ **|** ***An autorole has been removed: ${rolenameid}***`)
      interaction.reply({ embeds: [ autoroleRemoveEmbed ], ephemeral: true });
    }
  }

  module.exports.help = {
    name: "autorole"
}
