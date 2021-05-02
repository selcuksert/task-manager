#!/bin/bash

ZOOKEEPER_HOST=$1
ZOOKEEPER_PORT=$2
KAFKA_BS_SERVERS=$3
SR_URL=$4
DB_HOST=$5
DB_PORT=$6
DB_TYPE=$7

cp $KAFKA_HOME/config/connect-standalone.properties $KAFKA_HOME/config/custom-connect-standalone.properties

sed "s/bootstrap.servers=localhost:9092/bootstrap.servers=$KAFKA_BS_SERVERS/g" -i $KAFKA_HOME/config/custom-connect-standalone.properties

sed "s/key.converter=org.apache.kafka.connect.json.JsonConverter/key.converter=$KEY_CONVERTER/g" \
-i $KAFKA_HOME/config/custom-connect-standalone.properties

export CONNECTION_URL="jdbc:$DB_TYPE:\\/\\/$DB_HOST:$DB_PORT\\/$DB_NAME"

sed "s/PK_FIELDS/$PK_FIELDS/g" -i $KAFKA_HOME/config/jdbc-sink-connector.properties
sed "s/TOPIC_NAMES/$TOPIC_NAMES/g" -i $KAFKA_HOME/config/jdbc-sink-connector.properties
sed "s/CONNECTION_URL/$CONNECTION_URL/g" -i $KAFKA_HOME/config/jdbc-sink-connector.properties
sed "s/CONNECTION_USER/$CONNECTION_USER/g" -i $KAFKA_HOME/config/jdbc-sink-connector.properties
sed "s/CONNECTION_PASSWORD/$CONNECTION_PASSWORD/g" -i $KAFKA_HOME/config/jdbc-sink-connector.properties

sed "s/value.converter=org.apache.kafka.connect.json.JsonConverter/value.converter=$VALUE_CONVERTER/g" \
-i $KAFKA_HOME/config/custom-connect-standalone.properties

if [[ $KEY_CONVERTER == *"Avro"* ]]; then
  echo "key.converter.schema.registry.url=$SR_URL" >> $KAFKA_HOME/config/custom-connect-standalone.properties
fi

if [[ $VALUE_CONVERTER == *"Avro"* ]]; then
  echo "value.converter.schema.registry.url=$SR_URL" >> $KAFKA_HOME/config/custom-connect-standalone.properties
fi

echo "allow.auto.create.topics=false" >> $KAFKA_HOME/config/custom-connect-standalone.properties
echo "plugin.path=${KAFKA_HOME}/plugins" >> $KAFKA_HOME/config/custom-connect-standalone.properties

until nc -z -v $ZOOKEEPER_HOST $ZOOKEEPER_PORT
do
    echo "$ZOOKEEPER_HOST:$ZOOKEEPER_PORT is NOT Alive"
	sleep 3
done

until nc -z -v $DB_HOST $DB_PORT
do
    echo "$DB_HOST:$DB_PORT is NOT Alive"
	sleep 3
done

connect-standalone.sh $KAFKA_HOME/config/custom-connect-standalone.properties $KAFKA_HOME/config/jdbc-sink-connector.properties