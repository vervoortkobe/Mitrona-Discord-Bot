const Discord = require("discord.js");
const fs = require("fs");

module.exports.run = async (client, interaction) => {

    if(!interaction.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
      const gcheckErrorReplyEmbed = new Discord.EmbedBuilder()
      .setColor(0xff0000)
      .setDescription(`❌ **|** ***Error: You don't have the sufficient permissions to use this command!***`)
      return interaction.reply({ embeds: [ gcheckErrorReplyEmbed ], ephemeral: true });
    }

    let giveaways = JSON.parse(fs.readFileSync("./giveaways.json", "utf-8"));

    let text = "";
    if(!giveaways || giveaways.length === 0) {
      text = `> ❌ \`None\``;
    } else {
      giveaways.forEach(ga => {
        if(ga.guild === interaction.guild.id) {
          //console.log(ga);

          let date = new Date(ga.time);
          let endsat = `${date.getMonth()}-${date.getDate()}-${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`;    

          let giveawayChannel = interaction.guild.channels.cache.find(c => c.id === ga.channel);
          let gaChannel = "";
          if(giveawayChannel) gaChannel = giveawayChannel;
          else gaChannel = ga.channel;

          if(ga.busy === true) {
            text += `> \`✅\` **|** \`${endsat}\` **|** ${gaChannel} **|** [${ga.giveawaymsg}](https://discord.com/channels/${ga.guild}/${ga.channel}/${ga.giveawaymsg}) **|** \`${ga.prize}\` **|** \`${ga.participants.length}\`\n`;
          } else {
            text += `> \`❌\` **|** \`${endsat}\` **|** ${gaChannel} **|** [${ga.giveawaymsg}](https://discord.com/channels/${ga.guild}/${ga.channel}/${ga.giveawaymsg}) **|** \`${ga.prize}\` **|** \`${ga.participants.length}\`\n`;
          }
        } else {
          text = `> ❌ \`None\``;
        }
      });
    }

    const gcheckReplyEmbed = new Discord.EmbedBuilder()
    .setColor(0x00ff00)
    .setTitle("🥳 GCHECK")
    .setDescription(`> \`Status\` **|** \`Ends at\` **|** \`Channel\` **|** \`MessageID\` **|** \`Prize\` **|** \`Participants\`\n\n${text}`)
    interaction.reply({ embeds: [ gcheckReplyEmbed ], ephemeral: true });
  }

  module.exports.help = {
    name: "gcheck"
}
