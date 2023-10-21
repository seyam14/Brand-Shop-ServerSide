const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app=express();
const port =process.env.PORT || 5000;

app.use (cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.izczxgs.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // for product
    const ProductCollection = client.db('ProductDB').collection('Product');
    // for user
    const userCollection = client.db('ProductDB').collection('user');

    app.get('/addProducts', async (req, res) => {
        const cursor = ProductCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/addProducts/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await ProductCollection.findOne(query)
      res.send(result)
     })

     app.get('/addProduct/:BrandName', async (req, res) => {
      const { BrandName } = req.params;
      try {
          const query = BrandName ? { BrandName: BrandName } : {};
          const cursor = await ProductCollection.find(query).toArray();
          res.send(cursor);
      } catch (error) {
          console.error("Error fetching phones:", error);
          res.status(500).send("Internal Server Error");
      }
  });
     

  app.get('/addProduct/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
          const result = await ProductCollection.findOne(query)
          res.send(result)
    });

    
    app.post('/addProducts', async (req, res) => {
        const newProduct = req.body;
        console.log(newProduct);
        const result = await ProductCollection.insertOne(newProduct);
        res.send(result);
    })

    
//    updated work here
app.put('/addProducts/:id', async(req, res) => {
  const id = req.params.id;
  const filter = {_id: new ObjectId(id)}
  const options = { upsert: true };
  const UpdateProduct = req.body;

  const product = {
      $set: {
          name: UpdateProduct.name, 
          BrandName: UpdateProduct.BrandName, 
          Price: UpdateProduct.Price, 
          Type: UpdateProduct.Type, 
         ShortDescription : UpdateProduct.ShortDescription, 
         rating: UpdateProduct.rating, 
          photo: UpdateProduct.photo
      }
  }

  const result = await ProductCollection.updateOne(filter, product, options);
  res.send(result);
})

  // user api
     
   app.get('/user', async (req, res) => {
    const cursor = userCollection.find();
    const users = await cursor.toArray();
    res.send(users);
})

app.post('/user', async (req, res) => {
    const user = req.body;
    console.log(user);
    const result = await userCollection.insertOne(user);
    res.send(result);
});

app.patch('/user', async (req, res) => {
    const user = req.body;
    const filter = { email: user.email }
    const updateDoc = {
        $set: {
            lastLoggedAt: user.lastLoggedAt
        }
    }
    const result = await userCollection.updateOne(filter, updateDoc);
    res.send(result);
})

app.delete('/user/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await userCollection.deleteOne(query);
    res.send(result);
})

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);












app.get('/',(req,res)=>{
    res.send('Brand  server')
})

app.listen(port,()=> {
    console.log(`server running on port: ${port}`)
})