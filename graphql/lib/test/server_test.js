/* eslint-disable quotes */
const { create_mock_movie, remove_mock_movies } = require('./mock_gen');

const mochaLib = require('@simpleview/mochalib');
const { deepCheck } = require('@simpleview/assertlib');
const axios = require('axios');

const GRAPH_URL = 'http://172.17.0.4:4000';

const mock_movies_generate = async () => {
    let options;
    let results = [];

    // start with a fresh slate
    await remove_mock_movies(GRAPH_URL);

    options = { title: 'Foo Bar', date: '2099-12-21' };
    results[0] = await create_mock_movie(GRAPH_URL, options);

    options = { title: 'Star Wars', date: '2019-12-21' };
    results[1] = await create_mock_movie(GRAPH_URL, options);

    return results;
};

describe(__filename, function() {
    describe('GraphQL container tests', function() {
        const tests = [
            {
                name: 'mutation insert movie',
                args: {
                    query: () => {
                        return ({
                            query: `
                              mutation($title: String!, $date: String!) {
                                training {
                                  insert(input: { title: $title, date: $date }) {
                                    success
                                    message
                                  }
                                }
                              }`,
                            variables: {
                                title: "8 Below",
                                date: "2035-01-01"
                            }
                        });
                    },
                    result: () => {
                        return ({
                            insert: {
                                success: true,
                                message: "Movie '8 Below' has been added"
                            }
                        });
                    }
                }
            },

            {
                name: 'mutation insert movie fails with missing title',
                args: {
                    query: () => {
                        return ({
                            query: `
                              mutation($title: String!, $date: String!) {
                                training {
                                  insert(input: { title: $title, date: $date }) {
                                    success
                                    message
                                  }
                                }
                              }`,
                            variables: {
                                title: '',
                                date: "2035-01-01"
                            }
                        });
                    },
                    result: () => {
                        return ({
                            insert: {
                                success: false,
                                message: "Both title and date are required fields"
                            }
                        });
                    }
                }
            },

            {
                name: 'mutation insert movie fails with bad date',
                args: {
                    query: () => {
                        return ({
                            query: `
                              mutation($title: String!, $date: String!) {
                                training {
                                  insert(input: { title: $title, date: $date }) {
                                    success
                                    message
                                  }
                                }
                              }`,
                            variables: {
                                title: 'Foo',
                                date: "2535-01-010009"
                            }
                        });
                    },
                    result: () => {
                        return ({
                            insert: {
                                success: false,
                                message: "Invalid date.  The required format is YYYY-MM-DD."
                            }
                        });
                    }
                }
            },

            {
                name: 'query for movie by id',
                args: {
                    query: (mock_movies) => {
                        return ({
                            query: `
                              query($id: ID) {
                                training {
                                  find(filter: { id: $id }) {
                                    success
                                    message
                                    docs {
                                      id
                                      title
                                      date
                                    }
                                  }
                                }
                              }`,
                            variables: {
                                id: `${mock_movies[0].id}`
                            }
                        });
                    },
                    result: (mock_movies) => {
                        return ({
                            find: {
                                success: true,
                                message: `query filter: {"_id":"${mock_movies[0].id}"}`,
                                docs: [ mock_movies[0] ]
                            }
                        });
                    }
                }
            },

            {
                name: 'query for movies by title',
                args: {
                    query: (mock_movies) => {
                        return ({
                            query: `
                              query($title: String) {
                                training {
                                  find(filter: { title: $title }) {
                                    success
                                    message
                                    docs {
                                      id
                                      title
                                      date
                                    }
                                  }
                                }
                              }`,
                            variables: {
                                title: `${mock_movies[1].title}`
                            }
                        });
                    },
                    result: (mock_movies) => {
                        return ({
                            find: {
                                success: true,
                                message: `query filter: {"title":"${mock_movies[1].title}"}`,
                                docs: [ mock_movies[1] ]
                            }
                        });
                    }
                }
            },

            {
                name: 'query for movies by date',
                args: {
                    query: () => {
                        return ({
                            query: `
                              query($date: String) {
                                training {
                                  find(filter: { date: $date }) {
                                    success
                                    message
                                    docs {
                                      id
                                      title
                                      date
                                    }
                                  }
                                }
                              }`,
                            variables: { date: '2019-12-21' }
                        });
                    },
                    result: (mock_movies) => {
                        return ({
                            find: {
                                success: true,
                                message: `query filter: {"date":"2019-12-21T00:00:00.000Z"}`,
                                docs: [ mock_movies[1] ]
                            }
                        });
                    }
                }
            },

            {
                name: 'query for movies by title and date',
                args: {
                    query: (mock_movies) => {
                        return ({
                            query: `
                              query($title: String, $date: String) {
                                training {
                                  find(filter: { title: $title, date: $date }) {
                                    success
                                    message
                                    docs {
                                      id
                                      title
                                      date
                                    }
                                  }
                                }
                              }`,
                            variables: { title: `${mock_movies[1].title}`, date: '2019-12-21' }
                        });
                    },
                    result: (mock_movies) => {
                        return ({
                            find: {
                                success: true,
                                message: `query filter: {"title":"${mock_movies[1].title}","date":"2019-12-21T00:00:00.000Z"}`,
                                docs: [ mock_movies[1] ]
                            }
                        });
                    }
                }
            },

            {
                name: 'query for movie by id - not found',
                args: {
                    query: () => {
                        return ({
                            query: `
                              query($id: ID) {
                                training {
                                  find(filter: { id: $id }) {
                                    success
                                    message
                                    docs {
                                      id
                                      title
                                      date
                                    }
                                  }
                                }
                              }`,
                            variables: {
                                id: "9e1390ccb68635008273b540"
                            }
                        });
                    },
                    result: () => {
                        return ({
                            find: {
                                success: true,
                                message: "query filter: {\"_id\":\"9e1390ccb68635008273b540\"}",
                                docs: []
                            }
                        });
                    }
                }
            },

            {
                name: 'query for movies by title - not found',
                args: {
                    query: () => {
                        return ({
                            query: `
                              query($title: String) {
                                training {
                                  find(filter: { title: $title }) {
                                    success
                                    message
                                    docs {
                                      id
                                      title
                                      date
                                    }
                                  }
                                }
                              }`,
                            variables: { title: "A!B@C#D$E^F*" }
                        });
                    },
                    result: () => {
                        return ({
                            find: {
                                success: true,
                                message: `query filter: {"title":"A!B@C#D$E^F*"}`,
                                docs: []
                            }
                        });
                    }
                }
            },

            {
                name: 'query for movies by date - not found',
                args: {
                    query: () => {
                        return ({
                            query: `
                              query($date: String) {
                                training {
                                  find(filter: { date: $date }) {
                                    success
                                    message
                                    docs {
                                      id
                                      title
                                      date
                                    }
                                  }
                                }
                              }`,
                            variables: { date: '2199-12-21' }
                        });
                    },
                    result: () => {
                        return ({
                            find: {
                                success: true,
                                message: `query filter: {"date":"2199-12-21T00:00:00.000Z"}`,
                                docs: []
                            }
                        });
                    }
                }
            },

            {
                name: 'mutation remove movie by id',
                args: {
                    query: (mock_movies) => {
                        return ({
                            query: `
                              mutation($id: ID="${mock_movies[1].id}") {
                                training {
                                  remove(input: { id: $id }) {
                                    success
                                    message
                                  }
                                }
                              }`,
                            variables: { id: `${mock_movies[1].id}` }
                        });
                    },
                    result: (mock_movies) => {
                        return ({
                            remove: {
                                success: true,
                                message: `1 record with id=${mock_movies[1].id} has been removed`
                            }
                        });
                    }
                }
            },

            {
                name: 'mutation remove movie by id - not found',
                args: {
                    query: () => {
                        return ({
                            query: `
                              mutation($id: ID="0e0a55422a082e0011136cbd") {
                                training {
                                  remove(input: { id: $id }) {
                                    success
                                    message
                                  }
                                }
                              }`,
                            variables: { id: "0e0a55422a082e0011136cbd" }
                        });
                    },
                    result: () => {
                        return ({
                            remove: {
                                success: false,
                                message: "Nothing removed for id=0e0a55422a082e0011136cbd because no record with that id exists."
                            }
                        });
                    }
                }
            },

            {
                name: 'mutation remove movie by id - missing id',
                args: {
                    query: () => {
                        return ({
                            query: `
                              mutation {
                                training {
                                  remove(input: { id: "" }) {
                                    success
                                    message
                                  }
                                }
                              }`
                        });
                    },
                    result: () => {
                        return ({
                            remove: {
                                success: false,
                                message: "Id is required"
                            }
                        });
                    }
                }
            },

            {
                name: 'mutation remove movie by id - invalid id',
                args: {
                    query: () => {
                        return ({
                            query: `
                              mutation {
                                training {
                                  remove(input: { id: "one-two-three" }) {
                                    success
                                    message
                                  }
                                }
                              }`
                        });
                    },
                    result: () => {
                        return ({
                            remove: {
                                success: false,
                                message: "Invalid id"
                            }
                        });
                    }
                }
            },

            {
                name: 'mutation remove_all',
                args: {
                    query: () => {
                        return ({
                            query: `
                              mutation {
                                training {
                                  remove_all {
                                    success
                                    message
                                  }
                                }
                              }`
                        });
                    },
                    result: () => {
                        return ({
                            remove_all: {
                                success: true,
                                message: "Remove all: 2 records have been removed"
                            }
                        });
                    }
                }
            }
        ];

        mochaLib.testArray(tests, async function(test) {
            let mock_movies = await mock_movies_generate();

            const response = await axios.post(GRAPH_URL, test.query(mock_movies));

            const result = response.data.data.training;

            return deepCheck(result, test.result(mock_movies));
        });
    });
});
