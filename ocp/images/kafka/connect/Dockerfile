FROM openjdk:11-slim

LABEL author="Selcuk SERT"
LABEL mail="selcuk.sert@gmail.com"
LABEL version="1.0"
LABEL description="Custom image based on Kafka Connect"

ARG CONFL_KAFKA_VERSION=6.2.0
ARG AVRO_KAFKA_VERSION=1.10.2
ARG PGSQL_JDBC_VER=42.2.20
ARG DEBEZIUM_CON_KAFKA_VERSION=1.5.0.Final
ARG ANTLR_VERSION=4.9.2
ARG CONFL_KAFKA_CON_JDBC_VERSION=5.5.4

ENV KAFKA_VERSION=2.8.1
ENV ARCH_KAFKA_VERSION=2.13-${KAFKA_VERSION}
ENV JMX_AGENT_VER=0.15.0
ENV KAFKA_ROOT=/usr/share/kafka
ENV KAFKA_BIN_URL=https://downloads.apache.org/kafka/${KAFKA_VERSION}/kafka_${ARCH_KAFKA_VERSION}.tgz
ENV KAFKA_HOME=${KAFKA_ROOT}/kafka_${ARCH_KAFKA_VERSION}
ENV PATH=${PATH}:${KAFKA_HOME}/bin
ENV TZ=Europe/Istanbul

RUN mkdir -p ${KAFKA_HOME}

RUN apt-get update && apt-get install -y wget netcat && wget -q ${KAFKA_BIN_URL} && tar -xzf kafka_${ARCH_KAFKA_VERSION}.tgz -C ${KAFKA_ROOT}

RUN wget -q -P ${KAFKA_HOME}/libs/ https://packages.confluent.io/maven/io/confluent/kafka-schema-registry-client/${CONFL_KAFKA_VERSION}/kafka-schema-registry-client-${CONFL_KAFKA_VERSION}.jar && \
wget -q -P ${KAFKA_HOME}/libs/ https://packages.confluent.io/maven/io/confluent/kafka-connect-avro-converter/${CONFL_KAFKA_VERSION}/kafka-connect-avro-converter-${CONFL_KAFKA_VERSION}.jar && \
wget -q -P ${KAFKA_HOME}/libs/ http://packages.confluent.io/maven/io/confluent/kafka-schema-serializer/${CONFL_KAFKA_VERSION}/kafka-schema-serializer-${CONFL_KAFKA_VERSION}.jar && \
wget -q -P ${KAFKA_HOME}/libs/ https://packages.confluent.io/maven/io/confluent/kafka-avro-serializer/${CONFL_KAFKA_VERSION}/kafka-avro-serializer-${CONFL_KAFKA_VERSION}.jar && \
wget -q -P ${KAFKA_HOME}/libs/ http://packages.confluent.io/maven/io/confluent/kafka-connect-avro-data/${CONFL_KAFKA_VERSION}/kafka-connect-avro-data-${CONFL_KAFKA_VERSION}.jar && \
wget -q -P ${KAFKA_HOME}/libs/ https://packages.confluent.io/maven/io/confluent/common-utils/${CONFL_KAFKA_VERSION}/common-utils-${CONFL_KAFKA_VERSION}.jar && \
wget -q -P ${KAFKA_HOME}/libs/ https://packages.confluent.io/maven/io/confluent/common-config/${CONFL_KAFKA_VERSION}/common-config-${CONFL_KAFKA_VERSION}.jar && \
wget -q -P ${KAFKA_HOME}/libs/ https://repo1.maven.org/maven2/org/apache/avro/avro/${AVRO_KAFKA_VERSION}/avro-${AVRO_KAFKA_VERSION}.jar && \
wget -q -P ${KAFKA_HOME}/libs/ https://repo1.maven.org/maven2/org/postgresql/postgresql/${PGSQL_JDBC_VER}/postgresql-${PGSQL_JDBC_VER}.jar && \
wget -q -P ${KAFKA_HOME}/libs/ https://repo1.maven.org/maven2/org/antlr/antlr4-runtime/${ANTLR_VERSION}/antlr4-runtime-${ANTLR_VERSION}.jar && \
wget -q -P ${KAFKA_HOME}/libs/ https://repo1.maven.org/maven2/io/debezium/debezium-api/${DEBEZIUM_CON_KAFKA_VERSION}/debezium-api-${DEBEZIUM_CON_KAFKA_VERSION}.jar && \
wget -q -P ${KAFKA_HOME}/libs/ https://repo1.maven.org/maven2/io/debezium/debezium-core/${DEBEZIUM_CON_KAFKA_VERSION}/debezium-core-${DEBEZIUM_CON_KAFKA_VERSION}.jar && \
wget -q -P ${KAFKA_HOME}/libs/ https://repo1.maven.org/maven2/io/debezium/debezium-ddl-parser/${DEBEZIUM_CON_KAFKA_VERSION}/debezium-ddl-parser-${DEBEZIUM_CON_KAFKA_VERSION}.jar

RUN mkdir ${KAFKA_HOME}/plugins/ && \
wget -q -P ${KAFKA_HOME}/plugins/ https://packages.confluent.io/maven/io/confluent/kafka-connect-jdbc/${CONFL_KAFKA_CON_JDBC_VERSION}/kafka-connect-jdbc-${CONFL_KAFKA_CON_JDBC_VERSION}.jar
ADD ./scripts/*.sh ${KAFKA_HOME}/bin/

RUN chmod a+x ${KAFKA_HOME}/bin/*.sh

ADD ./config/*.properties ${KAFKA_HOME}/config/

WORKDIR ${KAFKA_HOME}/bin

ENTRYPOINT ["start.sh"]