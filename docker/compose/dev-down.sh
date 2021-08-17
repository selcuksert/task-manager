#!/bin/sh

. $(dirname $0)/functions.sh

docker compose -f $(dirname $0)/docker-compose.base.yml -f $(dirname $0)/docker-compose.dev.yml down

deleteVolume ks-state
deleteVolume app-db-data
deleteVolume kafka-data
deleteVolume zk-data

deleteFolder /tmp/ks-state