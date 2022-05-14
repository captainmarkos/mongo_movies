# Mongo Movies

This is my playgound for MongoDB, Express, NodeJS and GraphQL which is all backend tech but if were to add React then I suppose we would have a MERN stack.  Personal fun fact, I started out as a LAMP stack developer back in the 90's.  LAMP being Linux, Apache, MySQL and Perl/PHP.

I've been working with REST API's for many years and so wanted to see what all fuss is/was surround GraphQL.  So in this repo I built an app what I call `Mongo Movies`.  It's pretty much all backend.  There's no fancy GUI but you can hit URLs in the browser (or use curl) to show and modify data that's stored in the mongodb.


### The Stack & Tools

[MongoDB](https://www.mongodb.com/)
[Express](https://expressjs.com/)
[NodeJS](https://nodejs.org/en/)
[GraphQL](https://graphql.org/graphql-js/)

I suggest using [nvm](https://github.com/nvm-sh/nvm) for managing your node versions however it's not required for Mongo Movies.

The Mongo Movies application consists of three docker images.  See the individual `Dockerfile` in each of the subdirectories.

- [Build & Run Node / Express Server](#build-&-run-node-/-express-server)
- [Build & Run MongoDB](#build-&-run-mongodb)
- [Build & Run GraphQL](#build-&-run-graphql)


### Build & Run Node / Express Server

Since we're using [Docker](https://docs.docker.com/) I'll include tips and tricks that might help.

In this section we'll create and test the container for the node / express server.

First let's build and run the node express server.
```bash
cd node

docker build -t mdb-node-www .

docker run -p 80:80 --name mdb-node-www --detach mdb-node-www
```

Now we make sure it's working using either curl or hit [http://0.0.0.0/](http://0.0.0.0/) in your browser.

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

Some useful commands
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

The above docker commands are encapsulated in a bash function found in `bash_aliases.sh` (root dir of the repo).  The function `rnr_node` will rebuild and run the node express server.  This is a primative function that will, in this order, stop the running container, remove the container, remove the image, build the image and finally run it.  Obviously the first time you run this bash function there will be no running container to stop or remove so don't fret when you see complaints from docker, the image will be built and run.
```bash
source bash_aliases.sh

rnr_node
```
There's more fun / helpful stuff in that `bash_aliases.sh` file so I recommend checking it out.


### Debugging Tips

```bash
# get events from docker server
docker events

# fetch logs of a running container
docker logs [running container id]
docker logs -f [running container id]
```


### Build & Run MongoDB

Using the bash functions, simply run
```bash
rnr_mongo
```

Check to make sure it running
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
> use movies
> show collections
> db.characters.save({ name: 'Yoda' })
> db.characters.save({ name: 'Bart Simpson' })
> db.characters.find()
```
[mongo Shell Quick Reference](https://docs.mongodb.com/manual/reference/mongo-shell/#command-helpers)








### More Documentation

[README-docker.md](./README-docker.md)

[README-graphql.md](./README-graphql.md)

[README-kubernetes.md](./README-kubernetes.md)
