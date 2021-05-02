#!/bin/bash

cp /etc/prometheus/prometheus.yml /etc/prometheus/prometheus_kafka.yml
echo "  - job_name: 'kafka'" >> /etc/prometheus/prometheus_kafka.yml
echo "    static_configs:" >> /etc/prometheus/prometheus_kafka.yml
echo "    - targets: [KAFKA_JMX_ADDR]" >> /etc/prometheus/prometheus_kafka.yml

sed -i "s/KAFKA_JMX_ADDR/$KAFKA_JMX_ADDR/g" /etc/prometheus/prometheus_kafka.yml

( prometheus --config.file=/etc/prometheus/prometheus_kafka.yml \
--web.console.libraries=/etc/prometheus/console_libraries \
--web.console.templates=/etc/prometheus/consoles &) && \
( grafana-server -homepath /usr/share/grafana )