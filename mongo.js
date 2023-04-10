require("dotenv").config();
const { MongoClient } = require("mongodb");

const mongoClient = new MongoClient(process.env.MONGODB);

async function run() {
    const db = mongoClient.db("Mitrona");

    //await db.collection("giveaways").insertOne({});
    //let giveaways = await db.collection("perms").find().toArray();

    /*db.collection("autoroles").insertOne({
        guildid: '1050764959384080416',
        autoroles: [
        '1051608138924695574',
        '1051606707496812604',
        '1051819048813477950'
      ]});*/
      let autoroles = await db.collection("autoroles");

      //autoroles.updateOne({ guildid: "1050764959384080416" }, { $push: { autoroles: "test" } });

      /*let a = await autoroles.findOne({ guildid: "1050764959384080416" });
      console.log(a.autoroles)
      autoroles.updateOne({ guildid: "1050764959384080416" }, { $set: { autoroles: a.autoroles.filter(e => e != "test") } });
      console.log(await autoroles.find().toArray());*/

      let giveaways = await db.collection("giveaways").find().toArray();
      giveaways.forEach(ga => console.log(ga));

    mongoClient.close();
}
run()