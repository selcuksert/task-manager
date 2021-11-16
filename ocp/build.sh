#!/bin/zsh

scriptPath=${0:a:h}

function buildImage() {
  imageName=$1
  buildPath=$2
  imageTag=$3
  buildName="$imageName-$imageTag"

  oc delete all -l "build=$buildName" &&
    oc new-build --strategy docker --binary --name "$buildName" --to "$imageName:$imageTag" &&
    oc start-build "$buildName" --from-dir "$buildPath" --follow --wait
}

# Login with developer
$(crc console --credentials | grep developer | awk -F "'" '{print $2}')

# Add new project
if (! oc get project task-manager); then
  oc new-project task-manager
fi

oc project task-manager

# Cleanup
oc delete all -l "io.kompose.service"
oc delete all -l "app=web"
oc delete all -l "app=idp"
oc delete pvc -l "io.kompose.service"

# Add custom image for pgadmin to OCP
buildImage pgadmin "$scriptPath/images/pgadmin" 6.1

# Add custom image for ldap to OCP
buildImage openldap "$scriptPath/images/ldap" 1.3.0

# Add custom image for Kafka base to OCP
buildImage kafka "$scriptPath/images/kafka/base" base

# Add custom image for Kafka SchemaRegistry to OCP
buildImage kafka "$scriptPath/images/kafka/schemaregistry" schemaregistry

# Add custom image for Kafka RESTProxy to OCP
buildImage kafka "$scriptPath/images/kafka/restproxy" restproxy

# Add custom image for Kafka Connect to OCP
buildImage kafka "$scriptPath/images/kafka/connect" connect

# Add custom image for KSQLDB to OCP
buildImage kafka "$scriptPath/images/kafka/ksql" ksql

# Add custom image for Kafka Monitor to OCP
buildImage kafka "$scriptPath/images/kafka/monitor" monitor

# Build UI
oc delete all -l "build=ui"
oc delete all -l "app=ui"
oc new-build nodejs --binary --name ui --to ui:latest
oc start-build ui --from-dir="$scriptPath/images/ui" --wait
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

# Generate secret for IdP certificate
oc delete secret idp-trust
openssl s_client -connect idp-task-manager.apps-crc.testing:443 2>/dev/null </dev/null |  sed -ne '/-BEGIN CERTIFICATE-/,/-END CERTIFICATE-/p' > "$scriptPath/images/cert/idp.cert"
keytool -delete -alias "idp" -keystore "$scriptPath/images/cert/cacerts" -storepass "changeit"
keytool -importcert -file "$scriptPath/images/cert/idp.cert" -keystore "$scriptPath/cert/cacerts" -alias "idp" -storepass "changeit" -noprompt
oc create secret generic idp-trust --from-file="$scriptPath/images/cert/cacerts"

# Build user-writer service
oc delete all -l 'build=user-writer'
oc new-build java:openjdk-11-el7 --binary --name user-writer --to user-writer:latest \
  --env='MAVEN_S2I_ARTIFACT_DIRS=src/services/user-writer/target' \
  --env='MAVEN_ARGS=install -DskipTests -pl services/user-writer -am'
oc start-build user-writer --from-dir="$scriptPath/../backend" \
  --follow --wait

# Build user-reader service
oc delete all -l 'build=user-reader'
oc new-build java:openjdk-11-el7 --binary --name user-reader --to user-reader:latest \
  --env='MAVEN_S2I_ARTIFACT_DIRS=src/services/user-reader/target' \
  --env='MAVEN_ARGS=install -DskipTests -pl services/user-reader -am'
oc start-build user-reader --from-dir="$scriptPath/../backend" \
  --follow --wait

# Build task-writer service
oc delete all -l 'build=task-writer'
oc new-build java:openjdk-11-el7 --binary --name task-writer --to task-writer:latest \
  --env='MAVEN_S2I_ARTIFACT_DIRS=src/services/task-writer/target' \
  --env='MAVEN_ARGS=install -DskipTests -pl services/task-writer -am'
oc start-build task-writer --from-dir="$scriptPath/../backend" \
  --follow --wait

# Build task-reader service
oc delete all -l 'build=task-reader'
oc new-build java:openjdk-11-el7 --binary --name task-reader --to task-reader:latest \
  --env='MAVEN_S2I_ARTIFACT_DIRS=src/services/task-reader/target' \
  --env='MAVEN_ARGS=install -DskipTests -pl services/task-reader -am'
oc start-build task-reader --from-dir="$scriptPath/../backend" \
  --follow --wait

# Build task-processor service
oc delete all -l 'build=task-processor'
oc new-build java:openjdk-11-el7 --binary --name task-processor --to task-processor:latest \
  --env='MAVEN_S2I_ARTIFACT_DIRS=src/services/task-processor/target' \
  --env='MAVEN_ARGS=install -DskipTests -pl services/task-processor -am'
oc start-build task-processor --from-dir="$scriptPath/../backend" \
  --follow --wait
