const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://192.168.50.101:27017';
const options = { useNewUrlParser: true, useUnifiedTopology: true };

async function findOne() {
    const client = await MongoClient.connect(url, options)
        .catch(err => { console.log(err); });

    if (!client) { return; }

    try {
        const db = client.db('entertainment');

        let collection = db.collection('movies');

        let query = { title: 'Hulk' };

        let res = await collection.findOne(query);

        console.log(res);

    } catch (err) {
        console.log(err);
    } finally {
        client.close();
    }
}

findOne();
