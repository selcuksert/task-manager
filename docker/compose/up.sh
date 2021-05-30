#!/bin/sh

docker compose -f $(dirname $0)/docker-compose.dev.yml up --build --remove-orphans