const { ThreadAutoArchiveDuration } = require("discord.js");

module.exports.run = async (client, member, db) => {

    let autoroles = await db.collection("autoroles");

    if(await autoroles.findOne({ guildid: member.guild.id })) {
      await autoroles.findOne({ guildid: member.guild.id }).autoroles.forEach(ar => {
        let guildautorole = member.guild.roles.cache.find(r => r.id === `${ar}`);
        if(guildautorole) member.roles.add(guildautorole);
      });
    }
  }

  module.exports.help = {
    name: "guildMemberAdd"
}