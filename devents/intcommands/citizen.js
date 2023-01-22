const Discord = require("discord.js");
const fs = require("fs");

module.exports.run = async (client, interaction) => {

    let housingsteward = interaction.guild.roles.cache.find(r => r.id === `${process.env.HOUSINGSTEWARD_ROLE}`);
    let citizen = interaction.guild.roles.cache.find(r => r.id === `${process.env.CITIZEN_ROLE}`);

    if(!interaction.member.roles.cache.some(r => r.id === housingsteward.id)) {
      const citizenErrorReplyEmbed = new Discord.EmbedBuilder()
      .setColor(0xff0000)
      .setDescription(`❌ **|** ***Error: You don't have the sufficient role (${housingsteward}) to use this command!***`)
      return interaction.reply({ embeds: [ citizenErrorReplyEmbed ], ephemeral: true });
    }

    let member = interaction.guild.members.cache.get(interaction.options.get("member").value.replace("<@", "").replace(">", ""));

    if(!member) {
      const citizenMemberErrorReplyEmbed = new Discord.EmbedBuilder()
      .setColor(0xff0000)
      .setDescription(`❌ **|** ***Error: I couldn't give the ${citizen} role to that member, because that isn't a valid member!***`)
      return interaction.reply({ embeds: [ citizenMemberErrorReplyEmbed ], ephemeral: true });
    }
    if(member.roles.cache.some(r => r.id === citizen.id)) {
      const citizenMemberErrorReplyEmbed = new Discord.EmbedBuilder()
      .setColor(0xff0000)
      .setDescription(`❌ **|** ***Error: I couldn't give the ${citizen} role to that member, because he/she already has that role!***`)
      return interaction.reply({ embeds: [ citizenMemberErrorReplyEmbed ], ephemeral: true });
    }

    member.roles.add(citizen);

    const citizenEmbed = new Discord.EmbedBuilder()
    .setColor(0x00ff00)
    .setTitle("⬆️ CITIZEN")
    .setDescription(`✅ **|** ***I have given the ${citizen} role to ${member}!***`)
    interaction.reply({ embeds: [ citizenEmbed ], ephemeral: true });
  }

  module.exports.help = {
    name: "citizen"
}
