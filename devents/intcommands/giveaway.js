const Discord = require("discord.js");

module.exports.run = async (client, interaction, db) => {
  
    let fetchedperms = await db.collection("perms").find().toArray();
    let perms = fetchedperms[0];

    let serveradminrole = interaction.guild.roles.cache.find(r => r.id === process.env.MITRONA_SERVERADMIN_ROLE);
    if(!serveradminrole) {
      const serveradminErrorReplyEmbed = new Discord.EmbedBuilder()
      .setColor(0xff0000)
      .setDescription(`❌ **|** ***Error: I couldn't find the admin role of this server!***`)
      return interaction.reply({ embeds: [ serveradminErrorReplyEmbed ], ephemeral: true });
    }

    if(perms.admin.includes(interaction.member.id) || interaction.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) || interaction.member.roles.cache.has(serveradminrole) || perms.eval.includes(interaction.member.id)) {

      let giveawayChannel = interaction.guild.channels.cache.find(c => c.id === interaction.options.get("channel").value.replace("<#", "").replace(">", ""));
      let duration = interaction.options.get("duration").value;
      let time;
      let winners = interaction.options.get("winners").value;
      let prize = interaction.options.get("prize").value;
      
      if(!giveawayChannel) {
        const giveawayErrorReplyEmbed = new Discord.EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`❌ **|** ***Error: I couldn't start a giveaway in ${giveawayChannel}, because that #channel doesn't exist!***`)
        return interaction.reply({ embeds: [ giveawayErrorReplyEmbed ], ephemeral: true });
      }

      if(duration.includes("d")) {
        time = interaction.createdTimestamp + duration.replace("d", "") * 86400 * 1000;
      }
      else if(duration.includes("h")) {
        time = interaction.createdTimestamp + duration.replace("h", "") * 3600 * 1000;
      }
      else if(duration.includes("m")) {
        time = interaction.createdTimestamp + duration.replace("m", "") * 60 * 1000;
      }
      else {
        const giveawayDurationErrorReplyEmbed = new Discord.EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`❌ **|** ***Error: I couldn't start a giveaway, because you didn't give a valid duration!***`)
        return interaction.reply({ embeds: [ giveawayDurationErrorReplyEmbed ], ephemeral: true });
      }

      if(isNaN(winners) || !typeof winners === "number" || !parseInt(winners)) {
        const giveawayWinnersErrorReplyEmbed = new Discord.EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`❌ **|** ***Error: I couldn't start a giveaway, because you didn't give a valid amount of winners!***`)
        return interaction.reply({ embeds: [ giveawayWinnersErrorReplyEmbed ], ephemeral: true });
      }

      if(Number(winners) < 1 || Number(winners) > 10) {
        const giveawayWinnersOutofrangeErrorReplyEmbed = new Discord.EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`❌ **|** ***Error: I couldn't start a giveaway, because the amount of winners has to be a number between \`1\` and \`10\`!***`)
        return interaction.reply({ embeds: [ giveawayWinnersOutofrangeErrorReplyEmbed ], ephemeral: true });
      }
  
      let giveaways = await db.collection("giveaways");

      let randomcolors = Math.floor(Math.random() * 0xFFFFFF).toString(16);
      let color = `#${randomcolors}`;

      let date = new Date(time);
      let endsat = `${date.getMonth()}-${date.getDate()}-${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`;

      let styles = [
        Discord.ButtonStyle.Primary, 
        Discord.ButtonStyle.Secondary, 
        Discord.ButtonStyle.Success, 
        Discord.ButtonStyle.Danger
      ];
      let randomstyle = Math.floor(Math.random() * styles.length);
      let style = styles[randomstyle];

      const giveawayButton = new Discord.ActionRowBuilder()
      .addComponents(
        new Discord.ButtonBuilder()
        .setCustomId("giveawaybutton")
        .setEmoji("🎉")
        .setStyle(style)
      );

      const giveawayEmbed = new Discord.EmbedBuilder()
      .setColor(`${color}`)
      .setTitle("🥳 GIVEAWAY")
      .setDescription(`🎊 Participate in this giveaway by reacting with \`🎉\`!\n\n> **Ends at:** \`${endsat}\`\n> **Winners:** \`${winners}\`\n> **Prize:** \`${prize}\`\n> **Participants:** \`0\``)
      .setTimestamp()
      giveawayChannel.send({ embeds: [ giveawayEmbed ], components: [ giveawayButton ] })
      .then(m => {

        let gaArray = {
          guild: interaction.guild.id,
          channel: giveawayChannel.id,
          giveawaymsg: m.id,
          time: time,
          winners: Number(winners),
          prize: prize,
          participants: [], 
          busy: Boolean(true)
        };

        /*giveaways = 
          giveaways.concat(gaArray);

        fs.writeFile("./giveaways.json", JSON.stringify(giveaways), (err) => {
          if(err) console.log(err);
        });*/

        giveaways.insertOne({ gaArray });

        console.log(giveaways);
      });

      const giveawayReplyEmbed = new Discord.EmbedBuilder()
      .setColor(0x00ff00)
      .setTitle("🥳 GIVEAWAY")
      .setDescription(`✅ **|** ***I have started a new giveaway in ${giveawayChannel}!***`)
      interaction.reply({ embeds: [ giveawayReplyEmbed ], ephemeral: true });

    } else {
      const permsErrorReplyEmbed = new Discord.EmbedBuilder()
      .setColor(0xff0000)
      .setDescription(`❌ **|** ***Error: You don't have the sufficient permissions to use this command!***`)
      return interaction.reply({ embeds: [ permsErrorReplyEmbed ], ephemeral: true });
    }
  }
  
  module.exports.help = {
    name: "giveaway",
    aliases: [],
    category: ""
}