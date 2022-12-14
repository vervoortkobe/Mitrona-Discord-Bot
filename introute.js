const { REST, Routes } = require("discord.js");

module.exports.run = async (client) => {

    const commands = require("./intcommands.json");

    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

    (async () => {
      try {
        console.log("\x1b[36m", `» Started refreshing application (/) commands.`, "\x1b[0m", "");

        await rest.put(Routes.applicationCommands(process.env.DISCORD_OAUTH2_CLIENTID), { body: commands });

        console.log("\x1b[36m", `» Successfully reloaded application (/) commands.`, "\x1b[0m", "");
      } catch (err) {
        console.log(err);
      }
    })();

  }

module.exports.help = {
  name: "introute"
}