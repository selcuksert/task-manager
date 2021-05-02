#!/bin/bash

if [[ $# -ne 5 ]]; then
    echo "Illegal number of parameters"
    exit 2
fi
ZOOKEEPER_HOST=$1
ZOOKEEPER_PORT=$2
BROKER_ID=$3
NODE_HOST=$4
NODE_PORT=$5

cat ${KAFKA_HOME}/config/server.properties | \
awk -v BROKER_ID=$BROKER_ID '{sub(/broker.id=0/,"broker.id="BROKER_ID)}1' | \
awk -v NODE_HOST=$NODE_HOST -v NODE_PORT=$NODE_PORT '{sub(/#listeners=PLAINTEXT:\/\/:9092/,"listeners=INTERNAL:\/\/:"NODE_PORT",EXTERNAL:\/\/:1"NODE_PORT)}1' | \
awk -v NODE_HOST=$NODE_HOST -v NODE_PORT=$NODE_PORT '{sub(/#advertised.listeners=PLAINTEXT:\/\/your.host.name:9092/,"advertised.listeners=INTERNAL:\/\/:"NODE_PORT",EXTERNAL:\/\/localhost:1"NODE_PORT)}1' | \
awk -v BROKER_ID=$BROKER_ID '{sub(/log.dirs=\/tmp\/kafka-logs/,"log.dirs=\/tmp\/kafka-logs-"BROKER_ID)}1' | \
awk -v ZOOKEEPER_HOST=$ZOOKEEPER_HOST -v ZOOKEEPER_PORT=$ZOOKEEPER_PORT '{sub(/zookeeper.connect=localhost:2181/,"zookeeper.connect="ZOOKEEPER_HOST":"ZOOKEEPER_PORT)}1' > ${KAFKA_HOME}/config/server-${BROKER_ID}.properties

echo "listener.security.protocol.map=PLAINTEXT:PLAINTEXT,INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT" >> ${KAFKA_HOME}/config/server-${BROKER_ID}.properties
echo "inter.broker.listener.name=INTERNAL" >> ${KAFKA_HOME}/config/server-${BROKER_ID}.properties
echo "auto.create.topics.enable=true" >> ${KAFKA_HOME}/config/server-${BROKER_ID}.properties

until nc -z -v $ZOOKEEPER_HOST $ZOOKEEPER_PORT
do
    echo 'zookeeper is NOT Alive'
	sleep 3
done

KAFKA_OPTS=-javaagent:${KAFKA_ROOT}/jmx_exporter/jmx_prometheus_javaagent.jar=${PROM_AGENT_PORT}:/${KAFKA_ROOT}/jmx_exporter/kafka-config.yml kafka-server-start.sh ${KAFKA_HOME}/config/server-${BROKER_ID}.properties