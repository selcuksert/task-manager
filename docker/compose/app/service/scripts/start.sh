#!/bin/bash

# get the container IP
IP=$(ifconfig eth0 | grep 'inet ' | awk '{print $2}')

# extract the replica number from the same PTR entry
INDEX=`dig -x $IP +short | sed 's/.*_\([0-9]*\)\..*/\1/'`

# get the service name specified in the docker-compose.yml
# by a reverse DNS lookup on the IP and append INDEX
export CONTAINER_NAME=$(dig -x "${IP}" +short | cut -d'_' -f2)-${INDEX}

IFS=','
for val in $DEPS; do
  IFS=':'
  DEP_TOKEN=($val)
  HOST=$(echo ${DEP_TOKEN[0]} | xargs)
  PORT=$(echo ${DEP_TOKEN[1]} | xargs)

  until nc -z -v $HOST $PORT; do
    echo "$HOST:$PORT is NOT Alive"
    sleep 3
  done
done

java -jar $APP_BIN