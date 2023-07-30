const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

// MiddleWare
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.d0hszsm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const productCollections = client.db("sparktech").collection("products");

    app.get("/all-products", async (req, res) => {
      const query = req.query.category ? { Category: req.query.category } : {};
      const result = await productCollections.find(query).toArray();
      res.send(result);
    });

    app.get("/featured-products", async (req, res) => {
      const result = await productCollections.find({}).limit(6).toArray();
      res.send(result);
    });

    app.get("/product/:id", async (req, res) => {
      const productId = req.params.id;
      const query = { _id: new ObjectId(productId) };
      const product = await productCollections.findOne(query);
      res.send(product);
    });
  } finally {
  }
}

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("server running");
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
