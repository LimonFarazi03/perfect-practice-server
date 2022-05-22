const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");

// middleware
app.use(cors());
app.use(express.json());

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0cm0o.mongodb.net/?retryWrites=true&w=majority`;
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
    app.get('/notes', async(req,res)=>{
      const query = req.body;
      console.log(query)
      const cursor = collectionDatabase.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
    // Create api 
    app.post('/note', async(req,res)=>{
      const data = req.body;
      console.log(data);
      const result = await collectionDatabase.insertOne(data);
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
