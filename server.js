const express = require("express");
//const cors = require("cors");
const fs = require("fs");
const session = require("express-session");
const path = require("path");
const requestIp = require("request-ip");

function server(client, db) {

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
      console.log("\x1b[31m", "❌ | I couldn't find the events folder!");
      console.log("\x1b[0m", "");
      return;
    }
    
    jsfile.forEach((f, i) => {
      let props = require(`./events/get/${f}`);
      console.log("\x1b[0m", `• events/get/${f} was loaded!`);
    });
  });

  fs.readdir("./events/post/", (err, files) => {
    if(err) console.log(err);
    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if(jsfile.length <= 0) {
      console.log("\x1b[31m", "❌ | I couldn't find the events folder!");
      console.log("\x1b[0m", "");
      return;
    }
    
    jsfile.forEach((f, i) => {
      let props = require(`./events/post/${f}`);
      console.log("\x1b[0m", `• events/post/${f} was loaded!`);
    });
  });

  app.get("/", (req, res) => {
    //ip logging
    //console.log(req.clientIp);
    let eventfile = require("./events/get/home.js");
    if(eventfile) eventfile.run(req, res, client, db);
  });

  app.get("/api/", (req, res) => {
    let totalSeconds = (client.uptime / 1000);
    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);
    let uptime = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    res.json({
      "botstats": {
        "uptime": uptime,
        "users": client.guilds.cache.get(process.env.MITRONA_SERVERID).memberCount
      }
    });
  });

  app.get("/home", (req, res) => {
    res.redirect("/");
  });

  app.get("/ping", (req, res) => {
    let eventfile = require("./events/get/ping.js");
    if(eventfile) eventfile.run(req, res);
  });

  //STYLE.CSS
  app.get("/style.css", (req, res) => {
    res.sendFile(`${__dirname}/html/style.css`);
  });

  //SCRIPT.JS
  app.get("/script.js", (req, res) => {
    res.sendFile(`${__dirname}/html/script.js`);
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
  // app.get("/login", (req, res) => {
  //   let eventfile = require("./events/get/login.js");
  //   if(eventfile) eventfile.run(req, res, db);
  // });

  app.get("/auth", (req, res) => {
    let eventfile = require("./events/get/auth.js");
    if(eventfile) eventfile.run(req, res, db);
  });

  app.post("/logout", (req, res) => {
    let eventfile = require("./events/post/logout.js");
    if(eventfile) eventfile.run(req, res);
  });

  //SLASH COMMANDS
  app.get("/announce", (req, res) => {
    let eventfile = require("./events/get/main.js");
    if(eventfile) eventfile.run(req, res, client, "announce", db);
  });
  app.get("/autorole", (req, res) => {
    let eventfile = require("./events/get/main.js");
    if(eventfile) eventfile.run(req, res, client, "autorole", db);
  });
  app.get("/citizen", (req, res) => {
    let eventfile = require("./events/get/main.js");
    if(eventfile) eventfile.run(req, res, client, "citizen", db);
  });
  app.get("/clear", (req, res) => {
    let eventfile = require("./events/get/main.js");
    if(eventfile) eventfile.run(req, res, client, "clear", db);
  });
  app.get("/gcancel", (req, res) => {
    let eventfile = require("./events/get/main.js");
    if(eventfile) eventfile.run(req, res, client, "gcancel", db);
  });
  app.get("/gcheck", (req, res) => {
    let eventfile = require("./events/get/main.js");
    if(eventfile) eventfile.run(req, res, client, "gcheck", db);
  });
  app.get("/gend", (req, res) => {
    let eventfile = require("./events/get/main.js");
    if(eventfile) eventfile.run(req, res, client, "gend", db);
  });
  app.get("/giveaway", (req, res) => {
    let eventfile = require("./events/get/main.js");
    if(eventfile) eventfile.run(req, res, client, "giveaway", db);
  });
  app.get("/greroll", (req, res) => {
    let eventfile = require("./events/get/main.js");
    if(eventfile) eventfile.run(req, res, client, "greroll", db);
  });
  app.get("/uncitizen", (req, res) => {
    let eventfile = require("./events/get/main.js");
    if(eventfile) eventfile.run(req, res, client, "uncitizen", db);
  });

  //ACTIONS
  app.post("/add", (req, res) => {
    let eventfile = require("./events/post/add.js");
    if(eventfile) eventfile.run(req, res, db);
  });
  app.post("/remove", (req, res) => {
    let eventfile = require("./events/post/remove.js");
    if(eventfile) eventfile.run(req, res, db);
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
      console.log("\x1b[32m", `✅ | Your app is listening on port ${listener.address().port}!`, "\x1b[0m", "");
    }

    eventsReady();
    bootstrapReady();
    iconsReady();
    setTimeout(appReady, 500);
  });
}

module.exports = { server };