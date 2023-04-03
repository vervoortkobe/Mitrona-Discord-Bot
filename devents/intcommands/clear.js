const Discord = require("discord.js");
const fs = require("fs");
let perms = JSON.parse(fs.readFileSync("./perms.json", "utf-8"));

module.exports.run = async (client, interaction) => {

    let serveradminrole = interaction.guild.roles.cache.find(r => r.id === process.env.MITRONA_SERVERADMIN_ROLE);
    if(!serveradminrole) {
      const serveradminErrorReplyEmbed = new Discord.EmbedBuilder()
      .setColor(0xff0000)
      .setDescription(`❌ **|** ***Error: I couldn't find the admin role of this server!***`)
      return interaction.reply({ embeds: [ serveradminErrorReplyEmbed ], ephemeral: true });
    }

    if(perms.admin.includes(interaction.member.id) || interaction.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) || interaction.member.roles.cache.has(serveradminrole) || perms.eval.includes(interaction.member.id)) {
    
      if(!interaction.guild.members.me.permissions.has(Discord.PermissionsBitField.Flags.ManageMessages)) {
        const errorEmbed = new Discord.EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`❌ **|** ***Error: I don't have the sufficient permissions to purge these messages!***`)
        return interaction.reply({ embeds: [ errorEmbed ], ephemeral: true });
      }

      let amountmsgs = interaction.options.get("amount").value;

      if(!interaction.options.get("amount") || !amountmsgs) {
        const errorEmbed = new Discord.EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`❌ **|** ***Error: Please define the amount of messages to purge!***`)
        return interaction.reply({ embeds: [ errorEmbed ], ephemeral: true });
      }

      if(isNaN(amountmsgs) || !typeof amountmsgs === "number" || !parseInt(amountmsgs)) {
        const errorEmbed = new Discord.EmbedBuilder()
        .setColor(0x00ff00)
        .setDescription(`❌ **|** ***Error: I couldn't purge these messages, because you didn't give a valid amount of messages!***`)
        return interaction.reply({ embeds: [ errorEmbed ], ephemeral: true });
      }

      if(Number(amountmsgs) < 1 || Number(amountmsgs) > 99) {
        const errorEmbed = new Discord.EmbedBuilder()
        .setColor(0x00ff00)
        .setDescription(`❌ **|** ***Error: I couldn't purge these messages, because the amount of messages to purge has to be between \`1\` and \`99\`!***`)
        return interaction.reply({ embeds: [ errorEmbed ], ephemeral: true });
      }

      let amount = parseInt(amountmsgs) + 1;

      interaction.channel.messages.fetch({ limit: amount, cache: false })
      .then(msgs => {
        let msgstooold = 0;
        msgs.forEach(m => {
          if(m.createdTimestamp + 1209600 <= Date.now()) msgstooold++;
        });
        if(msgstooold >= 1) {
          const purgeErrorEmbed = new Discord.EmbedBuilder()
          .setColor(0xff0000)
          .setDescription(`❌ **|** ***I couldn't purge \`${amount - 1}\` messages, because there are \`${msgstooold}\` messages older than 14 days!***`)
          return interaction.reply({ embeds: [ purgeErrorEmbed ]});
        } else {
          interaction.channel.bulkDelete(amount);
      
          const purgeEmbed = new Discord.EmbedBuilder()
          .setColor(0x00ff00)
          .setDescription(`✅ **|** ***${interaction.member} purged \`${amount - 1}\` messages!***`)
          return interaction.reply({ embeds: [ purgeEmbed ]});
        }
      })
      .catch(console.error);

    } else {
      const permsErrorReplyEmbed = new Discord.EmbedBuilder()
      .setColor(0xff0000)
      .setDescription(`❌ **|** ***Error: You don't have the sufficient permissions to use this command!***`)
      return interaction.reply({ embeds: [ permsErrorReplyEmbed ], ephemeral: true });
    }
  }

  module.exports.help = {
    name: "clear",
    aliases: [],
    category: ""
}