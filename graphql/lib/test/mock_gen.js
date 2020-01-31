const axios = require("axios");

const create_mock_movie = async (GRAPH_URL, opts) => {
    let insert_query = {
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
            title: opts.title ? opts.title : '',
            date: opts.date ? opts.date : ''
        }
    };

    let find_query = {
        query: `
            query($id: ID, $title: String, $date: String) {
                training {
                    find(filter: { id: $id, title: $title, date: $date }) {
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
        variables: { title: opts.title ? opts.title : '' }
    }

    let result = false;

    let response = await axios.post(GRAPH_URL, insert_query);
    if (response.data.data.training.insert.success) {
        response = await axios.post(GRAPH_URL, find_query);

        if (response.data.data.training.find.success) {
            result = response.data.data.training.find.docs[0];
        }
    }

    return result;
};

const remove_mock_movies = async (GRAPH_URL) => {
    let remove_all_query = {
        query: `
            mutation {
              training {
                remove_all {
                  success
                  message
                }
              }
            }`
    };

    let response = await axios.post(GRAPH_URL, remove_all_query);
    return response.data.data.training.remove_all;
};

module.exports = { create_mock_movie, remove_mock_movies };
