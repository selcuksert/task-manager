#!/bin/sh

docker compose -f $(dirname $0)/docker-compose.dev.yml down

docker volume remove db-data