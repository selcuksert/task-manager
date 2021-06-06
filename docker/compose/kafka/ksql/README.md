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
    COUNT_DISTINCT(*) AS assigned_tasks_count
FROM assigned_tasks_stream ts
INNER JOIN user_table ut
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
ksql> EXPLAIN CTAS_TASK_COUNT_TABLE_73;

ID                   : CTAS_TASK_COUNT_TABLE_73
Query Type           : PERSISTENT
SQL                  : CREATE TABLE TASK_COUNT_TABLE WITH (KAFKA_TOPIC='task_count_topic', PARTITIONS=3, REPLICAS=3, VALUE_FORMAT='AVRO') AS SELECT
  TS.USERID USERID,
  LATEST_BY_OFFSET(UT.FIRSTNAME) FIRSTNAME,
  LATEST_BY_OFFSET(UT.LASTNAME) LASTNAME,
  COUNT_DISTINCT() ASSIGNED_TASKS_COUNT
FROM ASSIGNED_TASKS_STREAM TS
INNER JOIN USER_TABLE UT ON ((TS.USERID = UT.ID))
WINDOW TUMBLING ( SIZE 2 HOURS , RETENTION 1 DAYS , GRACE PERIOD 10 MINUTES ) 
GROUP BY TS.USERID
EMIT CHANGES;
Host Query Status    : {fa99db426ac3:8088=RUNNING}

 Field                | Type                                           
-----------------------------------------------------------------------
 USERID               | VARCHAR(STRING)  (key) (Window type: TUMBLING) 
 FIRSTNAME            | VARCHAR(STRING)                                
 LASTNAME             | VARCHAR(STRING)                                
 ASSIGNED_TASKS_COUNT | BIGINT                                         
-----------------------------------------------------------------------

Sources that this query reads from: 
-----------------------------------
ASSIGNED_TASKS_STREAM
USER_TABLE

For source description please run: DESCRIBE [EXTENDED] <SourceId>

Sinks that this query writes to: 
-----------------------------------
TASK_COUNT_TABLE

For sink description please run: DESCRIBE [EXTENDED] <SinkId>

Execution plan      
--------------      
 > [ SINK ] | Schema: USERID STRING KEY, FIRSTNAME STRING, LASTNAME STRING, ASSIGNED_TASKS_COUNT BIGINT | Logger: CTAS_TASK_COUNT_TABLE_73.TASK_COUNT_TABLE
                 > [ PROJECT ] | Schema: USERID STRING KEY, FIRSTNAME STRING, LASTNAME STRING, ASSIGNED_TASKS_COUNT BIGINT | Logger: CTAS_TASK_COUNT_TABLE_73.Aggregate.Project
                                 > [ AGGREGATE ] | Schema: TS_USERID STRING KEY, TS_USERID STRING, UT_FIRSTNAME STRING, UT_LASTNAME STRING, TS_ROWTIME BIGINT, KSQL_AGG_VARIABLE_0 STRING, KSQL_AGG_VARIABLE_1 STRING, KSQL_AGG_VARIABLE_2 BIGINT, WINDOWSTART BIGINT, WINDOWEND BIGINT | Logger: CTAS_TASK_COUNT_TABLE_73.Aggregate.Aggregate
                                                 > [ GROUP_BY ] | Schema: TS_USERID STRING KEY, TS_USERID STRING, UT_FIRSTNAME STRING, UT_LASTNAME STRING, TS_ROWTIME BIGINT | Logger: CTAS_TASK_COUNT_TABLE_73.Aggregate.GroupBy
                                                                 > [ PROJECT ] | Schema: TS_USERID STRING KEY, TS_USERID STRING, UT_FIRSTNAME STRING, UT_LASTNAME STRING, TS_ROWTIME BIGINT | Logger: CTAS_TASK_COUNT_TABLE_73.Aggregate.Prepare
                                                                                 > [ JOIN ] | Schema: TS_USERID STRING KEY, TS_USERID STRING, TS_TITLE STRING, TS_DETAILS STRING, TS_DUEDATE STRING, TS_ROWTIME BIGINT, TS_ID STRING, UT_FIRSTNAME STRING, UT_LASTNAME STRING, UT_ROWTIME BIGINT, UT_ID STRING | Logger: CTAS_TASK_COUNT_TABLE_73.Join
                                                                                                 > [ PROJECT ] | Schema: TS_USERID STRING KEY, TS_USERID STRING, TS_TITLE STRING, TS_DETAILS STRING, TS_DUEDATE STRING, TS_ROWTIME BIGINT, TS_ID STRING | Logger: CTAS_TASK_COUNT_TABLE_73.PrependAliasLeft
                                                                                                                 > [ REKEY ] | Schema: USERID STRING KEY, USERID STRING, TITLE STRING, DETAILS STRING, DUEDATE STRING, ROWTIME BIGINT, ID STRING | Logger: CTAS_TASK_COUNT_TABLE_73.LeftSourceKeyed
                                                                                                                                 > [ SOURCE ] | Schema: ID STRING KEY, USERID STRING, TITLE STRING, DETAILS STRING, DUEDATE STRING, ROWTIME BIGINT, ID STRING | Logger: CTAS_TASK_COUNT_TABLE_73.KafkaTopic_Left.Source
                                                                                                 > [ PROJECT ] | Schema: UT_ID STRING KEY, UT_FIRSTNAME STRING, UT_LASTNAME STRING, UT_ROWTIME BIGINT, UT_ID STRING | Logger: CTAS_TASK_COUNT_TABLE_73.PrependAliasRight
                                                                                                                 > [ SOURCE ] | Schema: ID STRING KEY, FIRSTNAME STRING, LASTNAME STRING, ROWTIME BIGINT, ID STRING | Logger: CTAS_TASK_COUNT_TABLE_73.KafkaTopic_Right.Source


Processing topology 
------------------- 
Topologies:
   Sub-topology: 0
    Source: Join-repartition-source (topics: [Join-repartition])
      --> Join
    Processor: Join (stores: [KafkaTopic_Right-Reduce])
      --> Aggregate-Prepare
      <-- Join-repartition-source
    Processor: Aggregate-Prepare (stores: [])
      --> KSTREAM-AGGREGATE-0000000015
      <-- Join
    Processor: KSTREAM-AGGREGATE-0000000015 (stores: [Aggregate-Aggregate-Materialize])
      --> Aggregate-Aggregate-ToOutputSchema
      <-- Aggregate-Prepare
    Processor: Aggregate-Aggregate-ToOutputSchema (stores: [])
      --> Aggregate-Aggregate-WindowSelect
      <-- KSTREAM-AGGREGATE-0000000015
    Source: KSTREAM-SOURCE-0000000001 (topics: [users])
      --> KTABLE-SOURCE-0000000002
    Processor: Aggregate-Aggregate-WindowSelect (stores: [])
      --> Aggregate-Project
      <-- Aggregate-Aggregate-ToOutputSchema
    Processor: KTABLE-SOURCE-0000000002 (stores: [])
      --> KTABLE-MAPVALUES-0000000003
      <-- KSTREAM-SOURCE-0000000001
    Processor: Aggregate-Project (stores: [])
      --> KTABLE-TOSTREAM-0000000019
      <-- Aggregate-Aggregate-WindowSelect
    Processor: KTABLE-MAPVALUES-0000000003 (stores: [KafkaTopic_Right-Reduce])
      --> KTABLE-TRANSFORMVALUES-0000000004
      <-- KTABLE-SOURCE-0000000002
    Processor: KTABLE-TOSTREAM-0000000019 (stores: [])
      --> KSTREAM-SINK-0000000020
      <-- Aggregate-Project
    Processor: KTABLE-TRANSFORMVALUES-0000000004 (stores: [])
      --> PrependAliasRight
      <-- KTABLE-MAPVALUES-0000000003
    Sink: KSTREAM-SINK-0000000020 (topic: task_count_topic)
      <-- KTABLE-TOSTREAM-0000000019
    Processor: PrependAliasRight (stores: [])
      --> none
      <-- KTABLE-TRANSFORMVALUES-0000000004

  Sub-topology: 1
    Source: KSTREAM-SOURCE-0000000006 (topics: [assigned_tasks])
      --> KSTREAM-TRANSFORMVALUES-0000000007
    Processor: KSTREAM-TRANSFORMVALUES-0000000007 (stores: [])
      --> LeftSourceKeyed-SelectKey
      <-- KSTREAM-SOURCE-0000000006
    Processor: LeftSourceKeyed-SelectKey (stores: [])
      --> PrependAliasLeft
      <-- KSTREAM-TRANSFORMVALUES-0000000007
    Processor: PrependAliasLeft (stores: [])
      --> Join-repartition-filter
      <-- LeftSourceKeyed-SelectKey
    Processor: Join-repartition-filter (stores: [])
      --> Join-repartition-sink
      <-- PrependAliasLeft
    Sink: Join-repartition-sink (topic: Join-repartition)
      <-- Join-repartition-filter



Overridden Properties
---------------------
 Property          | Value    
------------------------------
 auto.offset.reset | earliest 
------------------------------

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
|ccole                             |06-06-2021 21:00:00. 000          |06-06-2021 23:00:00. 000          |Claudia                           |Cole                              |5                                 |
|ccole                             |06-06-2021 21:00:00. 000          |06-06-2021 23:00:00. 000          |Claudia                           |Cole                              |6                                 |
|sdone                             |06-06-2021 15:00:00. 000          |06-06-2021 17:00:00. 000          |Sally                             |Done                              |1                                 |
|sdone                             |06-06-2021 19:00:00. 000          |06-06-2021 21:00:00. 000          |Sally                             |Done                              |1                                 |
|sdone                             |06-06-2021 21:00:00. 000          |06-06-2021 23:00:00. 000          |Sally                             |Done                              |1                                 |
|ccole                             |06-06-2021 21:00:00. 000          |06-06-2021 23:00:00. 000          |Claudia                           |Cole                              |7                                 |
|rdark                             |06-06-2021 21:00:00. 000          |06-06-2021 23:00:00. 000          |Richard                           |Dark                              |1                                 |
|sdone                             |06-06-2021 21:00:00. 000          |06-06-2021 23:00:00. 000          |Sally                             |Done                              |2                                 |
|jsmith                            |06-06-2021 21:00:00. 000          |06-06-2021 23:00:00. 000          |John                              |Smith                             |8                                 |

Press CTRL-C to interrupt
```