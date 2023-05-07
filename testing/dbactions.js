//THIS FILE IS NO LONGER IN USE!
const { MongoClient } = require("mongodb");
const mongoClient = new MongoClient(process.env.MONGODB);
const db = mongoClient.db("Mitrona");

async function dbActions(action, q) {
  switch (action) {
    case "getPerms":
      let perms = await db.collection("perms").find().toArray();
      return perms[0];
      break;
    
    case "guildMemberAdd":
      let autoroles = await db.collection("autoroles");
      return await autoroles.findOne({ guildid: q });
      break;
    
    case "getGiveaways":
      let giveaways = await db.collection("giveaways");
      return await giveaways.find().toArray();
      break;

    default:
      break;
  }
}

module.exports = { dbActions };