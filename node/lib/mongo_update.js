'use strict';

let MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://192.168.50.101:27017';

(async () => {
    let options = { useNewUrlParser: true, useUnifiedTopology: true };
    let client = await MongoClient.connect(url, options);
    let db = client.db('entertainment');

    try {
        const res = await db.collection('movies').updateOne(
            { title: 'Hulk', date: new Date('2010-10-19') },
            { $set: { title: 'Hulk', date: new Date('2010-10-19') } },
            { upsert: true }
        );

        console.log(`res => ${JSON.stringify(res)}`);
    }
    finally {
        client.close();
    }
})().catch(err => console.error(err));
