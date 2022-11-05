// requires start
const express = require("express");
const cors = require("cors");
const {
  MongoClient,
  ServerApiVersion,
  ProfilingLevel,
  ObjectId,
} = require("mongodb");
const { query } = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
// requires end

// middlewares start
app.use(cors());
app.use(express.json());
// middlewares end

// mongo DB connect start
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2ahck7i.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
// mongo DB connect end

// initial run function making start
async function run() {
  try {
    const productsCollection = client.db("emaJohn").collection("products");
    // get all data from mongo DB start
    app.get("/products", async (req, res) => {
      const page = parseInt(req.query.page);
      const dataPerPage = parseInt(req.query.dataPerPage);
      const query = {};
      const cursor = productsCollection.find(query);
      const products = await cursor
        .skip(page * dataPerPage)
        .limit(dataPerPage)
        .toArray();
      const count = await productsCollection.estimatedDocumentCount();
      res.send({ count, products });
    });
    // get all data from mongo DB end

    // get the products by ids start
    app.post("/productsByIds", async (req, res) => {
      const ids = req.body;
      const objectIds = ids.map((id) => ObjectId(id));
      const query = { _id: { $in: objectIds } };
      const cursor = productsCollection.find(query);
      const products = await cursor.toArray();
    });
    // get the products by ids end
  } finally {
  }
}
run().catch((error) => console.error(error));
// initial run function making end

app.get("/", (req, res) => {
  res.send("Ema-John Server is Running");
});

app.listen(port, () => {
  console.log(`Ema-John Server is Running on Port ${port}`);
});
