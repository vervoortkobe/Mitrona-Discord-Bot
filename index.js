const fs = require("fs");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const mongoClient = new MongoClient(process.env.MONGODB);

///////////////////////////////////////////////////////////////////////////////////
//DISCORD CLIENT INITIALISATION
const Discord = require("discord.js");
const client = new Discord.Client({
  allowedMentions: { 
    parse: ["users", "roles"], 
    repliedUser: true 
  }, 
  intents: [ 
    Discord.GatewayIntentBits.Guilds, 
    Discord.GatewayIntentBits.GuildMembers, 
    Discord.GatewayIntentBits.GuildPresences, 
    Discord.GatewayIntentBits.GuildMessages, 
    Discord.GatewayIntentBits.GuildMessageReactions, 
    Discord.GatewayIntentBits.MessageContent 
  ], 
  partials: [
    Discord.Partials.User, 
    Discord.Partials.Channel, 
    Discord.Partials.GuildMember, 
    Discord.Partials.Message, 
    Discord.Partials.Reaction, 
    Discord.Partials.ThreadMember
  ] 
});

///////////////////////////////////////////////////////////////////////////////////

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.intcommands = new Discord.Collection();
client.devents = new Discord.Collection();
client.buttons = new Discord.Collection();
client.introute = new Discord.Collection();

//DISCORD COMMANDS LOADING
fs.readdir("./devents/commands/", (err, files) => {
  if(err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if(jsfile.length <= 0) {
    console.log("\x1b[31m", "❌ | I couldn't find the commands folder!");
    console.log("\x1b[0m", "");
    return;
  }
   
  jsfile.forEach((f, i) => {
    let props = require(`./devents/commands/${f}`);
    console.log("\x1b[0m", `• devents/commands/${f} was loaded!`);
    client.commands.set(props.help.name, props);
    props.help.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

//DISCORD INTCOMMANDS LOADING
fs.readdir("./devents/intcommands/", (err, files) => {
  if(err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if(jsfile.length <= 0) {
    console.log("\x1b[31m", "❌ | I couldn't find the intcommands folder!");
    console.log("\x1b[0m", "");
    return;
  }
   
  jsfile.forEach((f, i) => {
    let props = require(`./devents/intcommands/${f}`);
    console.log("\x1b[0m", `• devents/intcommands/${f} was loaded!`);
    client.intcommands.set(props.help.name, props);
  });
});

//DISCORD BUTTONS LOADING
fs.readdir("./devents/buttons/", (err, files) => {
  if(err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if(jsfile.length <= 0) {
    console.log("\x1b[31m", "❌ | I couldn't find the intcommands folder!");
    console.log("\x1b[0m", "");
    return;
  }
   
  jsfile.forEach((f, i) => {
    let props = require(`./devents/buttons/${f}`);
    console.log("\x1b[0m", `• devents/buttons/${f} was loaded!`);
    client.buttons.set(props.help.name, props);
  });
});

//DISCORD EVENTS LOADING
fs.readdir("./devents/", (err, files) => {
  if(err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if(jsfile.length <= 0) {
    console.log("\x1b[31m", "❌ | I couldn't find the devents folder!");
    console.log("\x1b[0m", "");
    return;
  }
  jsfile.forEach((f, i) => {
    let props = require(`./devents/${f}`);
    console.log("\x1b[0m", `• devents/${f} was loaded!`);
    client.devents.set(props.help.name, props);
  });
});

/////////////////////////////////////////////////////////////////////////////////////////////
//INTERACTION_ROUTE
let intprops = require(`./introute.js`);
console.log("\x1b[0m", `• introute.js was loaded!`);
client.introute.set(intprops.help.name, intprops);
let introutefile = client.introute.get("introute");
if(introutefile) introutefile.run(client);
  
/////////////////////////////////////////////////////////////////////////////////////////////
//DISCORD EVENTS
//READY
client.on("ready", async () => {
  let deventfile = client.devents.get("ready");
  if(deventfile) deventfile.run(client, mongoClient);
});

//GUILD_MEMBER_ADD
client.on("guildMemberAdd", member => {
  let deventfile = client.devents.get("guildMemberAdd");
  if(deventfile) deventfile.run(client, member, mongoClient);
});

//INTERACTION_CREATE
client.on("interactionCreate", async interaction => {
  let deventfile = client.devents.get("interactionCreate");
  if(deventfile) deventfile.run(client, interaction, mongoClient);
});

//MESSAGE_CREATE
client.on("messageCreate", async message => {
  let deventfile = client.devents.get("messageCreate");
  if(deventfile) deventfile.run(client, message, mongoClient);
});

//client.on("debug", e => console.log(e));
client.login(process.env.TOKEN); 