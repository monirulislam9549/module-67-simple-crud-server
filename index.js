const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express()

// middleware
app.use(cors())
app.use(express.json())

const uri = "mongodb+srv://monirulislam9549:Hn5ruicDkLjqr9vj@cluster0.skg6sgn.mongodb.net/?retryWrites=true&w=majority";
// console.log(uri);

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
        // const database = client.db("userDB");
        // const userCollection = database.collection("user")
        const userCollection = client.db("userDB").collection("user")

        // CRUD OPERATION = CREATE(post), READ(get), UPDATE, DELETE

        // GOTO Find Multiple Documents IN MONGODB
        // READ
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        // UPDATE Find a Document IN MONGODB
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const user = await userCollection.findOne(query)
            res.send(user)
        })

        // CREATE 
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log('new user', user);
            const result = await userCollection.insertOne(user);
            res.send(result)
        })

        // DELETE A DOCUMENT
        // DELETE
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            console.log('please delete', id);
            const query = { _id: new ObjectId(id) }
            const result = await userCollection.deleteOne(query)
            // console.log(result);
            res.send(result)
        })

        // UPDATE 
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const user = req.body;
            console.log(id, user);
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updatedUser = {
                $set: {
                    name: user.name,
                    email: user.email
                }
            }
            const result = await userCollection.updateOne(filter, updatedUser, options)
            res.send(result)
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



app.get('/', (req, res) => {
    res.send('SIMPLE CRUD IS RUNNING')
})

app.listen(port, () => {
    console.log(`SIMPLE CRUD is running on port: ${port}`);
})