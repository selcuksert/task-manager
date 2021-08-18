#!/bin/sh

docker compose -f $(dirname $0)/docker-compose.base.yml -f $(dirname $0)/docker-compose.dev.yml up -d --build --remove-orphans