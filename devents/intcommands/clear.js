const Discord = require("discord.js");
const fs = require("fs");

module.exports.run = async (client, interaction, commandName, options, fs) => {

    if(!interaction.member.permissions.has(Discord.PermissionsBitField.Flags.ManageMessages)) {
      const errorEmbed = new Discord.EmbedBuilder()
      .setColor(0xff0000)
      .setDescription(`❌ **|** ***Error: You don't have the sufficient permissions to use this command!***`)
      return interaction.reply({ embeds: [ errorEmbed ], ephemeral: true });
    }
  
    if(!interaction.guild.me.permissions.has(Discord.PermissionsBitField.Flags.ManageMessages)) {
      const errorEmbed = new Discord.EmbedBuilder()
      .setColor(0xff0000)
      .setDescription(`❌ **|** ***Error: I don't have the sufficient permissions to purge these messages!***`)
      return interaction.reply({ embeds: [ errorEmbed ], ephemeral: true });
    }

    let amountmsgs = options.get("amount").value;

    if(!options.get("amount") || !amountmsgs) {
      const errorEmbed = new Discord.EmbedBuilder()
      .setColor(0xff0000)
      .setDescription(`❌ **|** ***Error: Please define the amount of messages to purge!***`)
      return interaction.reply({ embeds: [ errorEmbed ], ephemeral: true });
    }

    if(isNaN(amountmsgs) || !typeof amountmsgs === "number" || !parseInt(amountmsgs) || !Number.isInteger(amountmsgs)) {
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

    var amount = parseInt(amountmsgs) + 1;

    interaction.channel.bulkDelete(amount);

    const purgeEmbed = new Discord.EmbedBuilder()
    .setColor(0x00ff00)
    .setDescription(`✅ **|** ***${message.author} purged \`${amount - 1}\` messages!***`)
    interaction.reply({ embeds: [ purgeEmbed ]})
    .then(m => setTimeout(() => m.delete(), 5000));
  }

  module.exports.help = {
    name: "clear"
}
