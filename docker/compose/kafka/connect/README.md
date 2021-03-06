# Debezium Setup

```
curl -i -X POST -H "Accept:application/json" -H "Content-Type:application/json" localhost:8083/connectors -d '{
"name": "db-cdc-connector",
"config": {
"connector.class": "io.debezium.connector.mysql.MySqlConnector",
"tasks.max": "1",
"key.converter": "io.confluent.connect.avro.AvroConverter",
"value.converter": "io.confluent.connect.avro.AvroConverter",
"key.converter.schema.registry.url": "http://schemaregistry:8081",
"value.converter.schema.registry.url": "http://schemaregistry:8081",
"database.hostname": "dbhost",
"database.port": "3306",
"database.user": "dbuser",
"database.password": "db1234",
"database.server.id": "123456",
"database.server.name": "db",
"database.whitelist": "db",
"database.history.kafka.bootstrap.servers": "kafka-broker-1:9093, kafka-broker-2:9094",
"database.history.kafka.topic": "schema-changes" } 
}'
```

```
curl -i -X DELETE -H "Accept:application/json" -H "Content-Type:application/json" localhost:8083/connectors/db-cdc-connector
```

```
docker exec -it mysql mysql -uroot -pmroot
GRANT SELECT, RELOAD, SHOW DATABASES, REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'dbuser';
GRANT ALL PRIVILEGES ON db.* TO 'dbuser'@'%';
```

