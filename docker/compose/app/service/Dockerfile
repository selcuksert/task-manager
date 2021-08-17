FROM adoptopenjdk:11-jre-hotspot

LABEL author="Selcuk SERT"
LABEL mail="selcuk.sert@gmail.com"
LABEL version="1.0"
LABEL description="Generic Java container for SpringBoot apps"

ENV TZ=Europe/Istanbul
ENV APP_USER=appuser
ENV APP_HOME=/opt/app
ENV APP_BIN=$APP_HOME/bin/app.jar

USER root
RUN mkdir -p $APP_HOME/bin/

RUN apt-get update && apt-get install -y netcat net-tools dnsutils
RUN useradd -ms /bin/bash $APP_USER
COPY ./scripts/start.sh /usr/sbin/start
RUN chmod a+x /usr/sbin/start && chown $APP_USER $APP_HOME

USER $APP_USER
WORKDIR $APP_HOME

# Use shell form instead of exec form to use envvar
ENTRYPOINT start
