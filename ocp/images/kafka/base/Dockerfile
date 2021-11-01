FROM openjdk:11-slim

LABEL author="Selcuk SERT"
LABEL mail="selcuk.sert@gmail.com"
LABEL version="1.0"
LABEL description="Base image for zookeeper and Kafka broker"

ENV VERSION=2.8.1
ENV ARCH_VERSION=2.13-${VERSION}
ENV JMX_AGENT_VER=0.15.0
ENV KAFKA_ROOT=/usr/share/kafka
ENV KAFKA_BIN_URL=https://downloads.apache.org/kafka/${VERSION}/kafka_${ARCH_VERSION}.tgz
ENV KAFKA_HOME=${KAFKA_ROOT}/kafka_${ARCH_VERSION}
ENV PATH=${PATH}:${KAFKA_HOME}/bin
ENV TZ=Europe/Istanbul

WORKDIR ${KAFKA_ROOT}

RUN apt-get update && apt-get install -y wget netcat
RUN echo ${KAFKA_BIN_URL} && wget -q ${KAFKA_BIN_URL}
RUN tar -xzf kafka_${ARCH_VERSION}.tgz -C ${KAFKA_ROOT}
RUN mkdir ${KAFKA_ROOT}/jmx_exporter \
&& wget -O ${KAFKA_ROOT}/jmx_exporter/jmx_prometheus_javaagent.jar https://repo1.maven.org/maven2/io/prometheus/jmx/jmx_prometheus_javaagent/${JMX_AGENT_VER}/jmx_prometheus_javaagent-${JMX_AGENT_VER}.jar \
&& wget -O ${KAFKA_ROOT}/jmx_exporter/kafka-config.yml https://raw.githubusercontent.com/prometheus/jmx_exporter/master/example_configs/kafka-2_0_0.yml \
&& wget -O ${KAFKA_ROOT}/jmx_exporter/zookeeper.yaml https://raw.githubusercontent.com/prometheus/jmx_exporter/master/example_configs/zookeeper.yaml

ADD ./scripts/*.sh ${KAFKA_HOME}/bin/

RUN chmod a+x ${KAFKA_HOME}/bin/*.sh

WORKDIR ${KAFKA_HOME}/bin

ENTRYPOINT ["startBroker.sh"]