# Mongo Movies

This is a playgound for MongoDB, Express, NodeJS and GraphQL which is all backend tech (as used here anyways).  I'm going to use Docker in which to run all these different components and most of this document will be how to get the Mongo Movies app up and running locally using Docker.  There's no fancy UI but you can hit URLs in the browser (or use curl) to show and modify data that's stored in the mongodb.


### The Stack, Tools & Notes

- [NodeJS](https://nodejs.org/en/)
- [MongoDB](https://www.mongodb.com/)
- [Express](https://expressjs.com/)
- [Apollo Server Express](https://www.apollographql.com/blog/backend/using-express-with-graphql-server-node-js/)
- [GraphQL](https://graphql.org/graphql-js/)
- [Node Version Manager](https://github.com/nvm-sh/nvm)
- [Notes on Node Module Versions](#notes-on-node-module-versions)
- [View Docker Logs](#view-docker-logs)
- [How To Communicate Between Docker Containers](#how-to-communicate-between-docker-containers)


The Mongo Movies application consists of three docker images.  See the individual `Dockerfile` in each of the subdirectories.

- [Build & Run Express Server](#build--run-express-server)
- [Build & Run MongoDB](#build--run-mongodb)
- [Build & Run GraphQL](#build--run-graphql)
- [Running Tests](#running-tests)


### Build & Run Express Server

Our Node Express server is going to make available different routes to find, insert and remove records from mongodb.  However, this server is not going to be connected to the mongodb directly instead it's going to make requests to an API graphql server that will handle the business logic and database manipulations.

In this section we'll create and test the container for the node / express server.

First let's build and run the node express server.
```bash
cd node

docker build -t mdb-node-www .

docker run -p 80:80 --name mdb-node-www --detach mdb-node-www
```

Now we make sure it's working using either curl or hit [http://0.0.0.0](http://0.0.0.0) in your browser.

```bash
curl -i 0.0.0.0

HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: text/html; charset=utf-8
Content-Length: 31
ETag: W/"1f-MhuaKSYorkByll6VOzZ5+hQ3M9g"
Date: Sat, 14 May 2022 17:20:31 GMT
Connection: keep-alive
Keep-Alive: timeout=5

Welcome to Mongo Movies! 🚀
```

This root route just returns the welcome message.  Other routes will make requests to the graphql server but won't work until that container is up and running.

Some useful Docker commands
```bash
docker exec -it mdb-node-www ls -l

docker exec -it mdb-node-www bash
```

Stop the running container, remove it and delete the image.
```bash
docker stop mdb-node-www
docker container rm mdb-node-www
docker rmi -f mdb-node-www
```

I have encapsulated the above Docker commands in bash functions found in [bash_aliases.sh](./bash_aliases.sh) in the root dir of the repo.  The function `rnr_node` will rebuild and run the node express server.  This is a primative function that will stop the running container, remove the container, remove the image, build the image and finally run it.  Obviously the first time you run this bash function there will be no running container to stop or remove so don't fret when you see complaints from docker.
```bash
source bash_aliases.sh

rnr_node
```
There's more fun / helpful stuff in that `bash_aliases.sh` file so I recommend checking it out.


### Build & Run MongoDB

Using the bash functions found in `bash_aliases.sh`, simply run
```bash
rnr_mongo
```

Check to make sure it's running
```bash
docker ps

NAMES           IMAGE             PORTS                            STATUS
mdb-mongo       mdb-mongo         0.0.0.0:27017->27017/tcp         Up 33 minutes
mdb-node-www    mdb-node-www      0.0.0.0:80->80/tcp               Up 4 hours
```

I changed the `docker ps` output by dropping an entry in `~/.docker/config.json`
```json
{
  "psFormat": "table {{.Names}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}"
}
```

Let's go into the running `mdb-mongo` container and make sure it' working.
```bash
docker exec -it mdb-mongo bash

root@fdad2e3f1a59:/app# mongo
> show dbs
> use entertainment
> show collections
> db.movies.save({title: 'Star Wars'})
> db.movies.find()
```
[mongo Shell Quick Reference](https://docs.mongodb.com/manual/reference/mongo-shell/#command-helpers)


### Build & Run GraphQL

This is our API server.  In more verbose terms (as javascript is), this is our Apollo Express GraphQL server.

Again, using the bash functions found in `bash_aliases.sh`, simply run
```bash
rnr_graphql
```

Check to make sure it's running
```bash
docker ps

NAMES           IMAGE             PORTS                            STATUS
mdb-mongo       mdb-mongo         0.0.0.0:27017->27017/tcp         Up 33 minutes
mdb-node-www    mdb-node-www      0.0.0.0:80->80/tcp               Up 4 hours
mdb-graphql     mdb-graphql       0.0.0.0:4000->4000/tcp           Up 41 minutes
```

Finally to test it out, we should be able to hit the `insert` route to add a movie tile and date.

```bash
curl -i "http://0.0.0.0/insert?title=Thor&date=2010-10-10"
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 56
ETag: W/"38-qhUI0AJvjLVifUniRc+GkjGwnp0"
Date: Sun, 15 May 2022 16:23:43 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"success":true,"message":"Movie 'Thor' has been added"}
```

Testing via the browser
```bash
http://0.0.0.0/insert?title=Thor&date=2010-10-10
http://0.0.0.0/insert?title=Hulk&date=2010-10-10

http://0.0.0.0/find
http://0.0.0.0/find?title=Thor

http://0.0.0.0/remove?id=6281290fc0d6bb0013c823db
```

So if this doesn't work then it's probably because of the networking / communication between the containers.  Using my container names, the `mdb-node-www` server needs the proper IP address of the `mdb-graphql` server.  Likewise the `mdb-graphql` server needs the proper IP address of the `mdb-mongo` server.

- Update the `API_URL` in  `node/lib/server.js` to be the IP address of the grapql server.
- Update the 'mongo_url' in `graphql/lib/server.js` to be the IP address of the mongodb server.

See [How To Communicate Between Docker Containers](#how-to-communicate-between-docker-containers) for instructions on getting the IP addresses.


### Running Tests

Run tests for the node express server application:

```bash
docker exec -it mdb-node-www bash

root@ac8e69aae94a:/app# cd /app
root@ac8e69aae94a:/app# npm run test

> node-www@1.1.0 test
> mocha lib/test/*test.js

  /app/lib/test/index_test.js
    validEmailAddress Function
      ✔ valid email address should return true
      ✔ valid email address with special chars should return true
      ✔ email address missing domain should return false
      ✔ email address undefined should return false
    emailValidation Function with valid params
      ✔ valid email should return true
      ✔ empty string for subject should return true
    emailValidation Function with invalid params
      ✔ throws error for email to is undefined
      ✔ throws error for email to is missing @ char
      ✔ throws error for email from is undefined
      ✔ throws error for email from missing domain extension
      ✔ throws error for email body is empty string
      ✔ throws error for email body is not a string
      ✔ throws error for email subject not a string

  /app/lib/test/mongo_connect_test.js
    Mongo client connection
      ✔ should connect to databasae

  /app/lib/test/server_test.js
    Express Server
      ✔ find movie by id
      ✔ find movie by title
      ✔ find movie by date
      ✔ find movie by id - not found
      ✔ find movie by title - not found
      ✔ find movie by date - not found
      ✔ insert movie with title and date
      ✔ remove movie by id - not found

  /app/lib/test/style_test.js
    Style Check
      ✔ should have complaint free style


  23 passing (94ms)
```

Run tests for the apollo express graphql application
```bash
docker exec -it mdb-graphql bash
root@3d4e6b81c3b3:/app/lib# cd ..
root@3d4e6b81c3b3:/app# npm run test

> graphql@1.1.0 test
> mocha lib/test/*.js

  /app/lib/test/server_test.js
    GraphQL container tests
      ✔ mutation insert movie (57ms)
      ✔ mutation insert movie fails with missing title
      ✔ mutation insert movie fails with bad date
      ✔ query for movie by id
      ✔ query for movies by title
      ✔ query for movies by date
      ✔ query for movies by title and date
      ✔ query for movie by id - not found
      ✔ query for movies by title - not found
      ✔ query for movies by date - not found
      ✔ mutation remove movie by id
      ✔ mutation remove movie by id - not found
      ✔ mutation remove movie by id - missing id
      ✔ mutation remove movie by id - invalid id
      ✔ mutation remove_all

  /app/lib/test/style_test.js
    Style Check
      ✔ should have complaint free style


  16 passing (267ms)
```


### Notes on Node Module Versions

Caret Ranges ^1.2.3 ^0.2.5 ^0.0.4
[https://github.com/npm/node-semver#caret-ranges-123-025-004](https://github.com/npm/node-semver#caret-ranges-123-025-004)

Allows changes that do not modify the left-most non-zero element in the [major, minor, patch] tuple. In other words, this allows patch and minor updates for versions 1.0.0 and above, patch updates for versions 0.X >=0.1.0, and no updates for versions 0.0.X.
```
    ^1.2.3 := >=1.2.3 <2.0.0-0
    ^0.2.3 := >=0.2.3 <0.3.0-0
    ^0.0.3 := >=0.0.3 <0.0.4-0
```

Tilde Ranges ~1.2.3 ~1.2 ~1
[https://github.com/npm/node-semver#versions](https://github.com/npm/node-semver#versions)

Allows patch-level changes if a minor version is specified on the comparator. Allows minor-level changes if not.
```
    ~1.2.3 := >=1.2.3 <1.(2+1).0 := >=1.2.3 <1.3.0-0
    ~1.2 := >=1.2.0 <1.(2+1).0 := >=1.2.0 <1.3.0-0 (Same as 1.2.x)
    ~1 := >=1.0.0 <(1+1).0.0 := >=1.0.0 <2.0.0-0 (Same as 1.x)
    ~0.2.3 := >=0.2.3 <0.(2+1).0 := >=0.2.3 <0.3.0-0
    ~0.2 := >=0.2.0 <0.(2+1).0 := >=0.2.0 <0.3.0-0 (Same as 0.2.x)
```


### View Docker Logs

```bash
# get events from docker server
docker events

# fetch logs of a running container
docker logs [running container id]
docker logs -f [running container id]
```


### How To Communicate Between Docker Containers

The simplest network in Docker is the bridge network. It's also Docker's default networking driver.

A bridge network gives you simple communication between containers on the same host.  In a bridge network, each container is assigned its own IP address so containers can communicate with each other by IP.

When Docker starts up, it will create a default network called `"bridge"`.  It should start automatically, without any configuration required by you.  From that point onwards, all containers are added into to the `"bridge network"`, unless you say otherwise.

Check that the `"bridge"` network is running:
```bash
docker network ls
NETWORK ID     NAME          DRIVER    SCOPE
9b6a90107938   bridge        bridge    local
c8188f7c9742   host          host      local
4e1e03ecf199   none          null      local
```

Start your containers as normal, with docker run.  When you start each container, Docker will add it to the bridge network.  If you prefer, you can be explicit about the network connection by adding `--net=bridge` to the docker run command.

Now one container can talk to another, by using its IP address.

You'll need to know the IP address of the container, to get this do
```bash
docker inspect mdb-mongo | grep IPAddress
            "IPAddress": "172.17.0.2",
```

Now for our Apollo Express GraphQL server, in the code we'll use that IP address so the server can connect to the container running MongoDB.
```javascript
const mongo_url = 'mongodb://172.17.0.2:27017';
const mongo_options = { useNewUrlParser: true, useUnifiedTopology: true };

const client = await MongoClient.connect(mongo_url, mongo_options);
```
