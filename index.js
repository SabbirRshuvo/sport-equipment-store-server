require("dotenv").config();
const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 3000;
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6a6u8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    console.log("mongodb is connected");

    const database = client.db("equipmentList");
    const equipmentCollection = database.collection("store");

    const database2 = client.db("usersDB");
    const usersCollection = database2.collection("users");

    // create a users to server to client
    app.post("/add_equipment", async (req, res) => {
      const query = req.body;
      console.log("created new users", query);
      const result = await equipmentCollection.insertOne(query);
      res.send(result);
    });

    //display this equipment
    app.get("/add_equipment", async (req, res) => {
      const cursor = equipmentCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // find a user
    app.get("/add_equipment/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await equipmentCollection.findOne(query);
      res.send(result);
    });

    // delete user
    app.delete("/add_equipment/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const result = await equipmentCollection.deleteOne(query);
      res.send(result);
    });

    // create users collection

    app.post("/users_list", async (req, res) => {
      const query = req.body;
      console.log("user is done", query);
      const result = await usersCollection.insertOne(query);
      res.send(result);
    });

    // get the users

    app.get("/users_list", async (req, res) => {
      const query = usersCollection.find();
      const cursor = await query.toArray();
      res.send(cursor);
    });

    app.get("/", async (req, res) => {
      res.send("sports equipment store server is on the server");
    });

    app.listen(port, () => {
      console.log(`server is running on port:`, port);
    });
  } catch (error) {
    console.log("Mongodb not connected");
  }
}
run();
