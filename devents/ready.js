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

    client.user.setActivity(`${process.env.ACTIVITY}`, { type: Discord.ActivityType.Watching });

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

//GIVEAWAYS
    setInterval(() => {
      let giveaways = JSON.parse(fs.readFileSync("./giveaways.json", "utf-8"));
      
      giveaways.forEach(ga => {
        if(ga.busy === true) {
          if(ga.time <= Date.now()) {
            if(client.guilds.cache.get(ga.guild)) {

              let giveawayGuild = client.guilds.cache.get(ga.guild);
              if(giveawayGuild.channels.cache.get(ga.channel)) {
                let giveawayChannel = giveawayGuild.channels.cache.get(ga.channel);

                let randomcolors = Math.floor(Math.random() * 0xFFFFFF).toString(16);
                let color = `#${randomcolors}`;

                let styles = [
                  Discord.ButtonStyle.Primary, 
                  Discord.ButtonStyle.Secondary, 
                  Discord.ButtonStyle.Success, 
                  Discord.ButtonStyle.Danger
                ];
                let randomstyle = Math.floor(Math.random() * styles.length);
                let style = styles[randomstyle];

                const giveawayButton = new Discord.ActionRowBuilder()
                .addComponents(
                  new Discord.ButtonBuilder()
                  .setCustomId("giveawaybutton")
                  .setEmoji("🎉")
                  .setStyle(style)
                  .setDisabled(true)
                );

                ga.busy = 
                  Boolean(false);

                console.log(ga);
                giveaways.concat(ga);

                fs.writeFile("./giveaways.json", JSON.stringify(giveaways), (err) => {
                  if(err) console.log(err);
                });

                console.log(ga.participants.length);
                
                if(!ga.participants || ga.participants === [] || ga.participants.length < 2 || ga.participants.length < ga.winners) {
                  const giveawayEmbed = new Discord.EmbedBuilder()
                  .setColor(`${color}`)
                  .setTitle("🥳 GIVEAWAY")
                  .setDescription(`🎊 *You can't participate in this giveaway anymore!*\n\n> **Ends at:** \`ENDED\`\n> **Winners:** \`None\`\n> **Prize:** \`${ga.prize}\`\n> **Participants:** \`${ga.participants.length}\``)
                  .setTimestamp()

                  giveawayChannel.messages.fetch(ga.giveawaymsg)
                  .then(m => {
                    m.edit({ embeds: [ giveawayEmbed ], components: [ giveawayButton ] });
                  }).catch(err => {
                    m.send({ embeds: [ giveawayEmbed ], components: [ giveawayButton ] });
                  });
                
                  const giveawayEndedEmbed = new Discord.EmbedBuilder()
                  .setColor(`${color}`)
                  .setTitle("🥳 GIVEAWAY ENDED")
                  .setURL(`https://discord.com/channels/${ga.guild}/${ga.channel}/${ga.giveawaymsg}`)
                  .setDescription(`❌ **|** ***The amount of participants for the giveaway about \`${ga.prize}\` was too small, so I couldn't choose winners!***`)
                  return giveawayChannel.send({ embeds: [ giveawayEndedEmbed ] });
                }
                
                let winnersarray = [];
                for (let i = 0; i < ga.winners; i++) {
                  let randomparts = Math.floor(Math.random() * ga.participants.length);
                  if(winnersarray.includes(giveawayGuild.members.cache.get(ga.participants[randomparts]).user)) continue;
                  winnersarray.push(giveawayGuild.members.cache.get(ga.participants[randomparts]).user);
                }

                if(winnersarray.length > 1 && ga.winners > 1) winners = winnersarray.join(", ");

                console.log(winnersarray.join(", "));

                const giveawayEmbed = new Discord.EmbedBuilder()
                .setColor(`${color}`)
                .setTitle("🥳 GIVEAWAY")
                .setDescription(`🎊 *You can't participate in this giveaway anymore!*\n\n> **Ends at:** \`ENDED\`\n> **Winners:** **${winnersarray}**\n> **Prize:** \`${ga.prize}\``)
                .setTimestamp()
                
                giveawayChannel.messages.fetch(ga.giveawaymsg)
                .then(m => {
                  m.edit({ embeds: [ giveawayEmbed ], components: [ giveawayButton ] });
                }).catch(err => {
                  m.send({ embeds: [ giveawayEmbed ], components: [ giveawayButton ] });
                });
                
                const giveawayEndedEmbed = new Discord.EmbedBuilder()
                .setColor(`${color}`)
                .setTitle("🥳 GIVEAWAY ENDED")
                .setURL(`https://discord.com/channels/${ga.guild}/${ga.channel}/${ga.giveawaymsg}`)
                .setDescription(`✅ **|** ***Congratulations to ${winnersarray} for winning the giveaway about \`${ga.prize}\`!***`)
                giveawayChannel.send({ embeds: [ giveawayEndedEmbed ] });
              }
            }
          }
        }
      });
    }, 1000);

//BACKUP
    setInterval(() => {
      let autoroles = JSON.parse(fs.readFileSync("./autoroles.json", "utf-8"));
      fs.writeFile("./arbackup.json", JSON.stringify(autoroles), (err) => {
        if(err) console.log(err);
      });
      let giveaways = JSON.parse(fs.readFileSync("./giveaways.json", "utf-8"));
      fs.writeFile("./gabackup.json", JSON.stringify(giveaways), (err) => {
        if(err) console.log(err);
      });
    }, 60 * 60 * 1000);

  }

module.exports.help = {
  name: "ready"
}
