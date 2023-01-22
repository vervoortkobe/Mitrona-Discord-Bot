const Discord = require("discord.js");
const fs = require("fs");

module.exports.run = async (client, interaction) => {

    if(interaction.isButton()) {
      if(interaction.customId == "giveawaybutton" && interaction.message.author.id === client.user.id) {
        let buttonfile = require("./buttons/giveawaybutton.js");
        if(buttonfile) buttonfile.run(client, interaction, fs);
      }
    }
    
    if(!interaction.isChatInputCommand()) return;
    if(!interaction.isCommand()) return;
    if(interaction.author.bot) return;
    if(interaction.channel.type === "DM") return;

    const { commandName, options } = interaction;

//ANNOUNCE
    if(commandName === "announce") {
      let intcommandfile = require("./intcommands/announce.js");
      if(intcommandfile) intcommandfile.run(client, interaction, commandName, options, fs);
    }

//AUTOROLE
    if(commandName === "autorole") {
      let intcommandfile = require("./intcommands/autorole.js");
      if(intcommandfile) intcommandfile.run(client, interaction, commandName, options, fs);
    }

//CITIZEN
    if(commandName === "citizen") {
      let intcommandfile = require("./intcommands/citizen.js");
      if(intcommandfile) intcommandfile.run(client, interaction, commandName, options, fs);
    }

//CLEAR
    if(commandName === "clear") {
      let intcommandfile = require("./intcommands/clear.js");
      if(intcommandfile) intcommandfile.run(client, interaction, commandName, options, fs);
    }

//DASHBOARD
    if(commandName === "dashboard") {
      let intcommandfile = require("./intcommands/dashboard.js");
      if(intcommandfile) intcommandfile.run(client, interaction, commandName, options, fs);
    }

//EVAL
    if(commandName === "eval") {
      let intcommandfile = require("./intcommands/eval.js");
      if(intcommandfile) intcommandfile.run(client, interaction, commandName, options, fs);
    }

//GCANCEL
    if(commandName === "gcancel") {
      let intcommandfile = require("./intcommands/gcancel.js");
      if(intcommandfile) intcommandfile.run(client, interaction, commandName, options, fs);
    }

//GCHECK
    if(commandName === "gcheck") {
      let intcommandfile = require("./intcommands/gcheck.js");
      if(intcommandfile) intcommandfile.run(client, interaction, commandName, options, fs);
    }

//GEND
    if(commandName === "gend") {
      let intcommandfile = require("./intcommands/gend.js");
      if(intcommandfile) intcommandfile.run(client, interaction, commandName, options, fs);
    }

//GIVEAWAY
    if(commandName === "giveaway") {
      let intcommandfile = require("./intcommands/giveaway.js");
      if(intcommandfile) intcommandfile.run(client, interaction, commandName, options, fs);
    }

//GREROLL
    if(commandName === "greroll") {
      let intcommandfile = require("./intcommands/greroll.js");
      if(intcommandfile) intcommandfile.run(client, interaction, commandName, options, fs);
    }

//UNCITIZEN
    if(commandName === "uncitizen") {
      let intcommandfile = require("./intcommands/uncitizen.js");
      if(intcommandfile) intcommandfile.run(client, interaction, commandName, options, fs);
    }
  }

  module.exports.help = {
    name: "interactionCreate"
}
