#!/bin/bash

ZOOKEEPER_HOST=$1
ZOOKEEPER_PORT=$2
SR_HOST=$3
SR_PORT=$4
KAFKA_BS_SERVERS=$5

cp $APP_HOME/config/kafka-rest.properties $APP_HOME/config/kafka-rest-custom.properties

sed "s/bootstrap.servers=PLAINTEXT:\/\/localhost:9092/bootstrap.servers=$KAFKA_BS_SERVERS/g" -i $APP_HOME/config/kafka-rest-custom.properties
sed "s/#schema.registry.url=http:\/\/localhost:8081/schema.registry.url=http:\/\/$SR_HOST:$SR_PORT/g" -i $APP_HOME/config/kafka-rest-custom.properties

until nc -z -v $ZOOKEEPER_HOST $ZOOKEEPER_PORT
do
    echo "$ZOOKEEPER_HOST:$ZOOKEEPER_PORT is NOT Alive"
	sleep 3
done

until nc -z -v $SR_HOST $SR_PORT
do
    echo "$SR_HOST:$SR_PORT is NOT Alive"
	sleep 3
done



kafka-rest-start $APP_HOME/config/kafka-rest-custom.properties