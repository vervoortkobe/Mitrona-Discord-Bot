const Discord = require("discord.js");
const fs = require("fs");

module.exports.run = async (client, app) => {

    function commandsReady() {
      fs.readdir("./commands/", (err, files) => {
        let jsfile = files.filter(f => f.split(".").pop() === "js");

        console.log("\x1b[0m", "");
        console.log("\x1b[36m", `» Loaded Commands: ${jsfile.length}`);
      });
    }

    function eventsReady() {
      fs.readdir("./devents/", (err, files) => {
        let jsfile = files.filter(f => f.split(".").pop() === "js");

        console.log("\x1b[36m", `» Loaded DEvents: ${jsfile.length}`);
        console.log("\x1b[36m", `» Cached Servers: ${client.guilds.cache.size}`);
        console.log("\x1b[36m", `» Cached Users: ${client.users.cache.size}`);
        console.log("\x1b[0m", "");
        console.log("\x1b[36m", `» Activity: PLAYING test`);
        console.log("\x1b[32m", `✔️  ${client.user.username} was started!`);
        console.log("\x1b[0m", "");
      });
    }

    commandsReady();
    setTimeout(eventsReady, 10);

    client.user.setActivity("test", { type: Discord.ActivityType.Playing });

    // let commands = client.application?.commands;
    // commands?.create({
    //   name: "help",
    //   description: "» Replies with the help command"
    // });

    app.get("/api/", (req, res) => {
      res.json({
        "botstats": {
          "servers": client.guilds.cache.size,
          "users": client.users.cache.size
        }
      });
    });

  }

module.exports.help = {
  name: "ready"
}
