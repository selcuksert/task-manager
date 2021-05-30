#!/bin/sh

docker compose -f $(dirname $0)/docker-compose.containerized.yml restart task-processor task-writer task-reader user-writer user-reader