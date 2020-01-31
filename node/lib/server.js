'use strict';

const express = require('express');
const app = express();

const axios = require('axios');

const movieQuery = function(args) {
    return ({
        query: `
            query($filter: training_query_input) {
              training {
                find(filter: $filter) {
                  docs {
                    id
                    title
                    date
                  }
                }
              }
            }`,

        variables: {
            filter: {
                id: args.id ? args.id : '',
                title: args.title ? args.title : '',
                date: args.date ? args.date : ''
            }
        }
    });
};

const movieRemove = function(args) {
    return ({
        query: `mutation($input: training_remove_input) {
                   training {
                     remove(input: $input) {
                       success
                       message
                     }
                   }
                 }`,

        variables: {
            input: {
                id: args.id ? args.id : ''
            }
        }
    });
};

const movieInsert = function(args) {
    return ({
        query: `mutation($input: training_insert_input) {
                   training {
                     insert(input: $input) {
                       success
                       message
                     }
                   }
                 }`,

        variables: {
            input: {
                title: args.title ? args.title : '',
                date: args.date ? args.date : ''
            }
        }
    });
};

const gql_request = async function(query) {
    const API_URL = 'http://192.168.50.101:4000';
    const response = await axios.post(API_URL, query);
    return (response);
};

/*
app.get('/', async (req, res) => {
    const query = movieQuery({});
    const result = await gql_request(query);
    res.send(result.data.data.training.find);
});
*/

app.get('/find', async (req, res) => {
    let query = {
        id: req.query.id ? req.query.id : null,
        title: req.query.title ? req.query.title : null,
        date: req.query.date ? req.query.date : null
    };

    Object.keys(query).forEach( (key) => {
        if (!query[key]) { delete query[key]; }
    });

    const result = await gql_request(movieQuery(query));
    res.send(result.data.data.training.find);
});

app.get('/insert', async (req, res) => {
    let result = {};

    if (req.query.title && req.query.date) {
        if (req.query.date.match(/\d{4}-\d{2}-\d{2}/)) {
            let query = { title: req.query.title, date: req.query.date };
            const response = await gql_request(movieInsert(query));
            result = response.data.data.training.insert;
        }
    }

    res.send(result);
});

app.get('/remove', async (req, res) => {
    if (req.query.id) {
        let query = { id: req.query.id };
        const result = await gql_request(movieRemove(query));
        res.send(result.data.data.training.remove);
    } else {
        res.send({});
    }
});

app.listen(80, async () => {
    console.log(`🚀 Server is listening on port 80`);
});
