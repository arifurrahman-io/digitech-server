const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@friitraining.a5d8fvh.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('wildLife').collection('services');
        const reviewCollection = client.db('wildLife').collection('reviews');
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query).limit(3);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log(service);
            const result = await serviceCollection.insertOne(service);
            res.send(result);
        });

        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const review = await reviewCollection.findOne(query);
            res.send(review);
        });

        app.get('/reviews', async (req, res) => {

            let query = {};

            if (req.query.id) {
                query = {
                    id: req.query.id
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        app.get('/myreviews', async (req, res) => {

            let query = {};

            if (req.query.email) {
                query = {
                    "user.email": req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        app.delete('/myreviews/:id', async (req, res) => {
            const id = req.params.id;
            console.log('trying to delete', id);
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        });

        app.put('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };

            const myreview = req.body;
            console.log(myreview);
            const option = { upsert: true };
            const updatedReview = {
                $set: {
                    review: myreview.review,
                }
            }
            const result = await reviewCollection.updateOne(filter, updatedReview, option);
            res.send(result);
        })

        app.get('/all-services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const allServices = await cursor.toArray();
            res.send(allServices);
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

    } finally {

    }
}
run().catch(err => console.error(err))

app.get('/', (req, res) => {
    res.send('DigiTech server is running')
})

app.listen(port, () => {
    console.log(`DigiTech server is running on ${port}`)
})