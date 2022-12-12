const Discord = require("discord.js");
const fs = require("fs");

module.exports.run = async (client, interaction) => {

    if(!interaction.isCommand()) return;
    const { commandName, options } = interaction;

//ANNOUNCE
    if(commandName === "announce") {
      if(!interaction.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
        const announcePermsErrorReplyEmbed = new Discord.EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`❌ **|** ***Error: You don't have the sufficient permissions to use this command!***`)
        return interaction.reply({ embeds: [ announcePermsErrorReplyEmbed ], fetchReply: true, ephemeral: true });
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
        return interaction.reply({ embeds: [ announceColorErrorReplyEmbed ], fetchReply: true, ephemeral: true });
      }

      let announceTitle = options.get("title").value;
      let announcement = options.get("announcement").value;
      let announceChannel = interaction.guild.channels.cache.find(c => c.id === options.get("channel").value.replace("<#", "").replace(">", ""));
      
      if(announceChannel) {
        const announceReplyEmbed = new Discord.EmbedBuilder()
        .setColor(0x00ff00)
        .setDescription(`✅ **|** ***A new announcement has been made in ${announceChannel}!***`)
        interaction.reply({ embeds: [ announceReplyEmbed ], fetchReply: true, ephemeral: true });
  
        const announceEmbed = new Discord.EmbedBuilder()
        .setColor(`${color}`)
        .setTitle(`${announceTitle}`)
        .setDescription(`${announcement}`)
        .setTimestamp()
        announceChannel.send({ embeds: [ announceEmbed ] });
      } else {
        const announceErrorReplyEmbed = new Discord.EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`❌ **|** ***Error: I couldn't make an announcement in ${announceChannel}, because that #channel doesn't exist!***`)
        return interaction.reply({ embeds: [ announceErrorReplyEmbed ], fetchReply: true, ephemeral: true });
      }
    }

//AUTOROLE
    if(commandName === "autorole") {
      if(!interaction.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
        const autoroleErrorReplyEmbed = new Discord.EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`❌ **|** ***Error: You don't have the sufficient permissions to use this command!***`)
        return interaction.reply({ embeds: [ autoroleErrorReplyEmbed ], fetchReply: true, ephemeral: true });
      }

      let mode = options.get("mode").value;
      let role;
      let rolenameid;
      if(options.get("role") && options.get("role").value) {
        role = options.get("role").value;
        rolenameid = interaction.guild.roles.cache.find(r => r.id === role.replace("<@&", "").replace(">", ""));
      }

      let autoroles = JSON.parse(fs.readFileSync("./autoroles.json", "utf-8"));

      if(!mode || !mode === "check" || !mode === "add" || !mode === "remove" || !role || !rolenameid) {
        
        let text = "";
        if(!autoroles[interaction.guild.id] || !autoroles[interaction.guild.id].autoroles) {
          text = `❌ \`Not configured yet\``;
        } else {
          autoroles[interaction.guild.id].autoroles.forEach(ar => {
            text += `> ✅ <@&${ar}>\n`;
          });
        }
        const autoroleUsageEmbed = new Discord.EmbedBuilder()
        .setColor(0xff0000)
        .setTitle(`⚙️ AUTOROLE`)
        .setDescription(`❌ **|** ***Usage: /autorole <add/remove> <@role/role ID>***\n**» Autorole(s):**\n${text}`)
        return interaction.reply({ embeds: [ autoroleUsageEmbed ], fetchReply: true, ephemeral: true });
      }


      if(mode === "check") {
        let text = "";
        if(!autoroles[interaction.guild.id] || !autoroles[interaction.guild.id].autoroles) {
          text = `❌ \`Not configured yet\``;
        } else {
          autoroles[interaction.guild.id].autoroles.forEach(ar => {
            text += `> ✅ <@&${ar}>\n`;
          });
        }
        const autoroleUsageEmbed = new Discord.EmbedBuilder()
        .setColor(`${process.env.COLOR}`)
        .setTitle(`⚙️ AUTOROLE`)
        .setDescription(`**» Autorole(s):**\n${text}`)
        return interaction.reply({ embeds: [ autoroleUsageEmbed ], fetchReply: true, ephemeral: true });
      }

      if(mode === "add") {

        console.log(autoroles[interaction.guild.id].autoroles.push(rolenameid.id));
/*
        fs.writeFile("./autoroles.json", JSON.stringify(addar), (err) => {
          if(err) console.log(err);
        });*/

        const autoroleAddEmbed = new Discord.EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle("⚙️ AUTOROLE")
        .setDescription(`✅ **|** ***An autorole has been added: ${rolenameid}***`)
        interaction.reply({ embeds: [ autoroleAddEmbed ], fetchReply: true, ephemeral: true });
      }

      if(mode === "remove") {
        if(!autoroles[interaction.guild.id].includes(rolenameid.id)) {
          const autoroleRemoveErrorReplyEmbed = new Discord.EmbedBuilder()
          .setColor(0xff0000)
          .setTitle(`⚙️ AUTOROLE`)
          .setDescription(`❌ **|** ***Error: I couldn't remove ${rolenameid} from the autoroles, because that role is not an autorole!`)
          return interaction.reply({ embeds: [ autoroleRemoveErrorReplyEmbed ], fetchReply: true, ephemeral: true });
        }

        autoroles[interaction.guild.id] = 
          autoroles[interaction.guild.id].filter(e => e !== rolenameid.id);

        fs.writeFile("./autoroles.json", JSON.stringify(autoroles), (err) => {
          if(err) console.log(err);
        });

        const autoroleRemoveEmbed = new Discord.EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle("⚙️ AUTOROLE")
        .setDescription(`✅ **|** ***An autorole has been removed: ${rolenameid}***`)
        interaction.reply({ embeds: [ autoroleRemoveEmbed ], fetchReply: true, ephemeral: true });
      }
    }

  }

  module.exports.help = {
    name: "interactionCreate"
}