const { MongoClient } = require("mongodb");
const mongoClient = new MongoClient(process.env.MONGODB);
const db = mongoClient.db("Mitrona");

async function checkPerms(interaction, cmd) {

    let fetchedperms = await db.collection("perms").find().toArray();
    let perms = fetchedperms[0];

    interaction.member.roles.cache.forEach(r => {
      switch (cmd) {
        case "announce":
          if(perms.announce.includes(r.id)) return true
          else return false;
          break;
        case "autorole":
          if(perms.autorole.includes(r.id)) return true
          else return false;
          break;
        case "citizen":
          if(perms.citizen.includes(r.id)) return true
          else return false;
          break;
        case "clear":
          if(perms.clear.includes(r.id)) return true
          else return false;
          break;
        case "gcancel":
          if(perms.gcancel.includes(r.id)) return true
          else return false;
          break;
        case "gcheck":
          if(perms.gcheck.includes(r.id)) return true
          else return false;
          break;
        case "gend":
          if(perms.gend.includes(r.id)) return true
          else return false;
          break;
        case "giveaway":
          if(perms.giveaway.includes(r.id)) return true
          else return false;
          break;
        case "greroll":
          if(perms.greroll.includes(r.id)) return true
          else return false;
          break;
        case "uncitizen":
          if(perms.uncitizen.includes(r.id)) return true
          else return false;
          break;
      
        default:
          break;
      }
    });
}

module.exports = { checkPerms };