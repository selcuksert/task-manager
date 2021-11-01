#!/bin/zsh

scriptPath=${0:a:h}

function buildImage() {
  imageName=$1
  buildPath=$2
  imageTag=$3

  oc delete all -l "build=$imageName" &&
    oc new-build --strategy docker --binary --name "$imageName" --to "$imageName:$imageTag" &&
    oc start-build "$imageName" --from-dir "$buildPath" --follow --wait
}

# Login with developer
$(crc console --credentials | grep developer | awk -F "'" '{print $2}')

# Add new project
if (! oc get project task-manager); then
  oc new-project task-manager
fi

# Cleanup
oc delete all -l "io.kompose.service"
oc delete all -l "app=web"
oc delete all -l "app=idp"
oc delete pvc -l "io.kompose.service"

# Add custom image for pgadmin to OCP
buildImage pgadmin "$scriptPath/pgadmin" 6.1

# Add custom image for ldap to OCP
buildImage openldap "$scriptPath/ldap" 1.3.0

# Add custom image for Kafka base to OCP
buildImage kafka "$scriptPath/kafka/base" base

# Add custom image for Kafka SchemaRegistry to OCP
buildImage kafka "$scriptPath/kafka/schemaregistry" schemaregistry

# Add custom image for Kafka RESTProxy to OCP
buildImage kafka "$scriptPath/kafka/restproxy" restproxy

# Add custom image for Kafka Connect to OCP
buildImage kafka "$scriptPath/kafka/connect" connect

# Add custom image for KSQLDB to OCP
buildImage kafka "$scriptPath/kafka/ksql" ksql

# Add custom image for Kafka Monitor to OCP
buildImage kafka "$scriptPath/kafka/monitor" monitor

# Build UI
oc delete all -l "build=ui"
oc delete all -l "app=ui"
oc new-build nodejs --binary --name ui --to ui:latest
oc start-build ui --from-dir="$scriptPath/ui" --follow --wait
oc new-app ui
oc patch deployment/ui -p '{"metadata":{"labels":{"app.kubernetes.io/part-of": "ui"}}}'

# Add new app with sso74-postgresql template
oc delete all -l "app=idp"
oc delete pvc idp-postgresql-claim
oc delete cm idp-service-ca
oc new-app --template=sso74-ocp4-x509-postgresql-persistent --name=idp \
  -p DB_DATABASE=idpdb -p DB_USERNAME=dbuser -p DB_PASSWORD=db1234 \
  -p SSO_ADMIN_USERNAME=sso -p SSO_ADMIN_PASSWORD=Sso1234! \
  -p APPLICATION_NAME=idp
oc patch dc/idp -p '{"metadata":{"labels":{"app.kubernetes.io/part-of": "idp"}}}'
oc patch dc/idp-postgresql -p '{"metadata":{"labels":{"app.kubernetes.io/part-of": "idp"}}}'

# Build user-writer service
oc delete all -l 'build=user-writer'
oc delete all -l 'app=user-writer'
oc delete secret idp-trust
openssl s_client -connect idp-task-manager.apps-crc.testing:443 2>/dev/null </dev/null |  sed -ne '/-BEGIN CERTIFICATE-/,/-END CERTIFICATE-/p' > "$scriptPath/cert/idp.cert"
keytool -delete -alias "idp" -keystore "$scriptPath/cert/cacerts" -storepass "changeit"
keytool -importcert -file "$scriptPath/cert/idp.cert" -keystore "$scriptPath/cert/cacerts" -alias "idp" -storepass "changeit" -noprompt
oc create secret generic idp-trust --from-file="$scriptPath/cert/cacerts"
oc new-build java:openjdk-11-el7 --binary --name user-writer --to user-writer:latest \
  --env='MAVEN_S2I_ARTIFACT_DIRS=src/services/user-writer/target' \
  --env='MAVEN_ARGS=install -DskipTests -pl services/user-writer -am'
oc start-build user-writer --from-dir="$scriptPath/../../backend" \
  --follow --wait
oc new-app user-writer \
  --env='JAVA_APP_JAR=/tmp/artifacts/m2/com/corp/concepts/taskmanager/services/user-writer/0.0.1-SNAPSHOT/user-writer-0.0.1-SNAPSHOT.jar' \
  --env='IDP_PROT=https' \
  --env='IDP_HOST=idp-task-manager.apps-crc.testing' \
  --env='IDP_PORT=443' \
  --env='SR_HOST=schemaregistry' \
  --env='SERVER_PORT=8080' \
  --env='BROKER_1=kafka-broker-1:19091' \
  --env='BROKER_2=kafka-broker-2:19092' \
  --env='BROKER_3=kafka-broker-3:19093' \
  --env='TZ=Europe/Istanbul' \
  --env='JAVA_OPTS=-Djavax.net.ssl.trustStore=/mnt/trust/cacerts -Djavax.net.ssl.trustStorePassword=changeit'
oc patch deployment/user-writer -p '{"metadata":{"labels":{"app.kubernetes.io/part-of": "user"}}}'
oc set volume deployment/user-writer --add --name idp-trust-volume -t secret -m /mnt/trust --secret-name=idp-trust --overwrite

# Build user-reader service
oc delete all -l 'build=user-reader'
oc delete all -l 'app=user-reader'
oc new-build java:openjdk-11-el7 --binary --name user-reader --to user-reader:latest \
  --env='MAVEN_S2I_ARTIFACT_DIRS=src/services/user-reader/target' \
  --env='MAVEN_ARGS=install -DskipTests -pl services/user-reader -am'
oc start-build user-reader --from-dir="$scriptPath/../../backend" \
  --follow --wait
oc new-app user-reader \
  --env='JAVA_APP_JAR=/tmp/artifacts/m2/com/corp/concepts/taskmanager/services/user-reader/0.0.1-SNAPSHOT/user-reader-0.0.1-SNAPSHOT.jar' \
  --env='IDP_PROT=https' \
  --env='IDP_HOST=idp-task-manager.apps-crc.testing' \
  --env='IDP_PORT=443' \
  --env='SERVER_PORT=8080' \
  --env='DB_HOST=appdb' \
  --env='DB_PORT=5432' \
  --env='DB_NAME=appdb' \
  --env='DB_USER=dbuser' \
  --env='DB_PASS=db1234' \
  --env='TZ=Europe/Istanbul' \
  --env='JAVA_OPTS=-Djavax.net.ssl.trustStore=/mnt/trust/cacerts -Djavax.net.ssl.trustStorePassword=changeit'
oc patch deployment/user-reader -p '{"metadata":{"labels":{"app.kubernetes.io/part-of": "user"}}}'
oc set volume deployment/user-reader --add --name idp-trust-volume -t secret -m /mnt/trust --secret-name=idp-trust --overwrite
