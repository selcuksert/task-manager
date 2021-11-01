## Fire Event to Topic:

```
curl --location --request POST 'http://localhost:8082/topics/tasks' \
--header 'Content-Type: application/vnd.kafka.json.v2+json' \
--header 'Content-Type: text/plain' \
--data-raw '{
    "records": [
        {
            "key": 156,
            "value": {
                "userId": 903,
                "title": "Vero iure quod.",
                "status": "STARTED"
            }
        },
        {
            "key": 969,
            "value": {
                "userId": 701,
                "title": "Nihil dicta beatae.",
                "status": "STARTED"
            }
        },
        {
            "key": 335,
            "value": {
                "userId": 380,
                "title": "Aut aut cumque ut omnis exercitationem sit id.",
                "status": "COMPLETED"
            }
        }
    ]
}'
```

## Add consumer:

```
curl --location --request POST 'http://localhost:8082/consumers/tasks-consumer-group/' \
--header 'Content-Type: application/vnd.kafka.json.v2+json' \
--header 'Content-Type: text/plain' \
--data-raw '{
	"name": "consumer-1",
	"format": "json",
	"auto.offset.reset": "earliest"
}'
```

## Subscribe to topic:

```
curl --location --request POST 'http://localhost:8082/consumers/tasks-consumer-group/instances/consumer-1/subscription' \
--header 'Content-Type: application/vnd.kafka.json.v2+json' \
--header 'Content-Type: text/plain' \
--data-raw '{
	"topics": ["tasks"]
}'
```

## Consume events:

```
curl --location --request GET 'http://localhost:8082/consumers/tasks-consumer-group/instances/consumer-1/records' \
--header 'Accept: application/vnd.kafka.json.v2+json'
```