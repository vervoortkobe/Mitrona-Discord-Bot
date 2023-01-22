const Discord = require("discord.js");
const fs = require("fs");

module.exports.run = async (client, interaction) => {

    if(!interaction.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
      const grerollErrorReplyEmbed = new Discord.EmbedBuilder()
      .setColor(0xff0000)
      .setDescription(`❌ **|** ***Error: You don't have the sufficient permissions to use this command!***`)
      return interaction.reply({ embeds: [ grerollErrorReplyEmbed ], ephemeral: true });
    }

    if(!interaction.options.get("giveaway") || !interaction.options.get("giveaway").value) {
      const grerollGiveawayErrorReplyEmbed = new Discord.EmbedBuilder()
      .setColor(0xff0000)
      .setDescription(`❌ **|** ***Error: I couldn't execute that command, because you didn't define a giveaway by messageid!***`)
      return interaction.reply({ embeds: [ grerollGiveawayErrorReplyEmbed ], ephemeral: true });
    }

    let giveaways = JSON.parse(fs.readFileSync("./giveaways.json", "utf-8"));

    giveaways.forEach(ga => {
      if(ga.giveawaymsg === interaction.options.get("giveaway").value) {
        if(ga.busy === false && ga.time < Date.now()) {
          if(interaction.guild.id === ga.guild && interaction.guild.channels.cache.find(c => c.id === ga.channel)) {

            let giveawayGuild = interaction.guild;
            if(giveawayGuild.channels.cache.find(c => c.id === ga.channel)) {
              let giveawayChannel = giveawayGuild.channels.cache.find(c => c.id === ga.channel);

              let randomcolors = Math.floor(Math.random() * 0xFFFFFF).toString(16);
              let color = `#${randomcolors}`;

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
                .setDisabled(true)
              );

              console.log(ga.participants.length);
              
              if(!ga.participants || ga.participants === [] || ga.participants.length < 2 || ga.participants.length < ga.winners) {
                const giveawayEmbed = new Discord.EmbedBuilder()
                .setColor(`${color}`)
                .setTitle("🥳 GIVEAWAY")
                .setDescription(`🎊 *You can't participate in this giveaway anymore!*\n\n> **Ends at:** \`REROLLED\`\n> **Winners:** \`None\`\n> **Prize:** \`${ga.prize}\`\n> **Participants:** \`${ga.participants.length}\``)
                .setTimestamp()

                giveawayChannel.messages.fetch(ga.giveawaymsg)
                .then(m => {
                  m.edit({ embeds: [ giveawayEmbed ], components: [ giveawayButton ] });
                }).catch(err => {
                  m.send({ embeds: [ giveawayEmbed ], components: [ giveawayButton ] });
                });
              
                const giveawayRerolledEmbed = new Discord.EmbedBuilder()
                .setColor(`${color}`)
                .setTitle("🥳 GIVEAWAY REROLLED")
                .setURL(`https://discord.com/channels/${ga.guild}/${ga.channel}/${ga.giveawaymsg}`)
                .setDescription(`❌ **|** ***The amount of participants for the giveaway about \`${ga.prize}\` was too small, so I couldn't choose winners!***`)
                return giveawayChannel.send({ embeds: [ giveawayRerolledEmbed ] });
              }
              
              let winnersarray = [];
              for (let i = 0; i < 1; i++) {
                let randomparts = Math.floor(Math.random() * ga.participants.length);
                if(winnersarray.includes(giveawayGuild.members.cache.get(ga.participants[randomparts]).user)) continue;
                winnersarray.push(giveawayGuild.members.cache.get(ga.participants[randomparts]).user);
              }

              if(winnersarray.length > 1 && ga.winners > 1) winners = winnersarray.join(", ");

              console.log(winnersarray.join(", "));

              const giveawayEmbed = new Discord.EmbedBuilder()
              .setColor(`${color}`)
              .setTitle("🥳 GIVEAWAY")
              .setDescription(`🎊 *You can't participate in this giveaway anymore!*\n\n> **Ends at:** \`REROLLED\`\n> **Winners:** **${winnersarray}**\n> **Prize:** \`${ga.prize}\``)
              .setTimestamp()
              
              giveawayChannel.messages.fetch(ga.giveawaymsg)
              .then(m => {
                m.edit({ embeds: [ giveawayEmbed ], components: [ giveawayButton ] });
              }).catch(err => {
                m.send({ embeds: [ giveawayEmbed ], components: [ giveawayButton ] });
              });
              
              const giveawayRerolledEmbed = new Discord.EmbedBuilder()
              .setColor(`${color}`)
              .setTitle("🥳 GIVEAWAY REROLLED")
              .setURL(`https://discord.com/channels/${ga.guild}/${ga.channel}/${ga.giveawaymsg}`)
              .setDescription(`✅ **|** ***Congratulations to ${winnersarray} for winning the giveaway about \`${ga.prize}\`!***`)
              giveawayChannel.send({ embeds: [ giveawayRerolledEmbed ] });

            }
          }
        } else {
          const grerollBusyGiveawayErrorReplyEmbed = new Discord.EmbedBuilder()
          .setColor(0xff0000)
          .setDescription(`❌ **|** ***Error: I couldn't reroll this giveaway, because it hasn't ended yet!***`)
          return interaction.reply({ embeds: [ grerollBusyGiveawayErrorReplyEmbed ], ephemeral: true });
        }
      } else {
        const grerollNoGiveawayErrorReplyEmbed = new Discord.EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`❌ **|** ***Error: I couldn't reroll this giveaway, because there is no giveaway registered with that messageid!***`)
        return interaction.reply({ embeds: [ grerollNoGiveawayErrorReplyEmbed ], ephemeral: true });
      }
    });
    
  }

  module.exports.help = {
    name: "greroll"
}
