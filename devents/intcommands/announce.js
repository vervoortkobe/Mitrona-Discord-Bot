const Discord = require("discord.js");

module.exports.run = async (client, interaction, mongoClient) => {

    try {
      const db = mongoClient.db("Mitrona");

      let perms = await db.collection("perms").find().toArray()[0];

      let serveradminrole = interaction.guild.roles.cache.find(r => r.id === process.env.MITRONA_SERVERADMIN_ROLE);
      if(!serveradminrole) {
        const serveradminErrorReplyEmbed = new Discord.EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`❌ **|** ***Error: I couldn't find the admin role of this server!***`)
        return interaction.reply({ embeds: [ serveradminErrorReplyEmbed ], ephemeral: true });
      }

      if(perms.admin.includes(interaction.member.id) || interaction.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) || interaction.member.roles.cache.has(serveradminrole) || perms.eval.includes(interaction.member.id)) {

        let color;
        let colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
        if(colors.includes(interaction.options.get("color").value.toLowerCase())) {
          if(interaction.options.get("color").value.toLowerCase() === "red") color = "#ff0000";
          if(interaction.options.get("color").value.toLowerCase() === "orange") color = "#ff7f00";
          if(interaction.options.get("color").value.toLowerCase() === "yellow") color = "#ffff00";
          if(interaction.options.get("color").value.toLowerCase() === "green") color = "#00ff00";
          if(interaction.options.get("color").value.toLowerCase() === "blue") color = "#0000ff";
          if(interaction.options.get("color").value.toLowerCase() === "indigo") color = "#4B0082";
          if(interaction.options.get("color").value.toLowerCase() === "violet") color = "#9400D3";
        } else {
          const announceColorErrorReplyEmbed = new Discord.EmbedBuilder()
          .setColor(0xff0000)
          .setDescription(`❌ **|** ***Error: I couldn't make an announcement with color \`${interaction.options.get("color").value}\`, because that color isn't a valid option!***`)
          return interaction.reply({ embeds: [ announceColorErrorReplyEmbed ], ephemeral: true });
        }

        let announceTitle = interaction.options.get("title").value;
        let announcement = interaction.options.get("announcement").value;
        let announceChannel = interaction.guild.channels.cache.find(c => c.id === interaction.options.get("channel").value.replace("<#", "").replace(">", ""));
        
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

      } else {
        const permsErrorReplyEmbed = new Discord.EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`❌ **|** ***Error: You don't have the sufficient permissions to use this command!***`)
        return interaction.reply({ embeds: [ permsErrorReplyEmbed ], ephemeral: true });
      }
    } catch(err) {
      console.error(err);
    } finally {
      await mongoClient.close();
    }
  }

  module.exports.help = {
    name: "announce",
    aliases: [],
    category: ""
}