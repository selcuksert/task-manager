#!/bin/sh

docker compose -f $(dirname $0)/docker-compose.base.yml \
-f $(dirname $0)/docker-compose.containerized.yml up -d \
--build --remove-orphans \
--scale ksql=2 --scale task-processor=3