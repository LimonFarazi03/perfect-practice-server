const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0cm0o.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const collectionDatabase = client.db("person").collection("user");

    // get and read all api
    app.get("/notes", async (req, res) => {
      const query = req.body;
      // console.log(query)
      const cursor = collectionDatabase.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
    // get and read single api
    app.get("/note/:id", async(req, res) => {
      const id = req.params.id;
      const query = {_id : ObjectId(id)};
      const result = await collectionDatabase.findOne(query);
      res.send(result);
    });
    // Create api
    app.post("/note", async (req, res) => {
      const query = req.body;
      // console.log(data);
      const result = await collectionDatabase.insertOne(query);
      res.send(result);
    });
    // UPDATE api
    app.put("/note/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      console.log("form updating api", data);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          // দুইটা কোড আছে একটা ব্যবহার করলেই হবে

          ...data,

          // userName: data.userName,
          // userAddress: data.userAddress,
        },
      };
      const result = await collectionDatabase.updateOne(
        filter,
        updateDoc,
        options
      );
      // console.log('form put method', id);
      res.send(result);
    });

    // DELETE api
    app.delete("/note/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await collectionDatabase.deleteOne(filter);
    
      if (result.deletedCount === 1) {
        console.log("Successfully deleted one document.", id);
      } else {
        console.log("No documents matched the query. Deleted 0 documents.", id);
      }
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
