const mochaLib = require('@simpleview/mochalib');
const assert = require('assert');
const { deepCheck } = require('@simpleview/assertlib');
const axios = require('axios');

const EXPRESS_WWW_URL = 'http://172.17.0.3/';

describe(__filename, function() {
    describe('Express Server', function() {
        const tests = [
            /*
            {
                name: '/ root should return 200 OK',
                args: {
                    deepcheck: false,
                    query: '',
                    result: {
                        status: 200,
                        statusText: 'OK'
                    }
                }
            },
            */
            {
                name: 'find movie by id',
                args: {
                    deepcheck: true,
                    query: 'find?id=5e1390ccb68635008273b540',
                    result: {
                        docs: []
                    }
                }
            },

            {
                name: 'find movie by title',
                args: {
                    deepcheck: true,
                    query: 'find?title=Bad%20Boys',
                    result: {
                        docs: []
                    }
                }
            },

            {
                name: 'find movie by date',
                args: {
                    deepcheck: true,
                    query: 'find?date=3910-10-10',
                    result: {
                        docs: []
                    }
                }
            },

            {
                name: 'find movie by id - not found',
                args: {
                    deepcheck: true,
                    query: 'find?id=990f57435d366d004604002c',
                    result: { docs: [] }
                }
            },

            {
                name: 'find movie by title - not found',
                args: {
                    deepcheck: true,
                    query: 'find?title=TITLE',
                    result: { docs: [] }
                }
            },

            {
                name: 'find movie by date - not found',
                args: {
                    deepcheck: true,
                    query: 'find?date=2120-01-10',
                    result: { docs: [] }
                }
            },

            {
                name: 'insert movie with title and date',
                args: {
                    deepcheck: true,
                    query: 'insert?title=Good%20Girls&date=2910-10-10',
                    result: {
                        success: true,
                        message: 'Movie \'Good Girls\' has been added'
                    }
                }
            },

            {
                name: 'remove movie by id - not found',
                args: {
                    deepcheck: true,
                    query: 'remove?id=990f57435d366d004604002c',
                    result: {
                        success: false,
                        message: 'Nothing removed for id=990f57435d366d004604002c because no record with that id exists.'
                    }
                }
            }
        ];

        mochaLib.testArray(tests, async function(test) {
            const response = await axios.get(`${EXPRESS_WWW_URL}${test.query}`);

            if (test.deepcheck) {
                deepCheck(response.data, test.result);
            } else {
                assert.strictEqual(response.status, test.result.status);
                assert.strictEqual(response.statusText, test.result.statusText);
            }
        });
    });
});
