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

    if(perms.admin.includes(interaction.member.id) || interaction.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) || interaction.member.roles.cache.has(serveradminrole) || require("../../checkperms.js").checkPerms(interaction, "gcheck")) {
  
      let giveaways = await db.collection("giveaways");

      let text = "";
      if(!await giveaways.find().toArray() || await giveaways.find().toArray().length === 0 || !await giveaways.findOne({ guild: interaction.guild.id })) {
        text = `> ❌ \`None\``;
      } else {

        //giveaways.forEach(ga => {
        await giveaways.find({ guild: interaction.guild.id }).forEach(ga => {
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

    } else {
      const permsErrorReplyEmbed = new Discord.EmbedBuilder()
      .setColor(0xff0000)
      .setDescription(`❌ **|** ***Error: You don't have the sufficient permissions to use this command!***`)
      return interaction.reply({ embeds: [ permsErrorReplyEmbed ], ephemeral: true });
    }
  }

  module.exports.help = {
    name: "gcheck",
    aliases: [],
    category: "admin"
}