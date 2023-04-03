require("dotenv").config();
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGODB);

async function run() {
  try {
    const database = client.db("Mitrona");
    const coll = database.collection("perms");

    await coll.insertOne({
      "admin": [
        "408289224761016332",
        "606106751346933770",
        "866859570249072650",
        "362343214939635713"
      ],
      "announce": [],
      "autorole": [],
      "citizen": [],
      "clear": [],
      "gcancel": [],
      "gcheck": [],
      "gend": [],
      "giveaway": [],
      "greroll": [],
      "uncitizen": []
    });

    const cursor = coll.find();
    const results = await cursor.toArray();
    console.log(results);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);