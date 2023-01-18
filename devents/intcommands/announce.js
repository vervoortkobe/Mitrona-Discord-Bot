const Discord = require("discord.js");
const fs = require("fs");

module.exports.run = async (client, interaction, commandName, options, fs) => {

    if(!interaction.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
      const announcePermsErrorReplyEmbed = new Discord.EmbedBuilder()
      .setColor(0xff0000)
      .setDescription(`❌ **|** ***Error: You don't have the sufficient permissions to use this command!***`)
      return interaction.reply({ embeds: [ announcePermsErrorReplyEmbed ], ephemeral: true });
    }

    let color;
    let colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
    if(colors.includes(options.get("color").value.toLowerCase())) {
      if(options.get("color").value.toLowerCase() === "red") color = "#ff0000";
      if(options.get("color").value.toLowerCase() === "orange") color = "#ff7f00";
      if(options.get("color").value.toLowerCase() === "yellow") color = "#ffff00";
      if(options.get("color").value.toLowerCase() === "green") color = "#00ff00";
      if(options.get("color").value.toLowerCase() === "blue") color = "#0000ff";
      if(options.get("color").value.toLowerCase() === "indigo") color = "#4B0082";
      if(options.get("color").value.toLowerCase() === "violet") color = "#9400D3";
    } else {
      const announceColorErrorReplyEmbed = new Discord.EmbedBuilder()
      .setColor(0xff0000)
      .setDescription(`❌ **|** ***Error: I couldn't make an announcement with color \`${options.get("color").value}\`, because that color isn't a valid option!***`)
      return interaction.reply({ embeds: [ announceColorErrorReplyEmbed ], ephemeral: true });
    }

    let announceTitle = options.get("title").value;
    let announcement = options.get("announcement").value;
    let announceChannel = interaction.guild.channels.cache.find(c => c.id === options.get("channel").value.replace("<#", "").replace(">", ""));
    
    if(!announceChannel) {
      const announceErrorReplyEmbed = new Discord.EmbedBuilder()
      .setColor(0xff0000)
      .setDescription(`❌ **|** ***Error: I couldn't make an announcement in ${announceChannel}, because that #channel doesn't exist!***`)
      return interaction.reply({ embeds: [ announceErrorReplyEmbed ], ephemeral: true });
    }

    const announceReplyEmbed = new Discord.EmbedBuilder()
    .setColor(0x00ff00)
    .setDescription(`✅ **|** ***A new announcement has been made in ${announceChannel}!***`)
    interaction.reply({ embeds: [ announceReplyEmbed ], ephemeral: true });

    const announceEmbed = new Discord.EmbedBuilder()
    .setColor(`${color}`)
    .setTitle(`${announceTitle}`)
    .setDescription(`${announcement}`)
    .setTimestamp()
    announceChannel.send({ embeds: [ announceEmbed ] });
  }

  module.exports.help = {
    name: "announce"
}
