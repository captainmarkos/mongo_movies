const assert = require('assert');

const { MongoClient } = require('mongodb');

const url = 'mongodb://192.168.50.101:27017';
const options = { useUnifiedTopology: true };

describe(__filename, function() {
    describe('Mongo client connection', function() {
        it('should connect to databasae', async function() {
            const client = await MongoClient.connect(url, options);
            assert.notStrictEqual(client, null);
            assert.notStrictEqual(client, undefined);
            assert.strictEqual(client._eventsCount, 1);

            const db = client.db('entertainment');
            assert.notStrictEqual(db, null);
            assert.notStrictEqual(db, undefined);
            assert.strictEqual(db.s.namespace.db, 'entertainment');

            client.close();
        });
    });
});
