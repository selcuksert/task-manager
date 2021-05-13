# Task Management App

This project is an event driven task management application that comprises of PostgreSQL DB and ReactJS, Apache Kafka, Kafka Streams (based on single writer principle) and the major ecosystem components like SchemaRegistry, Kafka Connect.

The UI is based on ReactJS and Bootstrap.

Keycloak with OpenLDAP is used as IdP (Identity Provider) to enable OAuth2 and OIDC driven AAA (AuthN, AuthZ, Accounting).

The Kafka Stream source, processor and sink implementations are based on Spring Cloud Stream Kafka Binder.

## Basic Setup
As this is a PoC project a local domain is used for Traefik edge router. Following entry should be entered in `/etc/hosts`:
```
127.0.0.1 web.poc.local
```

## Components
The project comprises of following components as [containerized deployments](./docker/compose/docker-compose.yml):

### Web UI
ReactJS based Web UI to provide basic portal to manage tasks. React Hook and Context API are also used for state management:
![ui](./docs/images/ui.png)

### Messaging Layer
Event Driven messaging layer using Apache Kafka Ecosystem Tooling:
* Zookeeper
* Kafka Brokers
* Schema Registry
* Kafka Connect
* Rest Proxy
* Kafka Monitoring Stack

### Persistent Data Store
PostgreSQL RDBMS to persist event data on user and task topics for viewing on UI. PgAdmin is also available for DB administration.

### Monitoring Stack
Prometheus and Grafana based monitoring stack is available to view status of Kafka brokers:
![monitoring](./docs/images/monitoring.png)

### Identity Provider for OAuth2 & OIDC
Keycloak Identity Provider for OAuth2 & OIDC based AAA enablement. The IdP is backed by an OpenLDAP instance which is initiated by a designated [user database](./docker/compose/ldap/config/bootstrap.ldif).

<p float="center">
  <img src="./docs/images/login.png" width="49%" />
  <img src="./docs/images/keycloak/realm.png" width="49%" />
  <img src="./docs/images/keycloak/client.png" width="49%" />
  <img src="./docs/images/keycloak/ldap.png" width="49%" />
  <img src="./docs/images/keycloak/mapper.png" width="49%" />
  <img src="./docs/images/keycloak/users.png" width="49%" />
</p>

The task user list on Add User screen is retrieved via Keycloak REST API that is populated from LDAP. To enable this functionality Keycloak admin should assign realm-management client role view-users to all client users:
![view-users](./docs/images/keycloak/view-users.png)