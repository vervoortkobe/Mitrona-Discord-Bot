const Discord = require("discord.js");
const fs = require("fs");

module.exports.run = async (client, interaction, commandName, options, fs) => {
    
    if(!(process.env.ADMIN).includes(interaction.user.id) || !interaction.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
      const evalErrorReplyEmbed = new Discord.EmbedBuilder()
      .setColor(0xff0000)
      .setDescription(`❌ **|** ***Error: You don't have the sufficient permissions to use this command!***`)
      return interaction.reply({ embeds: [ evalErrorReplyEmbed ], ephemeral: true });
    }

    if(!options.get("code") || !options.get("code").value) {
      const errorEmbed = new Discord.EmbedBuilder()
      .setColor(0xff0000)
      .setDescription(`❌ **|** ***Error: There was no evaluated code defined to execute!***`)
      return interaction.reply({ embeds: [ errorEmbed ], ephemeral: true });
    }
    
    let cmd = options.get("code").value;
      
    if(cmd.toLowerCase().contains("token") || cmd.toLowerCase().contains("config.") || cmd.toLowerCase().contains("process.env")) {
      const errorEmbed = new Discord.EmbedBuilder()
      .setColor(0xff0000)
      .setDescription(`❌ **|** ***Error: I detected a withheld keyword in the defined evaluated code I had to execute!***`)
      return interaction.reply({ embeds: [ errorEmbed ], ephemeral: true });
    }

    const clean = text => {
      if(typeof text === "string")
        return text
        .replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203));
        else return text;
    }

    try {
      const code = args.slice(0).join(" ");
      let evaled = eval(code);

      if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

      interaction.channel.send(clean(evaled), { code: "xl" });
    } catch(err) {
      interaction.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
  }

  module.exports.help = {
    name: "eval"
}