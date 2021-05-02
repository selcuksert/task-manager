FROM maven:3-openjdk-11-slim

LABEL author="Selcuk SERT"
LABEL mail="selcuk.sert@gmail.com"
LABEL version="1.0"
LABEL description="Custom image based on Confluent Kafka Rest Proxy"

ARG VERSION=v6.1.1
ARG PROJECT_NAME=kafka-rest
ARG APP_SRC_HOME=https://github.com/confluentinc/${PROJECT_NAME}.git

ENV APP_ROOT=/usr/share/confluent
ENV APP_HOME=${APP_ROOT}/${PROJECT_NAME}
ENV PATH=${PATH}:${APP_HOME}/bin
ENV TZ=Europe/Istanbul

COPY ./config/settings.xml /usr/share/maven/conf/settings.xml

EXPOSE 8081

RUN apt-get update && apt-get install -y git netcat

WORKDIR ${APP_ROOT}

RUN git clone ${APP_SRC_HOME}

WORKDIR ${APP_HOME}

RUN git checkout ${VERSION} && \
	sed 's/\${confluent.maven.repo}/https:\/\/packages.confluent.io\/maven\//g' pom.xml > pom_fix_url_error.xml && \
	echo "Start packaging" && mvn -f pom_fix_url_error.xml -DskipTests=true -Dcheckstyle.skip=true -Dmaven.test.skip=true -Dmaven.site.skip=true -Dmaven.javadoc.skip=true -Dspotbugs.skip=true clean install
	
COPY ./scripts/start.sh ${APP_HOME}/bin/
	
# To fix startup issue due to wrong classpath setting in kafka-rest-run-class script
RUN sed "s/CLASSPATH=\$CLASSPATH:\$dir\/share\/java\/kafka-rest-bin\/\*:\$dir\/share\/java\/kafka-rest-lib\/\*/CLASSPATH=\$CLASSPATH:\$dir\/share\/java\/kafka-rest\/\*:/g" -i ${APP_HOME}/bin/kafka-rest-run-class 

RUN chmod a+x ${APP_HOME}/bin/*.sh

RUN rm -rf $HOME/.m2/repository

ENTRYPOINT ["start.sh"]