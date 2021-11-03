export function getTaskDataPerUser() {
    return fetch(`http://ksql-task-manager.apps-crc.testing/query`, {
        method: 'post',
        headers: {
            "Content-Type": "application/vnd.ksql.v1+json; charset=utf-8",
            "Accept": "application/vnd.ksql.v1+json"
        },
        body: JSON.stringify({
            ksql: 'SELECT USERID, COUNT(*) AS task_count FROM task_table GROUP BY USERID EMIT CHANGES;',
            streamsProperties: {
                'ksql.streams.auto.offset.reset': 'earliest'
            }
        })
    })
        .then(res => {
            if (res.status !== 200) {
                return res.json();
            }

            return res;
        })
        .catch(err => console.error(err));
}

export function getTaskDistPerUser(windowStartEpoch, windowEndEpoch) {
    return fetch(`http://ksql-task-manager.apps-crc.testing/query`, {
        method: 'post',
        headers: {
            "Content-Type": "application/vnd.ksql.v1+json; charset=utf-8",
            "Accept": "application/vnd.ksql.v1+json"
        },
        body: JSON.stringify({
            ksql: `SELECT USERID, ` +
                `TIMESTAMPTOSTRING(WINDOWSTART, 'dd-MM-yyyy HH:mm:ss') AS Window_Start, ` +
                `TIMESTAMPTOSTRING(WINDOWEND, 'dd-MM-yyyy HH:mm:ss') AS Window_End, ` +
                `TASK_COUNT FROM TASK_HISTORY_TABLE ` +
                `WHERE WINDOWSTART >= ${windowStartEpoch} AND WINDOWEND <= ${windowEndEpoch} ` +
                `EMIT CHANGES;`,
            streamsProperties: {
                'ksql.streams.auto.offset.reset': 'earliest'
            }
        })
    })
        .then(res => {
            if (res.status !== 200) {
                return res.json();
            }

            return res;
        })
        .catch(err => console.error(err));
}

export function stopQuery(_queryId) {
    console.log(_queryId);
    return fetch(`http://ksql-task-manager.apps-crc.testing/close-query`, {
        method: 'post',
        headers: {
            "Content-Type": "application/vnd.ksql.v1+json; charset=utf-8",
            "Accept": "application/vnd.ksql.v1+json"
        },
        body: JSON.stringify({
            queryId: _queryId
        })
    })
        .then(res => {
            if (res.status === 200) {
                return res.json();
            }

            return res;
        })
        .catch(err => console.error(err));
}

export function addTaskTableToKSql() {
    return fetch(`http://ksql-task-manager.apps-crc.testing/ksql`, {
        method: 'post',
        headers: {
            "Content-Type": "application/vnd.ksql.v1+json; charset=utf-8",
            "Accept": "application/vnd.ksql.v1+json"
        },
        body: JSON.stringify({
            ksql: "CREATE OR REPLACE TABLE task_table " +
                "( " +
                "    ID      VARCHAR PRIMARY KEY," +
                "    USERID  VARCHAR," +
                "    TITLE   VARCHAR," +
                "    DETAILS VARCHAR," +
                "    STATUS  VARCHAR," +
                "   DUEDATE VARCHAR " +
                ") " +
                "WITH (" +
                "    KAFKA_TOPIC = 'tasks'," +
                "    VALUE_FORMAT = 'AVRO'," +
                "    PARTITIONS=3," +
                "    REPLICAS=3" +
                ");",
            streamsProperties: {
                'ksql.streams.auto.offset.reset': 'earliest'
            }
        })
    })
        .then(res => {
            if (res.status === 200) {
                return res.json();
            }

            return { error: 'Error', message: res.message };
        })
        .catch(err => console.error(err));
}

export function addTaskStreamToKSql() {
    return fetch(`http://ksql-task-manager.apps-crc.testing/ksql`, {
        method: 'post',
        headers: {
            "Content-Type": "application/vnd.ksql.v1+json; charset=utf-8",
            "Accept": "application/vnd.ksql.v1+json"
        },
        body: JSON.stringify({
            ksql: "DROP TABLE IF EXISTS TASK_HISTORY_TABLE; DROP STREAM IF EXISTS task_stream; " +
                "CREATE OR REPLACE STREAM task_stream (" +
                "ROWKEY VARCHAR KEY," +
                "USERID VARCHAR," +
                "TITLE VARCHAR," +
                "DETAILS VARCHAR," +
                "STATUS VARCHAR," +
                "DUEDATE VARCHAR" +
                ") " +
                "WITH (" +
                "    KAFKA_TOPIC='tasks'," +
                "    VALUE_FORMAT='AVRO'," +
                "    PARTITIONS=3," +
                "    REPLICAS=3 " +
                ");",
            streamsProperties: {
                'ksql.streams.auto.offset.reset': 'earliest'
            }
        })
    })
        .then(res => {
            if (res.status === 200) {
                return res.json();
            }

            return { error: 'Error', message: res.message };
        })
        .catch(err => console.error(err));
}

export function addTaskHistoryTableToKSql(windowSizeInMinutes) {
    return fetch(`http://ksql-task-manager.apps-crc.testing/ksql`, {
        method: 'post',
        headers: {
            "Content-Type": "application/vnd.ksql.v1+json; charset=utf-8",
            "Accept": "application/vnd.ksql.v1+json"
        },
        body: JSON.stringify({
            ksql: `DROP TABLE IF EXISTS TASK_HISTORY_TABLE; ` +
                `CREATE TABLE TASK_HISTORY_TABLE AS ` +
                `SELECT USERID, ` +
                `COUNT(*) AS task_count FROM task_stream ` +
                `WINDOW TUMBLING (SIZE ${windowSizeInMinutes} MINUTES) ` +
                `GROUP BY USERID ` +
                `EMIT CHANGES;`,
            streamsProperties: {
                'ksql.streams.auto.offset.reset': 'earliest'
            }
        })
    })
        .then(res => {
            if (res.status === 200) {
                return res.json();
            }

            return { error: 'Error', message: res.message };
        })
        .catch(err => console.error(err));
}