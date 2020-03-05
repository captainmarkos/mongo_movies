# rd-training

### [GROK-260](https://jira.simpleviewtools.com/browse/GROK-260) Setup SV Kubernetes

Fork the `simpleviewinc/sv-kubernetes` repo then clone the fork and setup a remote (if a remote is needed):
```
git clone git@github.com:captainmarkos/sv-kubernetes.git
cd sv-kubernetes/
git remote add sv git@github.com:simpleviewinc/sv-kubernetes.git
```

Check the remote(s) by doing:
```
git remote
git remote show origin
git remote show sv
cat .git/config
```

Install and start micro-services:
```
sudo sv install sv-graphql
sudo sv start sv-graphql local --build

sudo sv install sv-kube-proxy
sudo sv start sv-kube-proxy local --build

sudo sv install sv-kubernetes-example
sudo sv start sv-kubernetes-example local --build

sudo sv install rd-kubernetes-training --remote=captainmarkos
```

Commands for `kubectl`
```
sudo kubectl get pods

sudo kubectl get pods,services,containers

watch sudo kubectl get all
```

This url should now be accessable: https://sv-kubernetes-example.kube.simpleview.io/

### [GROK-261](https://jira.simpleviewtools.com/browse/GROK-261) Migrate your mongo container to kubernetes

Create deployment and services files:
```
chart/templates/mongo-deployment.yaml
chart/templates/mongo-services.yaml
```

Some helpful commands:
```
sudo sv start rd-kubernetes-training local --build

sudo sv stop rd-kubernetes-training

sudo helm status rd-kubernetes-training

sudo sv enterPod rd-kubernetes-training-mongo

sudo sv start rd-kubernetes-training local --build --dry-run --debug

sudo bash /sv/scripts/stop_minikube.sh
sudo bash /sv/scripts/start_minikube.sh
```
When entering the `rd-kubernetes-training-mongo` pod you should be able to enter the mongo shell.
Additionally hitting http://192.168.50.100:22000/ should display a message.


### [GROK-262](https://jira.simpleviewtools.com/browse/GROK-262) Migrate your graphql container to kubernetes

Debugging a pod that is not starting up:
```
vagrant: /sv> sudo kubectl get pods

NAME                                              READY   STATUS             RESTARTS   AGE
rd-kubernetes-training-graphql-7bbf76b889-w4llr   0/1     ImagePullBackOff   0          4m55s
```

```
sudo kubectl describe pod rd-kubernetes-training-graphql-7bbf76b889-w4llr

sudo sv logs --filter rd-kubernetes-training-graphql-v1 --watch
sudo sv logs --filter sv-graphql --watch

watch sudo kubectl get pods

sudo sv enterPod rd-kubernetes-training-graphql-v1
```


#### Nodes
A node is the smallest unit of computing hardware in Kubernetes. It is a representation of a single machine in your cluster. In most production systems, a node will likely be either a physical machine in a datacenter, or virtual machine hosted on a cloud provider like Google Cloud Platform.

#### Pods
A Pod is a group of one or more containers (such as Docker containers), with shared storage/network, and a specification for how to run the containers.

Kubernetes doesn't run containers directly; instead it wraps one or more containers into a higher-level structure called a pod. Any containers in the same pod will share the same resources and local network. Containers can easily communicate with other containers in the same pod as though they were on the same machine while maintaining a degree of isolation from others.

#### ReplicaSet
A ReplicaSet's purpose is to maintain a stable set of replica Pods running at any given time. As such, it is often used to guarantee the availability of a specified number of identical Pods.

#### Service
In Kubernetes, a Service is an abstraction which defines a logical set of Pods and a policy by which to access them (sometimes this pattern is called a micro-service).  The set of Pods targeted by a Service is usually determined by a selector.

A service is a grouping of pods that are running on the cluster. Services are "cheap" and you can have many services within the cluster. Kubernetes services can efficiently power a microservice architecture.

Services provide important features that are standardized across the cluster: load-balancing, service discovery between applications, and features to support zero-downtime application deployments.

#### Deployments
Although pods are the basic unit of computation in Kubernetes, they are not typically directly launched on a cluster. Instead, pods are usually managed by one more layer of abstraction: the deployment.

A deployment's primary purpose is to declare how many replicas of a pod should be running at a time. When a deployment is added to the cluster, it will automatically spin up the requested number of pods, and then monitor them. If a pod dies, the deployment will automatically re-create it.

Using a deployment, you don't have to deal with pods manually. You can just declare the desired state of the system, and it will be managed for you automatically.

#### Ingress
Ingress exposes HTTP and HTTPS routes from outside the cluster to services within the cluster. Traffic routing is controlled by rules defined on the Ingress resource.


#### References
[https://medium.com/google-cloud/kubernetes-101-pods-nodes-containers-and-clusters-c1509e409e16](https://medium.com/google-cloud/kubernetes-101-pods-nodes-containers-and-clusters-c1509e409e16)

[https://kubernetes.io/docs/concepts/workloads/pods/pod/](https://kubernetes.io/docs/concepts/workloads/pods/pod/)

[https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/](https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/)

[https://kubernetes.io/docs/concepts/services-networking/service/](https://kubernetes.io/docs/concepts/services-networking/service/)

[https://kubernetes.io/docs/concepts/services-networking/ingress/](https://kubernetes.io/docs/concepts/services-networking/ingress/)


### [GROK-263](https://jira.simpleviewtools.com/browse/GROK-263) Migrate your node container to kubernetes

After migriting the node express server code into `rd-kubernetes-training`, the below urls should work:

#### Insert
https://rd-kubernetes-training.kube.simpleview.io/insert?title=Thor&date=2010-10-10
https://rd-kubernetes-training.kube.simpleview.io/insert?title=Star%20Wars&date=2019-10-10

#### Find
https://rd-kubernetes-training.kube.simpleview.io/find
https://rd-kubernetes-training.kube.simpleview.io/find?title=Thor

#### Remove
https://rd-kubernetes-training.kube.simpleview.io/remove?id=5e3069f8d9c5df002158c31a


### [GROK-270](https://jira.simpleviewtools.com/browse/GROK-270) Add V2 of graphQL and implement

This ticket introduces a new version `rd-kubernetes-training-graphql-v2` which
makes changes to the graphql end-points for `insert` and `find` where a "director"
field has been added to a movie.

Graphql url for this new version:
https://graphql.kube.simpleview.io/link/training-v2/

New query and mutation:
```
# insert requires title, director and date
mutation {
  training {
    insert(input: {title: "Star Wars", director: "George Lucas", date: "2020-01-20"}) {
      success
      message
    }
  }
}

# find all
query {
  training {
    find {
      success
      message
      docs {
        id
        title
        director
        date
      }
    }
  }
}

# find by director
query($director: String="George Lucas") {
  training {
    find(filter: {director: $director}) {
      success
      message
      docs {
        id
        title
        director
        date
      }
    }
  }
}
```


### [GROK-271](https://jira.simpleviewtools.com/browse/GROK-271) Unit tests

To run the tests in the VM:
```
sudo sv test rd-kubernetes-training-graphql-v1

sudo sv test rd-kubernetes-training-graphql-v2
```
