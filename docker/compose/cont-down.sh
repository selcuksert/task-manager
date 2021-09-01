#!/bin/sh

. $(dirname $0)/functions.sh

docker compose -f $(dirname $0)/docker-compose.base.yml -f $(dirname $0)/docker-compose.containerized.yml down

deleteVolume app-db-data
deleteVolume kafka-data
deleteVolume zk-data

deleteFolder $(dirname $0)/app/service/ks-state