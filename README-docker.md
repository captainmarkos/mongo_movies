# rd-training

### [GROK-246](https://jira.simpleviewtools.com/browse/GROK-246) Docker Training

The main ticket for the Docker Training is GROK-246.  This ticket is broken down
into sub-tasks.  The sections below are notes for each of those sub-tasks.
These notes are for my reference.


### Installation Instructions for MacOS

1. Fork this repo [Example](https://www.screencast.com/t/AANgKB2RXYG)

2. Clone the forked repo [Example](https://www.screencast.com/t/cKiszpb54eZn)

3. Setup remote tracking (likely won't be merged into the `sv` remote but for reference):
```
cd rd-training/
git remote add sv https://github.com/simpleviewinc/rd-training.git
```
4. Looking at the remotes: [Example](https://www.screencast.com/t/2BDr4aDye)
```
git remote
origin
sv
```
5. Start up and enter the virtual machine:
```
vagrant box add bento/ubuntu-18.04  (if necessary)

vagrant up
vagrant ssh
```
6. When prompted for the password enter `vagrant` and hit return.

7. Install needed packages:
```
sudo apt-get update
sudo apt-get install -y emacs
```
Install packages to allow `apt` to use repos over HTTPS
```
sudo apt-get install apt-transport-https ca-certificates curl gnupg-agent software-properties-common

```
Add Docker's GPG key
```
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```
Setup the stable repository
```
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
```
Update the `apt` package index, install Docker and verify
```
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io

sudo docker run hello-world
```



### Development Workflow

The development workflow looks like this:

1) Create and test individual containers for each component of your
   application by `first creating Docker images`.

2) Assemble your containers and supporting infrastructure into a complete
   application, expressed either as a `Docker stack file` or in `Kubernetes YAML`.

3) Test, share and deploy your complete containerized application.


### [GROK-248](https://jira.simpleviewtools.com/browse/GROK-248) Docker Node Express App

Notice the `build` and `run` commands are duplicated below, they work the same.
```
sudo docker image build -t mdb-node-www .
sudo docker build -t mdb-node-www .

sudo docker container run --publish 80:80 --name mdb-node-www --detach mdb-node-www
sudo docker run --publish 80:80 --name mdb-node-www --detach mdb-node-www
sudo docker run -p 80:80 --name mdb-node-www -d mdb-node-www

sudo docker exec -it mdb-node-www ls -l

sudo docker container rm d964d8d8305d

sudo docker rmi -f mdb-node-www

curl -i 0.0.0.0
curl -i localhost

HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: text/html; charset=utf-8
Content-Length: 19
ETag: W/"13-3BMqXs/Hp/WClRgFjcyGy8NVFKw"
Date: Sun, 15 Dec 2019 02:07:45 GMT
Connection: keep-alive

~~ Hello world ~~ 
```


### [GROK-249](https://jira.simpleviewtools.com/browse/GROK-249) Docker Mongo

```
sudo docker image build -t mdb-mongo .
sudo docker run --publish 27017:27017 --name mdb-mongo --detach mdb-mongo

sudo docker exec -it mdb-mongo bash

root@5c15e42d1c84:/app# mongo
> show dbs
> use movies
> show collections
> db.characters.save({ name: 'Yoda' })
> db.characters.save({ name: 'Bart Simpson' })
> db.characters.find()
```
[mongo Shell Quick Reference](https://docs.mongodb.com/manual/reference/mongo-shell/#command-helpers)


### Docker image fails to start - Debugging

Get events from the docker server:
```
sudo docker events
```
Fetch the logs of a container:
```
sudo docker logs <running container id>
sudo docker logs -f <running container id>
```


### ~/.docker/config.json
```
{
  "psFormat": "table {{.Names}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}"
}
```


### [GROK-250](https://jira.simpleviewtools.com/browse/GROK-250) Unit Testing with mocha
```
cd node

npm install --save-dev mocha
npm install --save-dev @simpleview/mochalib

mocha --recursive --reporter dot lib/test/*test.js
```
