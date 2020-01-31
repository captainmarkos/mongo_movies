'use strict';

const express = require('express');
const app = express();

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const url = 'mongodb://192.168.50.101:27017';
const options = { useNewUrlParser: true, useUnifiedTopology: true };
let db, movies;

MongoClient.connect(url, options, (err, client) => {
    if (err) return console.log(err);

    db = client.db('entertainment');
    movies = db.collection('movies');

    app.get('/', (req, res) => {
        movies.find().toArray((err, results) => {
            res.send(results);
        });
    });

    app.get('/insert', (req, res) => {
        let status = { success: false, message: 'Nothing inserted' };

        if (req.query.title && req.query.date) {
            if (req.query.date.match(/\d{4}-\d{2}-\d{2}/)) {
                let js_date = new Date(req.query.date);
                let query = { title: req.query.title, date: js_date };

                movies.insertOne(query, (err, results) => {
                    if (results.insertedCount === 1) {
                        status.success = true;
                        status.message = `Movie '${req.query.title}' has been added`;
                    }
                    res.send(status);
                });
            }
        } else {
            res.send(status);
        }
    });

    app.get('/find', (req, res) => {
        let query = {};

        if (req.query.title) {
            query = { title: req.query.title };
        } else if (req.query.date) {
            query = { date: req.query.date };
        } else if (req.query.id) {
            query = { _id: ObjectID(req.query.id) };
        }

        movies.find(query).toArray((err, results) => {
            res.send(results);
        });
    });

    app.get('/remove', (req, res) => {
        let query = {};

        if (req.query.id) {
            query = { _id: ObjectID(req.query.id) };
        }

        movies.deleteMany(query, (err, results) => {
            res.send(results);
        });
    });

    app.listen(80, () => {
        console.log('listening on 80');
    });
});
