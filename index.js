const express = require("express");
const cors = require("cors");
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("server is running fine");
});

const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vodyl0g.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db("freelance_db");
    const freelanceCollection = db.collection("freelance");

    app.get("/freelance", async (req, res) => {
      const result = await freelanceCollection.find().toArray();
      res.send(result);
    });

    app.post("/freelance", async (req, res) =>{
      const data = req.body
      console.log(data)
      const result = await freelanceCollection.insertOne(data)
      res.send(
        {
          success: true,
          result
        }
      )
    })

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

//
//
