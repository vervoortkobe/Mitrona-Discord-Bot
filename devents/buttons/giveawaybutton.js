const Discord = require("discord.js");
const fs = require("fs");

module.exports.run = async (client, interaction, fs) => {

    let giveaways = JSON.parse(fs.readFileSync("./giveaways.json", "utf-8"));

    giveaways.forEach(ga => {
      if(ga.guild === interaction.guild.id && ga.channel === interaction.channel.id && ga.giveawaymsg === interaction.message.id) {
        if(!ga.participants.includes(interaction.member.id)) {

          ga.participants = 
            ga.participants.concat(interaction.member.id);

          let randomcolors = Math.floor(Math.random() * 0xFFFFFF).toString(16);
          let color = `#${randomcolors}`;

          let date = new Date(ga.time);
          let endsat = `${date.getMonth()}-${date.getDate()}-${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`;

          let styles = [
            Discord.ButtonStyle.Primary, 
            Discord.ButtonStyle.Secondary, 
            Discord.ButtonStyle.Success, 
            Discord.ButtonStyle.Danger
          ];
          let randomstyle = Math.floor(Math.random() * styles.length);
          let style = styles[randomstyle];

          const giveawaymsgDeletedButton = new Discord.ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()
            .setCustomId("giveawaybutton")
            .setEmoji("🎉")
            .setStyle(style)
          );

          const giveawaymsgDeletedEmbed = new Discord.EmbedBuilder()
          .setColor(`${color}`)
          .setTitle("🥳 GIVEAWAY")
          .setDescription(`🎊 Participate in this giveaway by reacting with \`🎉\`!\n\n> **Ends at:** \`${endsat}\`\n> **Winners:** \`${ga.winners}\`\n> **Prize:** \`${ga.prize}\`\n> **Participants:** \`${ga.participants.length}\``)
          .setTimestamp()

          let giveawayGuild = client.guilds.cache.get(ga.guild);
          let giveawayChannel = giveawayGuild.channels.cache.get(ga.channel);
          giveawayChannel.messages.fetch(ga.giveawaymsg)
          .then(m => {

            const giveawayEmbed = new Discord.EmbedBuilder()
            .setColor(`${color}`)
            .setTitle("🥳 GIVEAWAY")
            .setTitle(m.embeds[0].title)
            .setDescription(`${m.embeds[0].description.split("> **Participants:** ")[0]}> **Participants:** \`${ga.participants.length}\``)
            .setTimestamp(m.createdTimestamp)

            m.edit({ embeds: [ giveawayEmbed ] });
          }).catch(err => {
            giveawayChannel.send({ embeds: [ giveawaymsgDeletedEmbed ], components: [ giveawaymsgDeletedButton ] })
          });

          console.log(ga);

          giveaways.concat(ga);

          fs.writeFile("./giveaways.json", JSON.stringify(giveaways), (err) => {
            if(err) console.log(err);
          });

          const giveawayConfirmationReplyEmbed = new Discord.EmbedBuilder()
          .setColor(0x00ff00)
          .setTitle("🥳 GIVEAWAY")
          .setURL(`https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.message.id}`)
          .setDescription(`✅ **|** ***You participated in a giveaway!***`)
          interaction.reply({ embeds: [ giveawayConfirmationReplyEmbed ], ephemeral: true });
        
        } else {

          ga.participants = 
            ga.participants.filter(e => e !== interaction.member.id);

          let giveawayGuild = client.guilds.cache.get(ga.guild);
          let giveawayChannel = giveawayGuild.channels.cache.get(ga.channel);
          giveawayChannel.messages.fetch(ga.giveawaymsg)
          .then(m => {
                      
            let randomcolors = Math.floor(Math.random() * 0xFFFFFF).toString(16);
            let color = `#${randomcolors}`;

            const giveawayEmbed = new Discord.EmbedBuilder()
            .setColor(`${color}`)
            .setTitle("🥳 GIVEAWAY")
            .setTitle(m.embeds[0].title)
            .setDescription(`${m.embeds[0].description.split("> **Participants:** ")[0]}> **Participants:** \`${ga.participants.length}\``)
            .setTimestamp(m.createdTimestamp)

            m.edit({ embeds: [ giveawayEmbed ] });
          }).catch(err => {
            giveawayChannel.send({ embeds: [ giveawaymsgDeletedEmbed ], components: [ giveawaymsgDeletedButton ] })
          });

          console.log(ga);

          giveaways.concat(ga);

          fs.writeFile("./giveaways.json", JSON.stringify(giveaways), (err) => {
            if(err) console.log(err);
          });

          const giveawayDenyReplyEmbed = new Discord.EmbedBuilder()
          .setColor(0xff0000)
          .setTitle("🥳 GIVEAWAY")
          .setURL(`https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.message.id}`)
          .setDescription(`❌ **|** ***You're not participating in that giveaway anymore!***`)
          interaction.reply({ embeds: [ giveawayDenyReplyEmbed ], ephemeral: true });
        }
      }
    });
  }

  module.exports.help = {
    name: "giveawaybutton"
}
