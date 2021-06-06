# ksqlDB Sample Statements
This one documents sample ksql queries used in this project.

## Read from beginning:
Following ksql statement leads to read data from the beginning of the underlying Kafka topics:

```sh
ksql> SET 'auto.offset.reset' = 'earliest';
Successfully changed local property 'auto.offset.reset' to 'earliest'. Use the UNSET command to revert your change.
```

## Streams and Tables

### Generate Task Stream
Following ksql generates a stream on `tasks` topic:

```sql
CREATE STREAM task_stream (
    ROWKEY VARCHAR KEY,
    USERID VARCHAR,
    TITLE VARCHAR,
    DETAILS VARCHAR,
    STATUS VARCHAR,
    DUEDATE VARCHAR
)
WITH (
    KAFKA_TOPIC='tasks',
    VALUE_FORMAT='AVRO',
    PARTITIONS=3,
    REPLICAS=3 
);
```

```sh
ksql> DESCRIBE EXTENDED task_stream;

Name                 : TASK_STREAM
Type                 : STREAM
Timestamp field      : Not set - using <ROWTIME>
Key format           : KAFKA
Value format         : AVRO
Kafka topic          : tasks (partitions: 3, replication: 3)
Statement            : CREATE STREAM TASK_STREAM (ROWKEY STRING KEY, USERID STRING, TITLE STRING, DETAILS STRING, STATUS STRING, DUEDATE STRING) WITH (KAFKA_TOPIC='tasks', KEY_FORMAT='KAFKA', PARTITIONS=3, REPLICAS=3, VALUE_FORMAT='AVRO');

 Field   | Type                   
----------------------------------
 ROWKEY  | VARCHAR(STRING)  (key) 
 USERID  | VARCHAR(STRING)        
 TITLE   | VARCHAR(STRING)        
 DETAILS | VARCHAR(STRING)        
 STATUS  | VARCHAR(STRING)        
 DUEDATE | VARCHAR(STRING)        
----------------------------------
```

### Generate Assigned Tasks Stream
Following ksql generates a derived stream (CSAS) on `tasks` topic to capture assigned tasks that writes results back to another Kafka topic to survive values after ksql server restarts:

```sql
CREATE STREAM assigned_tasks_stream
WITH (
    KAFKA_TOPIC = 'assigned_tasks',
    VALUE_FORMAT = 'AVRO',
    PARTITIONS = 3,
    REPLICAS = 3
) 
AS SELECT ROWKEY AS ID,
       USERID,
       TITLE,
       DETAILS,
       DUEDATE
FROM task_stream
WHERE STATUS = 'ASSIGNED' EMIT CHANGES;
```

```sh
ksql> DESCRIBE EXTENDED ASSIGNED_TASKS_STREAM;

Name                 : ASSIGNED_TASKS_STREAM
Type                 : STREAM
Timestamp field      : Not set - using <ROWTIME>
Key format           : KAFKA
Value format         : AVRO
Kafka topic          : assigned_tasks (partitions: 3, replication: 3)
Statement            : CREATE STREAM ASSIGNED_TASKS_STREAM WITH (KAFKA_TOPIC='assigned_tasks', PARTITIONS=3, REPLICAS=3, VALUE_FORMAT='AVRO') AS SELECT
  TASK_STREAM.ROWKEY ID,
  TASK_STREAM.USERID USERID,
  TASK_STREAM.TITLE TITLE,
  TASK_STREAM.DETAILS DETAILS,
  TASK_STREAM.DUEDATE DUEDATE
FROM TASK_STREAM TASK_STREAM
WHERE (TASK_STREAM.STATUS = 'ASSIGNED')
EMIT CHANGES;

 Field   | Type                   
----------------------------------
 ID      | VARCHAR(STRING)  (key) 
 USERID  | VARCHAR(STRING)        
 TITLE   | VARCHAR(STRING)        
 DETAILS | VARCHAR(STRING)        
 DUEDATE | VARCHAR(STRING)        
----------------------------------

Queries that write from this STREAM
-----------------------------------
CSAS_ASSIGNED_TASKS_STREAM_13 (RUNNING) : CREATE STREAM ASSIGNED_TASKS_STREAM WITH (KAFKA_TOPIC='assigned_tasks', PARTITIONS=3, REPLICAS=3, VALUE_FORMAT='AVRO') AS SELECT   TASK_STREAM.ROWKEY ID,   TASK_STREAM.USERID USERID,   TASK_STREAM.TITLE TITLE,   TASK_STREAM.DETAILS DETAILS,   TASK_STREAM.DUEDATE DUEDATE FROM TASK_STREAM TASK_STREAM WHERE (TASK_STREAM.STATUS = 'ASSIGNED') EMIT CHANGES;

For query topology and execution plan please run: EXPLAIN <QueryId>

Local runtime statistics
------------------------


(Statistics of the local KSQL server interaction with the Kafka topic assigned_tasks)

Consumer Groups summary:

Consumer Group       : _confluent-ksql-default_query_CSAS_ASSIGNED_TASKS_STREAM_13
<no offsets committed by this group yet>
```


### Generate Task Table
Following ksql generates a table on `tasks` topic to store latest value for given key:

```sql
CREATE TABLE task_table
(
    ID      VARCHAR PRIMARY KEY,
    USERID  VARCHAR,
    TITLE   VARCHAR,
    DETAILS VARCHAR,
    STATUS  VARCHAR,
    DUEDATE VARCHAR
)
WITH (
    KAFKA_TOPIC = 'tasks',
    VALUE_FORMAT = 'AVRO'
);
```

```sh
ksql> DESCRIBE EXTENDED TASK_TABLE;

Name                 : TASK_TABLE
Type                 : TABLE
Timestamp field      : Not set - using <ROWTIME>
Key format           : KAFKA
Value format         : AVRO
Kafka topic          : tasks (partitions: 3, replication: 3)
Statement            : CREATE TABLE TASK_TABLE (ID STRING PRIMARY KEY, USERID STRING, TITLE STRING, DETAILS STRING, STATUS STRING, DUEDATE STRING) WITH (KAFKA_TOPIC='tasks', KEY_FORMAT='KAFKA', VALUE_FORMAT='AVRO');

 Field   | Type                           
------------------------------------------
 ID      | VARCHAR(STRING)  (primary key) 
 USERID  | VARCHAR(STRING)                
 TITLE   | VARCHAR(STRING)                
 DETAILS | VARCHAR(STRING)                
 STATUS  | VARCHAR(STRING)                
 DUEDATE | VARCHAR(STRING)                
------------------------------------------

Local runtime statistics
------------------------


(Statistics of the local KSQL server interaction with the Kafka topic tasks)
```

## Queries

### Task Count per User
Following query emits task count per user (tables store latest value):

```sh
ksql> SELECT USERID, COUNT(*) AS task_count
>FROM task_table
>GROUP BY USERID EMIT CHANGES;

+----------------------------------------------------------------------------------------------------------+----------------------------------------------------------------------------------------------------------+
|USERID                                                                                                    |TASK_COUNT                                                                                                |
+----------------------------------------------------------------------------------------------------------+----------------------------------------------------------------------------------------------------------+
|jsmith                                                                                                    |1                                                                                                         |
|sdone                                                                                                     |1                                                                                                         |
|jsmith                                                                                                    |4                                                                                                         |
|sdone                                                                                                     |2                                                                                                         |
|jsmith                                                                                                    |5                                                                                                         |

>CTRL+C
Query terminated
```

### Task Status Change Count per User
Following query emits task status change count per user as streams logs every update:

```sh
ksql> SELECT USERID, COUNT(*) AS task_count
>FROM task_stream
>GROUP BY USERID EMIT CHANGES;

+----------------------------------------------------------------------------------------------------------+----------------------------------------------------------------------------------------------------------+
|USERID                                                                                                    |TASK_COUNT                                                                                                |
+----------------------------------------------------------------------------------------------------------+----------------------------------------------------------------------------------------------------------+
|sdone                                                                                                     |8                                                                                                         |
|jsmith                                                                                                    |9                                                                                                         |
|sdone                                                                                                     |9                                                                                                         |
|jsmith                                                                                                    |10                                                                                                        |

>CTRL+C
Query terminated
```