FROM osixia/openldap:1.3.0
LABEL author="Selcuk SERT"
LABEL mail="selcuk.sert@gmail.com"
LABEL version="1.0"
LABEL description="Custom ldap image with init config"

COPY ./config/bootstrap.ldif /container/service/slapd/assets/config/bootstrap/ldif/50-bootstrap.ldif
COPY ./config/modify.ldif /container/service/slapd/assets/config/bootstrap/ldif/custom/modify.ldif