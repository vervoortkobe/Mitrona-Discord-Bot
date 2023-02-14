const Discord = require("discord.js");
const fs = require("fs");

module.exports.run = async (client, message, args) => {
    
    if(!(process.env.ADMIN).includes(message.author.id) &&  !message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
      const restartErrorReplyEmbed = new Discord.EmbedBuilder()
      .setColor(0xff0000)
      .setDescription(`❌ **|** ***Error: You don't have the sufficient permissions to use this command!***`)
      return message.reply({ embeds: [ restartErrorReplyEmbed ] });
    }

    message.delete();

    const restartEmbed = new Discord.EmbedBuilder()
    .setColor(0x00ff00)
    .setThumbnail(client.user.displayAvatarURL())
    .setDescription(`✅ **|** ***Restarting the bot in \`3 seconds\`...\n> This may take a while (~3 min)!***`)
    message.channel.send({ embeds: [ restartEmbed ]});
    
    setTimeout(() => {
      process.kill(1);
      exec("node index.js", function (error, stdout, stderr) {
        console.log("stdout: " + stdout);
        console.log("stderr: " + stderr);
        if(err) console.log("exec error: " + err);
      });
    }, 3000);
  }
  
  module.exports.help = {
    name: "restart",
    aliases: [],
    category: "owner"
}
