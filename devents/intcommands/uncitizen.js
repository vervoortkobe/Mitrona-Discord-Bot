const Discord = require("discord.js");
const fs = require("fs");

module.exports.run = async (client, interaction, commandName, options, fs) => {
    
    let housingsteward = interaction.guild.roles.cache.find(r => r.id === `${process.env.HOUSINGSTEWARD_ROLE}`);
    let citizen = interaction.guild.roles.cache.find(r => r.id === `${process.env.CITIZEN_ROLE}`);
    
    if(!interaction.member.roles.cache.some(r => r.id === housingsteward.id)) {
      const uncitizenErrorReplyEmbed = new Discord.EmbedBuilder()
      .setColor(0xff0000)
      .setDescription(`❌ **|** ***Error: You don't have the sufficient role (${housingsteward}) to use this command!***`)
      return interaction.reply({ embeds: [ uncitizenErrorReplyEmbed ], ephemeral: true });
    }

    let member = interaction.guild.members.cache.get(options.get("member").value.replace("<@", "").replace(">", ""));

    if(!member) {
      const uncitizenMemberErrorReplyEmbed = new Discord.EmbedBuilder()
      .setColor(0xff0000)
      .setDescription(`❌ **|** ***Error: I couldn't remove the ${citizen} role to that member, because that isn't a valid member!***`)
      return interaction.reply({ embeds: [ uncitizenMemberErrorReplyEmbed ], ephemeral: true });
    }
    if(!member.roles.cache.some(r => r.id === citizen.id)) {
      const citizenMemberErrorReplyEmbed = new Discord.EmbedBuilder()
      .setColor(0xff0000)
      .setDescription(`❌ **|** ***Error: I couldn't remove the ${citizen} role from that member, because he/she doesn't have that role!***`)
      return interaction.reply({ embeds: [ citizenMemberErrorReplyEmbed ], ephemeral: true });
    }

    member.roles.remove(citizen);

    const uncitizenEmbed = new Discord.EmbedBuilder()
    .setColor(0x00ff00)
    .setTitle("⬇️ UNCITIZEN")
    .setDescription(`✅ **|** ***I have removed the ${citizen} role from ${member}!***`)
    interaction.reply({ embeds: [ uncitizenEmbed ], ephemeral: true });
  }

  module.exports.help = {
    name: "uncitizen"
}