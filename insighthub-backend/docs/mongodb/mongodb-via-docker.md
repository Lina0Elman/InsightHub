# MongoDB Via Docker

In case you want to run a local [mongodb](https://www.mongodb.com/) server, while developing,
there is an option to spin up a mongodb server via a [docker](https://www.docker.com/) container.

It may be more convenient for you to do so instead of manually installing a mongodb
server on your local machine, but this issue is entirely up to personal taste.

> In case you are not familiar with docker, you can get started with docker [here](https://docs.docker.com/get-started/)
## Prerequsites

To run mongodb via a docker container, first you must install [docker](https://www.docker.com/) on your machine.

## `docker-compose`

`docker-compose` is a command in docker, that boots up multiple docker images as a "network".
So you could boot up this network at once, and shut it down at once - and all the containers will boot up or shut down at once.

Also, within a network, you can refer one container to another, to depend on each other, or share environment variables together.

To use the `docker-compose` command you require a `docker-compose.yaml` file, for it to read the network configuration you want it to establish.

We have pre-made a [`docker-compose.yaml`](/insighthub-backend/docker-compose.yaml) file for you to use,
that spins up local [mongodb](https://hub.docker.com/_/mongo) (DB) and [mongo-express](https://hub.docker.com/_/mongo-express) (UI) containers via docker.

## Usage

### Update Your [`.env`](/insighthub-backend/.env) File For [`docker-compose.yaml`](/insighthub-backend/docker-compose.yaml)

Before using [`docker-compose.yaml`](/insighthub-backend/docker-compose.yaml), you need to navigate to your [`.env`](/insighthub-backend/.env) file,
and update it by adding the following properties:

```
# DB (mongodb)
DB_USER=rootuser
DB_PASSWORD=rootpass
DB_DOCKER_PORT=27017
DB_LOCAL_PORT=27016
DB_HOST=localhost
DB_NAME=app
MONGO_DOCKER_URI=mongodb://${DB_USER}:${DB_PASSWORD}@mongodb:${DB_DOCKER_PORT}/${DB_NAME}?authSource=admin
MONGO_URI=mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_LOCAL_PORT}/${DB_NAME}?authSource=admin
DB_CONNECTION=${MONGO_URI}

# DB UI (mongoexpress)
DB_UI_DOCKER_PORT=8081
DB_UI_LOCAL_PORT=8061
```

### Run `docker-compose`

- Run the network with:

    ```
    docker-compose up -d
    ```
  Then you would have:
    - mongodb listening on port `27016` so you could access the db with the connection string of 
      `mongodb://rootuser:rootpass@localhost:27016/app?authSource=admin`
    - mongo-express opening at http://localhost:8061
- Stop the network with:
    ```
    docker-compose down
    ```
### OPTIONAL: Run Raw Queries From `mongosh`
You may run raw queries for mongodb, via the `mongosh` of the `mongodb` container.
Once you `docker-compose up -d` this [`docker-compose.yaml`](/insighthub-backend/docker-compose.yaml) file,
and the `mongodb` container is running, then execute the following commands:
View all the running containers:
```
docker ps
```
Copy the `mongodb` container name, and then, enter the `mongodb` container `/bin/bash`:
```
docker exec -it <mongodb-container-name> /bin/bash
```
And then, enter the `mongosh` app with the authentication of the `$MONGO_DB_CONNECTION_STRING` connection string:
```
mongosh $MONGO_DB_CONNECTION_STRING
```
This will lead you to the `mongosh` app within the `mongodb` container, with the correct authentication.
And there you can execute raw queries in the database.
For example, you can test the connection, by executing:
```
show dbs
```
And this will list all the databases in the server.