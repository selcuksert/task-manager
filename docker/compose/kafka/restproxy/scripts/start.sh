#!/bin/bash

ZOOKEEPER_HOST=$1
ZOOKEEPER_PORT=$2
KAFKA_BS_SERVERS=$3

sed "s/bootstrap.servers=PLAINTEXT:\/\/localhost:9092/bootstrap.servers=$KAFKA_BS_SERVERS/g" -i $APP_HOME/config/kafka-rest.properties

until nc -z -v $ZOOKEEPER_HOST $ZOOKEEPER_PORT
do
    echo "$ZOOKEEPER_HOST:$ZOOKEEPER_PORT is NOT Alive"
	sleep 3
done

sleep 100000

kafka-rest-start $APP_HOME/config/kafka-rest.properties