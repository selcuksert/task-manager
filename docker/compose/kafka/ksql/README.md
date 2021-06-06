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

### Generate User Table
Following ksql generates a table on `users` topic:

```sql
CREATE TABLE user_table (
    ID VARCHAR PRIMARY KEY,
    FIRSTNAME VARCHAR,
    LASTNAME VARCHAR
)
WITH (
    KAFKA_TOPIC='users',
    VALUE_FORMAT='AVRO',
    PARTITIONS=3,
    REPLICAS=3 
);
```

```sh
ksql> DESCRIBE EXTENDED USER_TABLE;

Name                 : USER_TABLE
Type                 : TABLE
Timestamp field      : Not set - using <ROWTIME>
Key format           : KAFKA
Value format         : AVRO
Kafka topic          : users (partitions: 3, replication: 3)
Statement            : CREATE TABLE USER_TABLE (ID STRING PRIMARY KEY, FIRSTNAME STRING, LASTNAME STRING) WITH (KAFKA_TOPIC='users', KEY_FORMAT='KAFKA', PARTITIONS=3, REPLICAS=3, VALUE_FORMAT='AVRO');

 Field     | Type                           
--------------------------------------------
 ID        | VARCHAR(STRING)  (primary key) 
 FIRSTNAME | VARCHAR(STRING)                
 LASTNAME  | VARCHAR(STRING)                
--------------------------------------------

Local runtime statistics
------------------------


(Statistics of the local KSQL server interaction with the Kafka topic users)
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

Following query emits task count per user and status (grouped):

```sh
ksql> SELECT USERID, STATUS, COUNT(*) AS task_count
>FROM task_table
>GROUP BY USERID, STATUS
>EMIT CHANGES;

+----------------------------------------------------------------------+----------------------------------------------------------------------+----------------------------------------------------------------------+
|USERID                                                                |STATUS                                                                |TASK_COUNT                                                            |
+----------------------------------------------------------------------+----------------------------------------------------------------------+----------------------------------------------------------------------+
|sdone                                                                 |ASSIGNED                                                              |2                                                                     |
|sdone                                                                 |STARTED                                                               |1                                                                     |
|jsmith                                                                |ASSIGNED                                                              |4                                                                     |
|jsmith                                                                |STARTED                                                               |2                                                                     |
|jsmith                                                                |ASSIGNED                                                              |3                                                                     |
|jsmith                                                                |STARTED                                                               |3                                                                     |
|jsmith                                                                |ASSIGNED                                                              |2                                                                     |
|jsmith                                                                |COMPLETED                                                             |1                                                                     |
|jsmith                                                                |PENDING                                                               |1                                                                     |
|jsmith                                                                |STARTED                                                               |2                                                                     |
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

### Task Status Change Count within 2 hour windows per User

```sql
CREATE TABLE task_count_table
    WITH (
        KAFKA_TOPIC = 'task_count_topic',
        VALUE_FORMAT = 'AVRO',
        PARTITIONS = 3
        ) AS
SELECT
    ts.userid,
    LATEST_BY_OFFSET(ut.firstname) AS firstname,
    LATEST_BY_OFFSET(ut.lastname) AS lastname,
    COUNT(*) AS assigned_tasks_count
FROM assigned_tasks_stream ts
         LEFT JOIN user_table ut
                   ON ts.userid = ut.id
    WINDOW TUMBLING (
    SIZE 2 HOURS,
    RETENTION 1 DAY,
    GRACE PERIOD 10 MINUTES
)
GROUP BY ts.userid
EMIT CHANGES;
```

```sh
ksql> DESCRIBE EXTENDED TASK_COUNT_TABLE;

Name                 : TASK_COUNT_TABLE
Type                 : TABLE
Timestamp field      : Not set - using <ROWTIME>
Key format           : KAFKA
Value format         : AVRO
Kafka topic          : task_count_topic (partitions: 3, replication: 3)
Statement            : CREATE TABLE TASK_COUNT_TABLE WITH (KAFKA_TOPIC='task_count_topic', PARTITIONS=3, REPLICAS=3, VALUE_FORMAT='AVRO') AS SELECT
  TS.USERID USERID,
  LATEST_BY_OFFSET(UT.FIRSTNAME) FIRSTNAME,
  LATEST_BY_OFFSET(UT.LASTNAME) LASTNAME,
  COUNT(*) ASSIGNED_TASKS_COUNT
FROM ASSIGNED_TASKS_STREAM TS
LEFT OUTER JOIN USER_TABLE UT ON ((TS.USERID = UT.ID))
WINDOW TUMBLING ( SIZE 2 HOURS , RETENTION 1 DAYS , GRACE PERIOD 10 MINUTES ) 
GROUP BY TS.USERID
EMIT CHANGES;

 Field                | Type                                                   
-------------------------------------------------------------------------------
 USERID               | VARCHAR(STRING)  (primary key) (Window type: TUMBLING) 
 FIRSTNAME            | VARCHAR(STRING)                                        
 LASTNAME             | VARCHAR(STRING)                                        
 ASSIGNED_TASKS_COUNT | BIGINT                                                 
-------------------------------------------------------------------------------

Queries that write from this TABLE
-----------------------------------
CTAS_TASK_COUNT_TABLE_35 (RUNNING) : CREATE TABLE TASK_COUNT_TABLE WITH (KAFKA_TOPIC='task_count_topic', PARTITIONS=3, REPLICAS=3, VALUE_FORMAT='AVRO') AS SELECT   TS.USERID USERID,   LATEST_BY_OFFSET(UT.FIRSTNAME) FIRSTNAME,   LATEST_BY_OFFSET(UT.LASTNAME) LASTNAME,   COUNT(*) ASSIGNED_TASKS_COUNT FROM ASSIGNED_TASKS_STREAM TS LEFT OUTER JOIN USER_TABLE UT ON ((TS.USERID = UT.ID)) WINDOW TUMBLING ( SIZE 2 HOURS , RETENTION 1 DAYS , GRACE PERIOD 10 MINUTES )  GROUP BY TS.USERID EMIT CHANGES;

For query topology and execution plan please run: EXPLAIN <QueryId>

Local runtime statistics
------------------------
messages-per-sec:      0.03   total-messages:         3     last-message: 2021-06-06T18:08:08.412Z

(Statistics of the local KSQL server interaction with the Kafka topic task_count_topic)

Consumer Groups summary:

Consumer Group       : _confluent-ksql-default_query_CTAS_TASK_COUNT_TABLE_35

Kafka topic          : _confluent-ksql-default_query_CTAS_TASK_COUNT_TABLE_35-Join-repartition
Max lag              : 0

 Partition | Start Offset | End Offset | Offset | Lag 
------------------------------------------------------
 0         | 0            | 0          | 0      | 0   
 1         | 16           | 16         | 16     | 0   
 2         | 0            | 0          | 0      | 0   
------------------------------------------------------

Kafka topic          : assigned_tasks
Max lag              : 0

 Partition | Start Offset | End Offset | Offset | Lag 
------------------------------------------------------
 0         | 0            | 4          | 4      | 0   
 1         | 0            | 4          | 4      | 0   
 2         | 0            | 8          | 8      | 0   
------------------------------------------------------

Kafka topic          : users
Max lag              : 0

 Partition | Start Offset | End Offset | Offset | Lag 
------------------------------------------------------
 0         | 0            | 0          | 0      | 0   
 1         | 0            | 3          | 3      | 0   
 2         | 0            | 0          | 0      | 0   
------------------------------------------------------
```

```sh
ksql> SELECT
>    ts.userid,
>    ut.firstname,
>    ut.lastname,
>    COUNT(*) AS tasks_count
>FROM assigned_tasks_stream ts
>LEFT JOIN user_table ut
>ON ts.userid = ut.id
>WINDOW TUMBLING (SIZE 2 HOURS)
>GROUP BY ts.userid, ut.firstname, ut.lastname
>EMIT CHANGES;

+----------------------------------------------------+----------------------------------------------------+----------------------------------------------------+----------------------------------------------------+
|USERID                                              |FIRSTNAME                                           |LASTNAME                                            |TASKS_COUNT                                         |
+----------------------------------------------------+----------------------------------------------------+----------------------------------------------------+----------------------------------------------------+
|rdark                                               |Richard                                             |Dark                                                |2                                                   |
|sdone                                               |Sally                                               |Done                                                |4                                                   |
|sdone                                               |Sally                                               |Done                                                |6                                                   |
|jsmith                                              |John                                                |Smith                                               |4                                                   |
```

```sh
ksql> SELECT
>    userid,
>    TIMESTAMPTOSTRING(windowstart, 'dd-MM-yyyy HH:mm:ss. SSS') AS window_start,
>    TIMESTAMPTOSTRING(windowend, 'dd-MM-yyyy HH:mm:ss. SSS') AS window_end,
>    firstname,
>    lastname,
>    assigned_tasks_count
>FROM task_count_table
>EMIT CHANGES;

+----------------------------------+----------------------------------+----------------------------------+----------------------------------+----------------------------------+----------------------------------+
|USERID                            |WINDOW_START                      |WINDOW_END                        |FIRSTNAME                         |LASTNAME                          |ASSIGNED_TASKS_COUNT              |
+----------------------------------+----------------------------------+----------------------------------+----------------------------------+----------------------------------+----------------------------------+
|sdone                             |06-06-2021 15:00:00. 000          |06-06-2021 17:00:00. 000          |Sally                             |Done                              |1                                 |
|rdark                             |06-06-2021 19:00:00. 000          |06-06-2021 21:00:00. 000          |Richard                           |Dark                              |2                                 |
|sdone                             |06-06-2021 19:00:00. 000          |06-06-2021 21:00:00. 000          |Sally                             |Done                              |6                                 |
Press CTRL-C to interrupt
```