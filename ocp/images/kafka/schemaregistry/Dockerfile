FROM maven:3-openjdk-11-slim

LABEL author="Selcuk SERT"
LABEL mail="selcuk.sert@gmail.com"
LABEL version="1.0"
LABEL description="Custom image based on Confluent Schema Registry"

ARG VERSION=v6.2.0
ARG PROJECT_NAME=schema-registry
ARG SR_SRC_HOME=https://github.com/confluentinc/${PROJECT_NAME}.git

ENV SR_ROOT=/usr/share/confluent
ENV SR_HOME=${SR_ROOT}/${PROJECT_NAME}
ENV PATH=${PATH}:${SR_HOME}/bin
ENV TZ=Europe/Istanbul

COPY ./config/settings.xml /usr/share/maven/conf/settings.xml

EXPOSE 8081

RUN apt-get update && apt-get install -y git netcat

WORKDIR ${SR_ROOT}

RUN git clone ${SR_SRC_HOME}

WORKDIR ${SR_HOME}

RUN git checkout ${VERSION} && \
	sed 's/\${confluent.maven.repo}/https:\/\/packages.confluent.io\/maven\//g' pom.xml > pom_fix_url_error.xml && \
	echo "Start packaging" && mvn -f pom_fix_url_error.xml -DskipTests=true -Dcheckstyle.skip=true -Dmaven.test.skip=true -Dmaven.site.skip=true -Dmaven.javadoc.skip=true -Dspotbugs.skip=true clean install
	
COPY ./scripts/start.sh ${SR_HOME}/bin/

RUN chmod a+x ${SR_HOME}/bin/*.sh

RUN rm -rf $HOME/.m2/repository

ENTRYPOINT ["start.sh"]