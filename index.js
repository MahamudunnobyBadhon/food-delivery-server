const express = require('express');
const { MongoClient } = require('mongodb');

const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

var cors = require('cors')


const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())
// myDBuser1
// s2QOSjZNp8Cl4NV5



const { json } = require('express');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h2kkq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
      await client.connect();

      const database = client.db("food-delivery");
      const foodscollection = database.collection("foods");
      const orderscollection = database.collection("orders");
      //GET API
      app.get('/foods', async(req, res) => {
          const cursor = foodscollection.find({});

          const foods = await cursor.toArray();
          res.send(foods);
      })  

      //GET Single Food
      app.get('/foods/:id', async(req, res) => {
          const id = req.params.id;
          const query = {_id : ObjectId(id)};
          const singleFood = await foodscollection.findOne(query);
          res.json(singleFood);
      })

      //POST API
        app.post('/foods', async(req, res) => {

            const food= req.body;
            console.log('hit the post api', food);

            const result = await foodscollection.insertOne(food);

            console.log(result);
            res.json(result);
        })

        //POST API for Order

        app.post('/orders', async(req, res) => {
            const order = req.body;
            const result = await orderscollection.insertOne(order);

            console.log(result);
            res.json(result);
        })


        // get all orders
        app.get('/myOrders', async(req, res) => {
            const cursor = orderscollection.find({});
  
            const foods = await cursor.toArray();
            res.send(foods);
        })  
        //My orders
        app.get('/myOrders/:email', async (req, res) => {

            console.log(req.params.email);

            const cursor = await orderscollection.find({email : req.params.email});

            const foods = await cursor.toArray();
            // const query = {email: req.params.email};
            // const result = await orderscollection.find({email: req.params.email});
            // const x = {result: result}
            res.send(foods);
            console.log(foods);
        })


        // Delete foods
        app.delete("/deleteFood/:id", async (req, res) => {

            const id = req.params.id;
            console.log(id);
            const query = {_id:ObjectId(id)};
            console.log(query);
            const result = await foodscollection.deleteOne(query);
            console.log(result);
            res.send(result);
        });

        // Delete my order
        app.delete("/deleteOrder/:id", async (req, res) => {

            const id = req.params.id;
            console.log(id);
            const query = {_id:ObjectId(id)};
            console.log(query);
            const result = await orderscollection.deleteOne(query);
            console.log(result);
            res.send(result);
        });

        // Get All Order
        app.get('/allOrders', async(req, res) => {
            const cursor = orderscollection.find({});
  
            const foods = await cursor.toArray();
            res.send(foods);
        })  


        // Update Pending Status
        app.put("/updateStatus/:id", async(req, res) => {
            const id = req.params.id;
            const updatedStatus = req.body.status;
            const filter = { _id: ObjectId(id) };
            console.log(updatedStatus);
            const result = await orderscollection.updateOne(filter, {
                $set: { status: updatedStatus },
              })
            res.send(result);
              
        });
        

    } 
    finally {
    //   await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running Food-delivery-server')
})

app.listen(port, ()=>{
    console.log('running server on port', port);
})
