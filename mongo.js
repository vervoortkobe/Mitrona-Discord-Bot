require("dotenv").config();
const { MongoClient } = require("mongodb");

const mongoClient = new MongoClient(process.env.MONGODB);

async function run() {
    const db = mongoClient.db("Mitrona");

    //await db.collection("giveaways").insertOne({});
    let giveaways = await db.collection("perms").find().toArray();

    console.log(giveaways);
    mongoClient.close();
}
run()