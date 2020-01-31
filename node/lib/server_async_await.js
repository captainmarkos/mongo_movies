'use strict';

const express = require('express');
const app = express();

const { MongoClient, ObjectID } = require('mongodb');
let db, movies;

app.get('/', async (req, res) => {
    const results = await movies.find({}).toArray();
    res.send(results);
});

app.get('/insert', async (req, res) => {
    let status = { success: false, message: 'Nothing inserted' };

    if (req.query.title && req.query.date) {
        if (req.query.date.match(/\d{4}-\d{2}-\d{2}/)) {
            let js_date = new Date(req.query.date);
            let query = { title: req.query.title, date: js_date };

            const results = await movies.insertOne(query);
            if (results.insertedCount === 1) {
                status.success = true;
                status.message = `Movie '${req.query.title}' has been added`;
            }
        }
    }
    res.send(status);
});

app.get('/find', async (req, res) => {
    let query = {};

    if (req.query.title) {
        query = { title: req.query.title };
    } else if (req.query.date) {
        let js_date = new Date(req.query.date);
        query = { date: js_date };
    } else if (req.query.id) {
        query = { _id: ObjectID(req.query.id) };
    }

    const results = await movies.find(query).toArray();
    res.send(results);
});

app.get('/remove', async (req, res) => {
    let query = {};

    if (req.query.id) {
        query = { _id: ObjectID(req.query.id) };
    }

    const results = await movies.deleteMany(query);
    res.send(results);
});

app.listen(80, async () => {
    const url = 'mongodb://192.168.50.101:27017';
    const options = { useNewUrlParser: true, useUnifiedTopology: true };

    const client = await MongoClient.connect(url, options);
    if (!client) { return 'some error'; }

    db = client.db('entertainment');
    movies = db.collection('movies');

    console.log('listening on 80');
});
