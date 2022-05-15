const assert = require('assert');

const { MongoClient } = require('mongodb');

const mongo_url = 'mongodb://172.17.0.2:27017';
const options = { useUnifiedTopology: true };

describe(__filename, function() {
    describe('Mongo client connection', function() {
        it('should connect to databasae', async function() {
            const client = await MongoClient.connect(mongo_url, options);
            assert.notStrictEqual(client, null);
            assert.notStrictEqual(client, undefined);

            const db = client.db('entertainment');
            assert.notStrictEqual(db, null);
            assert.notStrictEqual(db, undefined);
            assert.strictEqual(db.s.namespace.db, 'entertainment');

            client.close();
        });
    });
});
