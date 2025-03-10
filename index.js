require("dotenv").config();
const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 3000;
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

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

    app.post("/add_equipment", async (req, res) => {
      const query = req.body;
      console.log("created new users", query);
      const result = await equipmentCollection.insertOne(query);
      res.send(result);
    });

    app.get("/add_equipment", async (req, res) => {
      const cursor = equipmentCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.delete("/add_equipment/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const result = await equipmentCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/add_equipment/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await equipmentCollection.findOne(query);
      res.send(result);
    });

    app.put("/add_equipment/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateStore = req.body;
      const store = {
        $set: {
          itemName: updateStore.itemName,
          categoryName: updateStore.categoryName,
          description: updateStore.description,
          price: updateStore.price,
          rating: updateStore.rating,
          customization: updateStore.customization,
          processingTime: updateStore.processingTime,
          stockStatus: updateStore.stockStatus,
          image: updateStore.image,
        },
      };
      const result = await equipmentCollection.updateOne(query, store, options);
      res.send(result);
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
