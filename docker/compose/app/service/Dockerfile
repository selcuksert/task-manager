FROM openjdk:11-slim

LABEL author="Selcuk SERT"
LABEL mail="selcuk.sert@gmail.com"
LABEL version="1.0"
LABEL description="Base image for Java apps"

RUN apt-get update && apt-get install -y netcat
ENV TZ=Europe/Istanbul
ENV APP_BIN=/home/app.jar

COPY ./scripts/start.sh /usr/local/bin/
RUN chmod a+x /usr/local/bin/start.sh

ENTRYPOINT ["start.sh"]