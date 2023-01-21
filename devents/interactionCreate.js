const Discord = require("discord.js");
const fs = require("fs");

module.exports.run = async (client, interaction) => {

    if(interaction.isButton()) {
      if(interaction.customId == 'giveawaybutton' && interaction.message.author.id === client.user.id) {
        let eventfile = require("./buttons/giveawaybutton.js");
        if(eventfile) eventfile.run(client, interaction, fs);
      }
    }
    
    if(!interaction.isChatInputCommand()) return;
    if(!interaction.isCommand()) return;

    const { commandName, options } = interaction;

//ANNOUNCE
    if(commandName === "announce") {
      let eventfile = require("./intcommands/announce.js");
      if(eventfile) eventfile.run(client, interaction, commandName, options, fs);
    }

//AUTOROLE
    if(commandName === "autorole") {
      let eventfile = require("./intcommands/autorole.js");
      if(eventfile) eventfile.run(client, interaction, commandName, options, fs);
    }

//CITIZEN
    if(commandName === "citizen") {
      let eventfile = require("./intcommands/citizen.js");
      if(eventfile) eventfile.run(client, interaction, commandName, options, fs);
    }

//CLEAR
    if(commandName === "clear") {
      let eventfile = require("./intcommands/clear.js");
      if(eventfile) eventfile.run(client, interaction, commandName, options, fs);
    }

//DASHBOARD
    if(commandName === "dashboard") {
      let eventfile = require("./intcommands/dashboard.js");
      if(eventfile) eventfile.run(client, interaction, commandName, options, fs);
    }

//EVAL
    if(commandName === "eval") {
      let eventfile = require("./intcommands/eval.js");
      if(eventfile) eventfile.run(client, interaction, commandName, options, fs);
    }

//GCANCEL
    if(commandName === "gcancel") {
      let eventfile = require("./intcommands/gcancel.js");
      if(eventfile) eventfile.run(client, interaction, commandName, options, fs);
    }

//GCHECK
    if(commandName === "gcheck") {
      let eventfile = require("./intcommands/gcheck.js");
      if(eventfile) eventfile.run(client, interaction, commandName, options, fs);
    }

//GEND
    if(commandName === "gend") {
      let eventfile = require("./intcommands/gend.js");
      if(eventfile) eventfile.run(client, interaction, commandName, options, fs);
    }

//GIVEAWAY
    if(commandName === "giveaway") {
      let eventfile = require("./intcommands/giveaway.js");
      if(eventfile) eventfile.run(client, interaction, commandName, options, fs);
    }

//GREROLL
    if(commandName === "greroll") {
      let eventfile = require("./intcommands/greroll.js");
      if(eventfile) eventfile.run(client, interaction, commandName, options, fs);
    }

//UNCITIZEN
    if(commandName === "uncitizen") {
      let eventfile = require("./intcommands/uncitizen.js");
      if(eventfile) eventfile.run(client, interaction, commandName, options, fs);
    }
  }

  module.exports.help = {
    name: "interactionCreate"
}