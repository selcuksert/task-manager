CREATE STREAM task_stream (
    ROWKEY VARCHAR KEY,
    USERID VARCHAR,
    TITLE VARCHAR,
    DETAILS VARCHAR,
    STATUS VARCHAR,
    DUEDATE VARCHAR
) WITH ( 
    KAFKA_TOPIC='tasks',
    VALUE_FORMAT='AVRO'
);


CREATE STREAM assigned_tasks_stream
WITH (
     KAFKA_TOPIC = 'assigned_tasks',
     VALUE_FORMAT = 'AVRO',
     PARTITIONS = 3,
     REPLICAS = 3
) AS SELECT 
          ROWKEY AS ID,
          USERID,
          TITLE,
          DETAILS,
          DUEDATE
     FROM task_stream
     WHERE STATUS = 'ASSIGNED'
     EMIT CHANGES;

CREATE STREAM as_stream (
    ROWKEY VARCHAR KEY,
    USERID VARCHAR,
    TITLE VARCHAR,
    DETAILS VARCHAR,
    DUEDATE VARCHAR
) WITH ( 
    KAFKA_TOPIC='assigned_tasks',
    VALUE_FORMAT='AVRO'
);


SELECT * FROM as_stream EMIT CHANGES;
