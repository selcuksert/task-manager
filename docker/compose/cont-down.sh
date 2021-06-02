#!/bin/sh

docker compose -f $(dirname $0)/docker-compose.base.yml -f $(dirname $0)/docker-compose.containerized.yml down

docker volume remove ks-state app-db-data