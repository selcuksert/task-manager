FROM dpage/pgadmin4:5.6
LABEL author="Selcuk SERT"
LABEL mail="selcuk.sert@gmail.com"
LABEL version="1.0"
LABEL description="Custom pgadmin image with auto connection config deployment"

COPY ./config/passfile /tmp/passfile
COPY ./config/servers.json /pgadmin4/servers.json
COPY ./scripts/start.sh /start.sh

USER root 
RUN chown pgadmin:pgadmin /tmp/passfile
RUN chmod a+x /start.sh

USER pgadmin

ENTRYPOINT ["/start.sh"]
