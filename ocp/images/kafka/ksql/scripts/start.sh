#!/bin/bash

ZOOKEEPER_HOST=$1
ZOOKEEPER_PORT=$2
KAFKA_BS_SERVERS=$3
SR_HOST=$4
SR_PORT=$5


cp $KSQL_HOME/config/ksql-server.properties $KSQL_HOME/config/ksql-server-updated.properties

sed "s/bootstrap.servers=localhost:9092/bootstrap.servers=$KAFKA_BS_SERVERS/g" -i $KSQL_HOME/config/ksql-server-updated.properties
sed "s/# ksql.schema.registry.url=http:\/\/localhost:8081/ksql.schema.registry.url=http:\/\/$SR_HOST:$SR_PORT/g" -i $KSQL_HOME/config/ksql-server-updated.properties
echo -e "\nksql.connect.url=${KAFKA_CONNECT_PROT}://${KAFKA_CONNECT_HOST}:${KAFKA_CONNECT_PORT}" >> $KSQL_HOME/config/ksql-server-updated.properties
echo -e "\nksql.service.id=task_manager_app_" >> $KSQL_HOME/config/ksql-server-updated.properties
sed "s/# advertised.listener=?/advertised.listener=http:\/\/$HOSTNAME:8088/g" -i $KSQL_HOME/config/ksql-server-updated.properties

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

until nc -z -v $KAFKA_CONNECT_HOST $KAFKA_CONNECT_PORT
do
    echo "$KAFKA_CONNECT_HOST:$KAFKA_CONNECT_PORT is NOT Alive"
	sleep 3
done

ksql-server-start $KSQL_HOME/config/ksql-server-updated.properties
