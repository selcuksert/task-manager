#!/bin/bash

ZOOKEEPER_HOST=$1
ZOOKEEPER_PORT=$2
KAFKA_SCHEMA_TOPIC=$3
KAFKA_BS_SERVERS=$4

sed "s/kafkastore.connection.url=localhost:2181/kafkastore.connection.url=$ZOOKEEPER_HOST:$ZOOKEEPER_PORT/g" $SR_HOME/config/schema-registry.properties > $SR_HOME/config/schema-registry-updated.properties

sed "s/kafkastore.topic=_schemas/kafkastore.topic=$KAFKA_SCHEMA_TOPIC/g" -i $SR_HOME/config/schema-registry-updated.properties

sed "s/kafkastore.bootstrap.servers=PLAINTEXT:\/\/localhost:9092/kafkastore.bootstrap.servers=$KAFKA_BS_SERVERS/g" -i $SR_HOME/config/schema-registry-updated.properties

cat $SR_HOME/config/schema-registry-updated.properties

until nc -z -v $ZOOKEEPER_HOST $ZOOKEEPER_PORT
do
    echo "$ZOOKEEPER_HOST:$ZOOKEEPER_PORT is NOT Alive"
	sleep 3
done

schema-registry-start $SR_HOME/config/schema-registry-updated.properties