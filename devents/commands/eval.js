const Discord = require("discord.js");

module.exports.run = async (client, message, args, mongoClient) => {
    
    if(perms.admin.includes(message.author.id)) {

      let cmd = args.join(" ");

      if(!cmd) {
        const errorEmbed = new Discord.EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`❌ **|** ***Error: There was no evaluated code defined to execute!***`)
        return message.reply({ embeds: [ errorEmbed ] });
      }
        
      if(cmd.toLowerCase().includes("token") || cmd.toLowerCase().includes("config") || cmd.toLowerCase().includes("process.env")) {
        const errorEmbed = new Discord.EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`❌ **|** ***Error: I detected a withheld keyword in the defined evaluated code I had to execute!***`)
        return message.reply({ embeds: [ errorEmbed ] });
      }

      const clean = text => {
        if(typeof text === "string")
          return text
          .replace(/`/g, "`" + String.fromCharCode(8203))
          .replace(/@/g, "@" + String.fromCharCode(8203));
          else return text;
      }

      console.log(`| [${message.guild.name}] #${message.channel.name} > ${message.author.tag}: ${message.content}`);

      try {
        const code = args.slice(0).join(" ");
        let evaled = eval(code);

        if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

        return message.channel.send(clean(evaled), { code: "xl" });
      } catch(err) {
        return message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
      }
      
    } else {
      const permsErrorReplyEmbed = new Discord.EmbedBuilder()
      .setColor(0xff0000)
      .setDescription(`❌ **|** ***Error: You don't have the sufficient permissions to use this command!***`)
      return message.reply({ embeds: [ permsErrorReplyEmbed ] });
    }
  }
  
  module.exports.help = {
    name: "eval",
    aliases: ["evaluate"],
    category: "owner"
}