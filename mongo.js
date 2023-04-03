require("dotenv").config();
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGODB);

async function run() {
  try {
    const db = client.db("Mitrona");
    const coll = db.collection("perms");

    await coll.insertOne();

    const cursor = coll.find();
    const results = await cursor.toArray();
    console.log(results);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);