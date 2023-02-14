const express = require("express");
const cors = require("cors");
const fs = require("fs");
const session = require("express-session");
const path = require("path");
const requestIp = require("request-ip");
require("dotenv").config();
//process.env.PORT = 80;

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

const app = express();

app.use(session({
	secret: process.env.EXPRESS_APP_SESSIONSECRET,
	resave: true,
	saveUninitialized: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(requestIp.mw());

fs.readdir("./events/get/", (err, files) => {
  if(err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if(jsfile.length <= 0) {
    console.log("\x1b[31m", "❌  I couldn't find the events folder!");
    console.log("\x1b[0m", "");
    return;
  }
   
  jsfile.forEach((f, i) => {
    let props = require(`./events/get/${f}`);
    console.log("\x1b[0m", `• get/${f} was loaded!`);
  });
});

fs.readdir("./events/post/", (err, files) => {
  if(err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if(jsfile.length <= 0) {
    console.log("\x1b[31m", "❌  I couldn't find the events folder!");
    console.log("\x1b[0m", "");
    return;
  }
   
  jsfile.forEach((f, i) => {
    let props = require(`./events/post/${f}`);
    console.log("\x1b[0m", `• post/${f} was loaded!`);
  });
});

app.get("/", (req, res) => {
  //ip logging
  //console.log(req.clientIp);
  let eventfile = require("./events/get/home.js");
  if(eventfile) eventfile.run(req, res, fs, client);
});

app.get("/home", (req, res) => {
  res.redirect("/");
});

app.get("/ping", (req, res) => {
  let eventfile = require("./events/get/ping.js");
  if(eventfile) eventfile.run(req, res, fs);
});

//BOOTSTRAP DIR HOST
let bootstraps = fs.readdirSync("./bootstrap-5.1.3-dist/css/themes/", { withFileTypes: true });
bootstraps.forEach(b => {
  app.get(`/bootstrap-5.1.3-dist/css/themes/${encodeURI(`${b.name}`)}`, (req, res) => {
    res.sendFile(`${__dirname}/bootstrap-5.1.3-dist/css/themes/${decodeURI(`${b.name}`)}`);
  });
});

//BOOTSTRAP JS
app.get("/bootstrap-5.1.3-dist/js/bootstrap.min.js", (req, res) => {
  res.sendFile(`${__dirname}/bootstrap-5.1.3-dist/js/bootstrap.min.js`);
});

//BOOTSTRAP JS MAP
app.get("/bootstrap-5.1.3-dist/js/bootstrap.min.js.map", (req, res) => {
  res.sendFile(`${__dirname}/bootstrap-5.1.3-dist/js/bootstrap.min.js.map`);
});

//ICONS DIR HOST
let icons = fs.readdirSync("./icons/", { withFileTypes: true });
icons.forEach(i => {
  app.get(`/icons/${encodeURI(`${i.name}`)}`, (req, res) => {
    res.sendFile(path.join(__dirname + `/icons/${decodeURI(`${i.name}`)}`));
  });
});

//DISCORD LOGIN
app.get("/login", (req, res) => {
  let eventfile = require("./events/get/login.js")
  if(eventfile) eventfile.run(req, res, fs);
});

app.get("/auth", (req, res) => {
  let eventfile = require("./events/get/auth.js")
  if(eventfile) eventfile.run(req, res, fs);
});

app.post("/logout", (req, res) => {
  let eventfile = require("./events/post/logout.js")
  if(eventfile) eventfile.run(req, res, fs);
});

//SLASH COMMANDS
app.get("/announce", (req, res) => {
  let eventfile = require("./events/get/announce.js")
  if(eventfile) eventfile.run(req, res, fs, client);
});
app.get("/autorole", (req, res) => {
  let eventfile = require("./events/get/autorole.js")
  if(eventfile) eventfile.run(req, res, fs, client);
});
app.get("/citizen", (req, res) => {
  let eventfile = require("./events/get/citizen.js")
  if(eventfile) eventfile.run(req, res, fs, client);
});
app.get("/clear", (req, res) => {
  let eventfile = require("./events/get/clear.js")
  if(eventfile) eventfile.run(req, res, fs, client);
});
app.get("/gcancel", (req, res) => {
  let eventfile = require("./events/get/gcancel.js")
  if(eventfile) eventfile.run(req, res, fs, client);
});
app.get("/gcheck", (req, res) => {
  let eventfile = require("./events/get/gcheck.js")
  if(eventfile) eventfile.run(req, res, fs, client);
});
app.get("/gend", (req, res) => {
  let eventfile = require("./events/get/gend.js")
  if(eventfile) eventfile.run(req, res, fs, client);
});
app.get("/giveaway", (req, res) => {
  let eventfile = require("./events/get/giveaway.js")
  if(eventfile) eventfile.run(req, res, fs, client);
});
app.get("/greroll", (req, res) => {
  let eventfile = require("./events/get/greroll.js")
  if(eventfile) eventfile.run(req, res, fs, client);
});
app.get("/uncitizen", (req, res) => {
  let eventfile = require("./events/get/uncitizen.js")
  if(eventfile) eventfile.run(req, res, fs, client);
});

//ROOT ROUTE
app.get("*", (req, res) => {
  res.redirect("/");
});

//LISTENER
const listener = app.listen(process.env.PORT, () => {
  function eventsReady() {
    let jsfilecount = 0;
    fs.readdir("./events/get/", (err, files) => {
      let jsfile = files.filter(f => f.split(".").pop() === "js");
      jsfilecount += jsfile.length;
    });
    fs.readdir("./events/post/", (err, files) => {
      let jsfile = files.filter(f => f.split(".").pop() === "js");
      jsfilecount += jsfile.length;
    });
    setTimeout(() => {
      console.log("\x1b[36m", `» Loaded Events: ${jsfilecount}`);
      //console.log("\x1b[0m", "");
    }, 100);
  }
  
  function bootstrapReady() {
    let bsfilecount = 0;
    fs.readdir("./bootstrap-5.1.3-dist/css/themes", (err, files) => {
      let bsfile = files.filter(f => f.split(".").pop() === "css");
      bsfilecount += bsfile.length;
    });
    setTimeout(() => {
      console.log("\x1b[36m", `» Loaded Bootstrap: ${bsfilecount}`);
      //console.log("\x1b[0m", "");
    }, 100);
  }

  function iconsReady() {
    let ifilecount = 0;
    fs.readdir("./icons/", (err, files) => {
      let ifile = files.filter(f => f.split(".").pop() === "png");
      ifilecount += ifile.length;
    });
    setTimeout(() => {
      console.log("\x1b[36m", `» Loaded Icons: ${ifilecount}`);
      console.log("\x1b[0m", "");
    }, 100);
  }
  
  function appReady() {
    console.log("\x1b[32m", `✔️  Your app is listening on port ${listener.address().port}!`, "\x1b[0m", "");
  }

  eventsReady();
  bootstrapReady();
  iconsReady();
  setTimeout(appReady, 500);
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
    console.log("\x1b[31m", "❌  I couldn't find the commands folder!");
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
    console.log("\x1b[31m", "❌  I couldn't find the intcommands folder!");
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
    console.log("\x1b[31m", "❌  I couldn't find the intcommands folder!");
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
    console.log("\x1b[31m", "❌  I couldn't find the devents folder!");
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
    if(deventfile) deventfile.run(client, app);
  });
//GUILD_MEMBER_ADD
  client.on("guildMemberAdd", member => {
    let deventfile = client.devents.get("guildMemberAdd");
    if(deventfile) deventfile.run(client, member);
  });

//INTERACTION_CREATE
  client.on("interactionCreate", async interaction => {
    let deventfile = client.devents.get("interactionCreate");
    if(deventfile) deventfile.run(client, interaction);
  });

//MESSAGE_CREATE
  client.on("messageCreate", async message => {
    let deventfile = client.devents.get("messageCreate");
    if(deventfile) deventfile.run(client, message);
  });

//client.on("debug", e => console.log(e));
client.login(process.env.TOKEN); 
