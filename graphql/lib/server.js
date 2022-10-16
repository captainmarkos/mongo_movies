const express = require('express');
const { ApolloServer, gql, SchemaDirectiveVisitor } = require('apollo-server-express');
const { MongoClient, ObjectID } = require('mongodb');
const { isValidMongoID, isValidDate} = require('./utils');
const { defaultFieldResolver } = require('graphql');
const moment = require('moment');
const start_date = Date.now();

// docker inspect <container id> | grep IPAddress
const mongo_url = 'mongodb://172.17.0.3:27017';
const mongo_options = { useNewUrlParser: true, useUnifiedTopology: true };

// Construct a schema, using GraphQL schema definition language (SDL).
const typeDefs = gql`
    type Query {
        training: training_query
    }

    type training_query {
        find(filter: training_query_input): training_query_status
    }

    type Mutation {
        training: training_mutation
    }

    type training_mutation {
        insert(input: training_insert_input): training_mutate_status!
        remove(input: training_remove_input): training_mutate_status!
        remove_all: training_mutate_status!
    }

    directive @training_formatted_date on FIELD_DEFINITION

    type training_movie {
        id: ID
        title: String
        date: String @training_formatted_date
    }

    type training_query_status {
        success: Boolean!
        message: String!
        docs: [training_movie]!
    }

    type training_mutate_status {
        success: Boolean!
        message: String!
    }

    input training_query_input {
        id: ID
        title: String
        date: String
    }

    input training_insert_input {
        title: String!
        date: String!
    }

    input training_remove_input {
        id: ID!
    }
`;

class FormattedDateDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
        const { resolve = defaultFieldResolver } = field;
        field.resolve = async function (...args) {
            const result = await resolve.apply(this, args);
            return moment(new Date(result)).format('YYYY-MM-DD');
        };
    }
}

// Provide resolver functions for the schema.
const resolvers = {
    Query: {
        training: () => { return {}; }
    },

    training_query: {
        find: async (parent, { filter }, { db }) => {
            let query = {};

            if (filter) {
                query = {
                    _id: isValidMongoID(filter.id) ? ObjectID(filter.id) : null,
                    title: filter.title,
                    date: isValidDate(filter.date) ? new Date(filter.date) : null
                };

                Object.keys(query).forEach( (key) => {
                    if (!query[key]) { delete query[key]; }
                });
            }

            let results = await db.find(query).toArray();

            return ({
                success: true,
                message: `query filter: ${JSON.stringify(query)}`,
                docs: results.map( (obj) => {
                    obj.id = obj._id;
                    return (obj);
                })
            });
        }
    },

    Mutation: {
        training: () => { return {}; }
    },

    training_mutation: {
        remove: async(parent, { input }, { db }) => {
            let status = { success: false, message: 'Invalid id' };

            if (!input.id) { status.message = 'Id is required'; return status; }
            if (!isValidMongoID(input.id)) { return status; }

            let query = { _id: ObjectID(input.id) };
            let results = await db.deleteMany(query);

            if (results.deletedCount > 0) {
                status.success = true;
                status.message = `${results.deletedCount} record with id=${query._id} has been removed`;
            } else {
                status = { success: false, message: `Nothing removed for id=${query._id} because no record with that id exists.` };
            }
            return status;
        },

        remove_all: async(parent, _args, { db }) => {
            let status = { success: false, message: 'Nothing to remove' };
            let query = {};
            let blurb = 'record has';
            let results = await db.deleteMany(query);
            if (results.deletedCount > 0) {
                if (results.deletedCount > 1) { blurb = 'records have'; }
                status.success = true;
                status.message = `Remove all: ${results.deletedCount} ` + blurb + ' been removed';
            }
            return status;
        },

        insert: async(parent, { input }, { db }) => {
            let status = { success: false, message: 'Both title and date are required fields' };

            if (input.title && input.date) {
                if (isValidDate(input.date)) {
                    let js_date = new Date(input.date);
                    let query = { title: input.title, date: js_date };
                    let results = await db.insertOne(query);
                    if (results.insertedCount === 1) {
                        status.success = true;
                        status.message = `Movie '${input.title}' has been added`;
                    }
                } else {
                    status.success = false;
                    status.message = `Invalid date.  The required format is YYYY-MM-DD.`;
                    return status;
                }
            }
            return status;
        }
    }
};

// Self invoking async anonymous function
async () => {
    const app = express();
    app.get('/status/', (req, res) => {
        res.json({ start: start_date });
    });

    const client = await MongoClient.connect(mongo_url, mongo_options);
    if (!client) { return 'mongo connect failed'; }

    let db = client.db('entertainment');

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        /* eslint-disable-next-line no-unused-vars */
        context: ({req}) => {
            return { db: db.collection('movies') };
        },
        schemaDirectives: { training_formatted_date: FormattedDateDirective }
    });

    server.applyMiddleware({ app, path: '/' });

    app.listen(4000, () => {
        console.log(`🚀 Server is ready`);
    });
}();
