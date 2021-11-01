#!/bin/bash

BROKER_HOST=$1
BROKER_PORT=$2
REPL_FACTOR=$3
PARTITIONS=$4
TOPIC_NAME=$5

until nc -z -v $BROKER_HOST $BROKER_PORT
do
    echo 'Broker is NOT Alive'
	sleep 3
done

kafka-topics.sh --create --bootstrap-server $BROKER_HOST:$BROKER_PORT --replication-factor $REPL_FACTOR --partitions $PARTITIONS --config cleanup.policy=compact --topic $TOPIC_NAME