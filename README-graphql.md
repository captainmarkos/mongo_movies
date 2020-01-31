# rd-training

### [GROK-251](https://jira.simpleviewtools.com/browse/GROK-251) GraphQL Training

The main ticket for the GraphQL Training is GROK-251.  This ticket is broken down
into sub-tasks.  The sections below are notes for each of those sub-tasks.
These notes are for my reference.


### [GROK-252](https://jira.simpleviewtools.com/browse/GROK-252) Connect your node app to your mongo container

URL's for testing functionality of insert, find and remove:
```
http://192.168.50.101/insert?title=Thor&date=2010-10-10
http://192.168.50.101/insert?title=HulkPassword01
&date=2010-10-10

http://192.168.50.101
http://192.168.50.101/find
http://192.168.50.101/find?title=Thor

http://192.168.50.101/remove?id=5dff811a4e1cfa00131ea67a
```


Using `async` and `await`:
```js
app.get('/find', async (req, res) => {
    const results = await movies.find({}).toArray();
    res.send(results);
});

app.listen(80, async () => {
    const url = 'mongodb://192.168.50.101:27017';
    const options = { useNewUrlParser: true, useUnifiedTopology: true };

    const client = await MongoClient.connect(url, options);
    if(!client) { return 'some error'; }

    db = client.db('entertainment');
    movies = db.collection('movies');

    console.log('listening on 80');
});
```
Using callbacks:
```js
MongoClient.connect(url, options, (err, client) => {
    if(err) return console.log(err);

    db = client.db('entertainment');
    movies = db.collection('movies');

    app.listen(80, () => {
        console.log('listening on 80');
    });

    app.get('/find', (req, res) => {
        movies.find({}).toArray((err, results) => {
            res.send(results);
        });
    });
});
```

### [GROK-253](https://jira.simpleviewtools.com/browse/GROK-253) Maintain your data and hot reload
```
sudo docker volume create mongodb-data
sudo docker volume ls
```
Using the `-v`, `--volume` option
```
sudo docker run -p 27017:27017 --name mdb-mongo --detach -v mongodb-data:/data/db mdb-mongo
```
Using the `--mount` option
```
sudo docker run -p 27017:27017 --name mdb-mongo --detach --mount source=mongodb-data,target=/data/db mdb-mongo

sudo docker run -p 80:80 --name mdb-node-www --detach --mount source=www-data,target=/app/lib mdb-node-www
```
```
sudo docker volume inspect mongodb-data
sudo docker container inspect mdb-mongo
```

PM2 Ecosystem File
[https://pm2.keymetrics.io/docs/usage/application-declaration/](https://pm2.keymetrics.io/docs/usage/application-declaration/)

Using a `ecosystem.config.js` file:
```
pm2 start ecosystem.config.js
```
Using a `ecosystem.yml` file
```
pm2 start echosystem.yml
```

**UPDATE:** Renamed `ecosystem.yml` to `pm2.yml` to follow Simpleview naming convention.


### [GROK-254](https://jira.simpleviewtools.com/browse/GROK-254) GraphQL Docker Container

After building and running:
```
http://192.168.50.101:4000/status
```

Graphql Playground
```
http://192.168.50.101:4000/
```


### [GROK-255](https://jira.simpleviewtools.com/browse/GROK-255) Connect Your GraphQL Container to your Mongo Container

What is a resolver?

Resolvers provide the instructions for turning a GraphQL operation (a query, mutation, or subscription) into data. They either return the same type of data we specify in our schema or a promise for that data.
[More info:](https://www.apollographql.com/docs/tutorial/resolvers/)

In graphql playground:
```
query {
  training {
    find(filter: {title: "Thor"}) {
      success
      message
      docs {
        id
        title
        date
      }
    }
  }
}

query {
  training {
    find(filter: {id: "5e0a554d2a082e0011136cc1"}) {
      success
      message
      docs {
        id
        title
        date
      }
    }
  }
}

query {
  training {
    find(filter: {date: "2020-01-10"}) {
      success
      message
      docs {
        id
        title
        date
      }
    }
  }
}

query {
  training {
    find {
      success
      message
      docs {
        id
        title
        date
      }
    }
  }
}

query($id: ID="", $title: String="Bad Boys", $date: String="") {
  training {
    find(filter: {id: $id, title: $title, date: $date}) {
      success
      message
      docs {
        id
        title
        date
      }
    }
  }
}


/* insert a record */
mutation {
  training {
    insert(input: {title: "Star Wars", date: "2020-01-20"}) {
      success
      message
    }
  }
}


/* remove by id */
mutation {
  training {
    remove(input: {id: "5e0a55422a082e0011136cbd"}) {
      success
      message
    }
  }
}
```


### [GROK-256](https://jira.simpleviewtools.com/browse/GROK-256) Connect Your Node Container to your GraphQL Container

Example of using variables in graphql queries:
```
query($id: ID="", $title: String="Bad Boys", $date: String="") {
  training {
    find(filter: {id: $id, title: $title, date: $date}) {
      success
      message
      docs {
        id
        title
        date
      }
    }
  }
}

mutation($id: ID="", $title: String="", $date: String="") {
  training {
    remove(input: { id: $id, title: $title, date: $date }) {
      success
      message
    }
  }
}
```


### [GROK-258](https://jira.simpleviewtools.com/browse/GROK-258) Unit Tests

In the `node` and `graphql` directories:
```
npm test
npm run lint
npm run style
```


### Miscelaneous Notes

```
# Fetch logs of a container
sudo docker logs -f mdb-node-www
sudo docker logs --follow mdb-node-www


# Get events from the docker server
sudo docker events


# Allow symlinks in VM / Vagrant with the rsync args
config.vm.synced_folder ".", "/sv", type: "rsync", rsync__args: ["--verbose", "--archive", "--delete", "-z"]


# Create a bash function to rebuild and run mongodb.
function rnr_mongo() {
    cd /sv/mongo;
    echo "--> cd /sv/mongo";

    sudo docker stop mdb-mongo;
    echo "--> sudo docker stop mdb-mongo";

    sudo docker rm mdb-mongo;
    echo "--> sudo docker rm mdb-mongo";

    sudo docker rmi -f mdb-mongo;
    echo "--> sudo docker rmi -f mdb-mongo";

    sudo docker build -t mdb-mongo .;
    echo "--> sudo docker build -t mdb-mongo .";

    sudo docker run --detach -p 27017:27017 -v /tmp/mongo-training:/data/db --name mdb-mongo mdb-mongo
    echo "--> sudo docker run --detach -p 27017:27017 -v /tmp/mongo-training:/data/db --name mdb-mongo mdb-mongo";
}
```


### How to set docker mongodb data volume

See this [stackoverflow question](https://stackoverflow.com/questions/35400740/how-to-set-docker-mongo-data-volume).
I would be willing to try using either `nfs` or `rsync` for the `synced_folder`
type (like above).  Also would like to try using the `--mount` option or use the
`docker volume create my-data`.  Using the `-v /tmp/mongo-training:/data/db` sets the mount `type: bind` whereas
`type: volume` would be preferred.  This can be seen when doing `sudo docker inspect my-container`.
However perhaps another time.


### Using the Mongo cli
```
$ mongo
> show dbs

> use entertainment
switched to db entertainment

> show collections

> db.movies.save({ title: 'Bart Simpson', date: new Date('2011-05-06') })
WriteResult({ "nInserted" : 1 })
> db.movies.save({ title: 'Thor', date: new Date('2011-05-06') })
WriteResult({ "nInserted" : 1 })
> db.movies.save({ title: 'Avengers', date: new Date('2012-05-04') })
WriteResult({ "nInserted" : 1 })
> db.movies.save({ title: 'Iron Man', date: new Date('2008-05-02') })
WriteResult({ "nInserted" : 1 })

> db.movies.find();
{ "_id" : ObjectId("5dfbfa6eb2593d5f42ab2d5d"), "title" : "Bart Simpson", "date" : ISODate("2011-05-06T00:00:00Z") }
{ "_id" : ObjectId("5dfbfa7ab2593d5f42ab2d5e"), "title" : "Thor", "date" : ISODate("2011-05-06T00:00:00Z") }
{ "_id" : ObjectId("5dfbfabbb2593d5f42ab2d5f"), "title" : "Avengers", "date" : ISODate("2012-05-04T00:00:00Z") }
{ "_id" : ObjectId("5dfbfae6b2593d5f42ab2d60"), "title" : "Iron Man", "date" : ISODate("2008-05-02T00:00:00Z") }

```
