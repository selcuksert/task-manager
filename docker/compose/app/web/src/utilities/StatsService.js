export function getTaskDataPerUser() {
    return fetch(`http://${window.location.hostname}:8088/query`, {
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