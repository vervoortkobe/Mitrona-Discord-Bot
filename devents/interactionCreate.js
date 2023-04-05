module.exports.run = async (client, interaction, db) => {

    if(interaction.isButton()) {
      if(interaction.customId == "giveawaybutton" && interaction.message.author.id === client.user.id) {
        let buttonfile = require("./buttons/giveawaybutton.js");
        if(buttonfile) buttonfile.run(client, interaction, db);
      }
    }
    
    if(interaction.user.bot) return;
    if(interaction.channel.type === "DM") return;
    
    if(!interaction.isChatInputCommand()) return;
    if(!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    let intcommandfile = client.intcommands.get(commandName);
    if(intcommandfile) intcommandfile.run(client, interaction);
  }

  module.exports.help = {
    name: "interactionCreate"
}