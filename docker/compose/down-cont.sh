#!/bin/sh

docker compose -f $(dirname $0)/docker-compose.containerized.yml down

docker volume remove ks-state db-data