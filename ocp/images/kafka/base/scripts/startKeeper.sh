#!/bin/bash

EXTRA_ARGS=-javaagent:${KAFKA_ROOT}/jmx_exporter/jmx_prometheus_javaagent.jar=${PROM_AGENT_PORT}:/${KAFKA_ROOT}/jmx_exporter/zookeeper.yaml zookeeper-server-start.sh ${KAFKA_HOME}/config/zookeeper.properties