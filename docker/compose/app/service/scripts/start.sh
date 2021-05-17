#!/bin/bash

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
