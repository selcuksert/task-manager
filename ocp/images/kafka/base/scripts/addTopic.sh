#!/bin/bash

BROKER_HOST=$1
BROKER_PORT=$2
REPL_FACTOR=$3
PARTITIONS=$4
TOPIC_NAMES=$5

until nc -z -v $BROKER_HOST $BROKER_PORT
do
    echo 'Broker is NOT Alive'
        sleep 3
done

TOPIC_NAME_LIST=$(echo $TOPIC_NAMES | tr "," "\n")

for TOPIC_NAME in $TOPIC_NAME_LIST
do
  kafka-topics.sh --create --bootstrap-server $BROKER_HOST:$BROKER_PORT --replication-factor $REPL_FACTOR --partitions $PARTITIONS --topic $TOPIC_NAME
done
