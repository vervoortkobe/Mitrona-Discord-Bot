const Discord = require("discord.js");
const fs = require("fs");

module.exports.run = async (client, member) => {
//AUTOROLE
    let autoroles = JSON.parse(fs.readFileSync("./autoroles.json", "utf-8"));
    if(autoroles[member.guild.id]) {
      autoroles[member.guild.id].forEach(ar => {
        let guildautorole = member.guild.roles.cache.find(r => r.id === `${ar}`);
        if(guildautorole) {
          member.roles.add(guildautorole);
        }
      });
    }
  }

  module.exports.help = {
    name: "guildMemberAdd"
}