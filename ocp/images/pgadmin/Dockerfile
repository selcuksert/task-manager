FROM dpage/pgadmin4:6.1
LABEL author="Selcuk SERT"
LABEL mail="selcuk.sert@gmail.com"
LABEL version="1.0"
LABEL description="Custom pgadmin image with auto connection config deployment"

COPY ./config/passfile /tmp/passfile
COPY ./config/servers.json /pgadmin4/servers.json
COPY ./scripts/start.sh /usr/local/bin/start

USER root
RUN chown pgadmin:pgadmin /tmp/passfile
RUN chown -R pgadmin:pgadmin /var/lib/pgadmin
RUN mkdir -p /var/log/pgadmin && \
    chown pgadmin:pgadmin /var/log/pgadmin
RUN chmod a+x /usr/local/bin/start

USER pgadmin

ENTRYPOINT ["start"]
