require("dotenv").config();
const { MongoClient } = require("mongodb");

const mongoClient = new MongoClient(process.env.MONGODB);

async function run() {
  try {
    const db = mongoClient.db("Mitrona");

    //await db.collection("giveaways").insertOne({});
    let giveaways = await db.collection("giveaways").find().toArray();

    console.log(giveaways);
  } catch(err) {
    console.error(err);
  } finally {
    await mongoClient.close();
  }
}
run()