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
        if(!rolenameid) {
          const autoroleRoleErrorReplyEmbed = new Discord.EmbedBuilder()
          .setColor(0xff0000)
          .setDescription(`❌ **|** ***Error: I couldn't !***`)
          return interaction.reply({ embeds: [ autoroleRoleErrorReplyEmbed ], fetchReply: true, ephemeral: true });
        }
      }

      let autoroles = JSON.parse(fs.readFileSync("./autoroles.json", "utf-8"));
        
      let text = "";
      if(!autoroles[interaction.guild.id]) {
        text = `❌ \`Not configured yet\``;
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
        return interaction.reply({ embeds: [ autoroleUsageEmbed ], fetchReply: true, ephemeral: true });
      }

      if(mode === "check") {
        const autoroleUsageEmbed = new Discord.EmbedBuilder()
        .setColor(`${process.env.COLOR}`)
        .setTitle(`⚙️ AUTOROLE`)
        .setDescription(`**» Autorole(s):**\n${text}`)
        return interaction.reply({ embeds: [ autoroleUsageEmbed ], fetchReply: true, ephemeral: true });
      }

      if(mode === "add") {
        if(autoroles[interaction.guild.id].includes(rolenameid.id)) {
          const autoroleRemoveErrorReplyEmbed = new Discord.EmbedBuilder()
          .setColor(0xff0000)
          .setTitle(`⚙️ AUTOROLE`)
          .setDescription(`❌ **|** ***Error: I couldn't add ${rolenameid} to the autoroles, because that role is an autorole already!***`)
          return interaction.reply({ embeds: [ autoroleRemoveErrorReplyEmbed ], fetchReply: true, ephemeral: true });
        }

        autoroles[interaction.guild.id] = 
          autoroles[interaction.guild.id].concat(rolenameid.id);

        fs.writeFile("./autoroles.json", JSON.stringify(autoroles), (err) => {
          if(err) console.log(err);
        });

        delete require.cache[require.resolve("../autoroles.json")];
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
          .setDescription(`❌ **|** ***Error: I couldn't remove ${rolenameid} from the autoroles, because that role is not an autorole!***`)
          return interaction.reply({ embeds: [ autoroleRemoveErrorReplyEmbed ], fetchReply: true, ephemeral: true });
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
        interaction.reply({ embeds: [ autoroleRemoveEmbed ], fetchReply: true, ephemeral: true });
      }
    }

//CITIZEN
    if(commandName === "citizen") {
      let housingsteward = interaction.guild.roles.cache.find(r => r.id === `${process.env.HOUSINGSTEWARD_ROLE}`);
      let citizen = interaction.guild.roles.cache.find(r => r.id === `${process.env.CITIZEN_ROLE}`);

      if(!interaction.member.roles.cache.some(r => r.id === housingsteward.id)) {
        const citizenErrorReplyEmbed = new Discord.EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`❌ **|** ***Error: You don't have the sufficient role (${housingsteward}) to use this command!***`)
        return interaction.reply({ embeds: [ citizenErrorReplyEmbed ], fetchReply: true, ephemeral: true });
      }

      let member = interaction.guild.members.cache.get(options.get("member").value.replace("<@", "").replace(">", ""));

      if(!member) {
        const citizenMemberErrorReplyEmbed = new Discord.EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`❌ **|** ***Error: I couldn't give the ${citizen} role to that member, because that isn't a valid member!***`)
        return interaction.reply({ embeds: [ citizenMemberErrorReplyEmbed ], fetchReply: true, ephemeral: true });
      }
      if(member.roles.cache.some(r => r.id === citizen.id)) {
        const citizenMemberErrorReplyEmbed = new Discord.EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`❌ **|** ***Error: I couldn't give the ${citizen} role to that member, because he/she already has that role!***`)
        return interaction.reply({ embeds: [ citizenMemberErrorReplyEmbed ], fetchReply: true, ephemeral: true });
      }

      member.roles.add(citizen);

      const citizenEmbed = new Discord.EmbedBuilder()
      .setColor(0x00ff00)
      .setTitle("⚙️ CITIZEN")
      .setDescription(`✅ **|** ***I have given the ${citizen} role to ${member}!***`)
      interaction.reply({ embeds: [ citizenEmbed ], fetchReply: true, ephemeral: true });
    }

//UNCITIZEN
    if(commandName === "uncitizen") {
      let housingsteward = interaction.guild.roles.cache.find(r => r.id === `${process.env.HOUSINGSTEWARD_ROLE}`);
      let citizen = interaction.guild.roles.cache.find(r => r.id === `${process.env.CITIZEN_ROLE}`);
      
      if(!interaction.member.roles.cache.some(r => r.id === housingsteward.id)) {
        const uncitizenErrorReplyEmbed = new Discord.EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`❌ **|** ***Error: You don't have the sufficient role (${housingsteward}) to use this command!***`)
        return interaction.reply({ embeds: [ uncitizenErrorReplyEmbed ], fetchReply: true, ephemeral: true });
      }

      let member = interaction.guild.members.cache.get(options.get("member").value.replace("<@", "").replace(">", ""));

      if(!member) {
        const uncitizenMemberErrorReplyEmbed = new Discord.EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`❌ **|** ***Error: I couldn't give the ${citizen} role to that member, because that isn't a valid member!***`)
        return interaction.reply({ embeds: [ uncitizenMemberErrorReplyEmbed ], fetchReply: true, ephemeral: true });
      }
      if(!member.roles.cache.some(r => r.id === citizen.id)) {
        const citizenMemberErrorReplyEmbed = new Discord.EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`❌ **|** ***Error: I couldn't remove the ${citizen} role from that member, because he/she doesn't have that role!***`)
        return interaction.reply({ embeds: [ citizenMemberErrorReplyEmbed ], fetchReply: true, ephemeral: true });
      }

      member.roles.remove(citizen);

      const uncitizenEmbed = new Discord.EmbedBuilder()
      .setColor(0x00ff00)
      .setTitle("⚙️ UNCITIZEN")
      .setDescription(`✅ **|** ***I have removed the ${citizen} role from ${member}!***`)
      interaction.reply({ embeds: [ uncitizenEmbed ], fetchReply: true, ephemeral: true });
    }

//UPCITIZEN
    if(commandName === "upcitizen") {
      let s2classcitizen = interaction.guild.roles.cache.find(r => r.id === `${process.env.S2CLASSCITIZEN_ROLE}`);
      let f1classcitizen = interaction.guild.roles.cache.find(r => r.id === `${process.env.F1CLASSCITIZEN_ROLE}`);
      
      if(!interaction.member.roles.cache.some(r => r.id === s2classcitizen.id)) {
        const upcitizenErrorReplyEmbed = new Discord.EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`❌ **|** ***Error: You don't have the sufficient role (${s2classcitizen}) to use this command!***`)
        return interaction.reply({ embeds: [ upcitizenErrorReplyEmbed ], fetchReply: true, ephemeral: true });
      }

      if(!interaction.member.roles.cache.some(r => r.id === s2classcitizen.id)) {
        const upcitizenS2ErrorReplyEmbed = new Discord.EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`❌ **|** ***Error: I couldn't give the ${f1classcitizen} to you, because you don't have the ${s2classcitizen} role!***`)
        return interaction.reply({ embeds: [ upcitizenS2ErrorReplyEmbed ], fetchReply: true, ephemeral: true });
      }

      if(interaction.member.roles.cache.some(r => r.id === f1classcitizen.id)) {
        const upcitizenF1ErrorReplyEmbed = new Discord.EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`❌ **|** ***Error: I couldn't give the ${f1classcitizen} to you, because you already have that role!***`)
        return interaction.reply({ embeds: [ upcitizenF1ErrorReplyEmbed ], fetchReply: true, ephemeral: true });
      }

      interaction.member.roles.add(f1classcitizen);

      const upcitizenEmbed = new Discord.EmbedBuilder()
      .setColor(0x00ff00)
      .setTitle("⚙️ UPCITIZEN")
      .setDescription(`✅ **|** ***I have upcitizened you by giving the ${f1classcitizen} role!***`)
      interaction.reply({ embeds: [ upcitizenEmbed ], fetchReply: true, ephemeral: true });
    }

//GIVEAWAY
    if(commandName === "giveaway") {
      if(!interaction.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
        const giveawayErrorReplyEmbed = new Discord.EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`❌ **|** ***Error: You don't have the sufficient permissions to use this command!***`)
        return interaction.reply({ embeds: [ giveawayErrorReplyEmbed ], fetchReply: true, ephemeral: true });
      }

      let duration = options.get("duration").value;
      let time;
      let winners = options.get("winners").value;
      let prize = options.get("prize").value;

      if(duration.includes("d")) {
        time = interaction.createdTimestamp + duration.replace("d", "") * 86400;
      }
      else if(duration.includes("h")) {
        time = interaction.createdTimestamp + duration.replace("h", "") * 3600
      }
      else if(duration.includes("m")) {
        time = interaction.createdTimestamp + duration.replace("m", "") * 60;
      }
      else {
        const giveawayDurationErrorReplyEmbed = new Discord.EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`❌ **|** ***Error: I couldn't start a giveaway, because you didn't give a valid duration!***`)
        return interaction.reply({ embeds: [ giveawayDurationErrorReplyEmbed ], fetchReply: true, ephemeral: true });
      }

      if(isNaN(winners) || !typeof winners === "number" || !parseFloat(winners)) {
        const giveawayWinnersErrorReplyEmbed = new Discord.EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`❌ **|** ***Error: I couldn't start a giveaway, because you didn't give a valid winners amount!***`)
        return interaction.reply({ embeds: [ giveawayWinnersErrorReplyEmbed ], fetchReply: true, ephemeral: true });
      }

      if(winners < 1 || winners > 10) {
        const giveawayWinnersOutofrangeErrorReplyEmbed = new Discord.EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`❌ **|** ***Error: I couldn't start a giveaway, because the amount of winners has to be a number between \`1\` and \`10\`!***`)
        return interaction.reply({ embeds: [ giveawayWinnersOutofrangeErrorReplyEmbed ], fetchReply: true, ephemeral: true });
      }






    }

  }

  module.exports.help = {
    name: "interactionCreate"
}
