const Discord = require("discord.js");
const fs = require("fs");

module.exports.run = async (client, interaction, commandName, options, fs) => {

    if(!interaction.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
      const gcancelErrorReplyEmbed = new Discord.EmbedBuilder()
      .setColor(0xff0000)
      .setDescription(`❌ **|** ***Error: You don't have the sufficient permissions to use this command!***`)
      return interaction.reply({ embeds: [ gcancelErrorReplyEmbed ], ephemeral: true });
    }

    if(!options.get("giveaway") || !options.get("giveaway").value) {
      const gcancelGiveawayErrorReplyEmbed = new Discord.EmbedBuilder()
      .setColor(0xff0000)
      .setDescription(`❌ **|** ***Error: I couldn't execute that command, because you didn't define a giveaway by messageid!***`)
      return interaction.reply({ embeds: [ gcancelGiveawayErrorReplyEmbed ], ephemeral: true });
    }

    let giveaways = JSON.parse(fs.readFileSync("./giveaways.json", "utf-8"));

    giveaways.forEach(ga => {
      if(ga.giveawaymsg === options.get("giveaway").value) {
        if(ga.busy === true && ga.time > Date.now()) {
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

              ga.busy = 
                Boolean(false);

              console.log(ga);
              giveaways.concat(ga);

              fs.writeFile("./giveaways.json", JSON.stringify(giveaways), (err) => {
                if(err) console.log(err);
              });

              console.log(ga.participants.length);

              const giveawayEmbed = new Discord.EmbedBuilder()
              .setColor(`${color}`)
              .setTitle("🥳 GIVEAWAY")
              .setDescription(`🎊 *You can't participate in this giveaway anymore!*\n\n> **Ends at:** \`CANCELLED\`\n> **Winners:** \`None\`\n> **Prize:** \`${ga.prize}\`\n> **Participants:** \`${ga.participants.length}\``)
              .setTimestamp()
              
              giveawayChannel.messages.fetch(ga.giveawaymsg)
              .then(m => {
                m.edit({ embeds: [ giveawayEmbed ], components: [ giveawayButton ] });
              }).catch(err => {
                m.send({ embeds: [ giveawayEmbed ], components: [ giveawayButton ] });
              });
              
              const giveawayEndedEmbed = new Discord.EmbedBuilder()
              .setColor(`${color}`)
              .setTitle("🥳 GIVEAWAY CANCELLED")
              .setURL(`https://discord.com/channels/${ga.guild}/${ga.channel}/${ga.giveawaymsg}`)
              .setDescription(`✅ **|** ***The giveaway about \`${ga.prize}\` was cancelled!***`)
              giveawayChannel.send({ embeds: [ giveawayEndedEmbed ] });

            }
          }
        } else {
          const gcancelBusyGiveawayErrorReplyEmbed = new Discord.EmbedBuilder()
          .setColor(0xff0000)
          .setDescription(`❌ **|** ***Error: I couldn't cancel this giveaway, because it has ended already!***`)
          return interaction.reply({ embeds: [ gcancelBusyGiveawayErrorReplyEmbed ], ephemeral: true });
        }
      } else {
        const gcancelNoGiveawayErrorReplyEmbed = new Discord.EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`❌ **|** ***Error: I couldn't cancel this giveaway, because there is no giveaway registered with that messageid!***`)
        return interaction.reply({ embeds: [ gcancelNoGiveawayErrorReplyEmbed ], ephemeral: true });
      }
    });
    
  }

  module.exports.help = {
    name: "gcancel"
}