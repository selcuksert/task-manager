#!/bin/zsh

scriptPath=${0:a:h}

# Login with kubeadmin
$(crc console --credentials | grep kubeadmin | awk -F "'" '{print $2}')

# Update scc to enable any user id except root user's
if (! oc get serviceaccount runasnonroot); then
  oc create serviceaccount runasnonroot
  oc adm policy add-scc-to-user nonroot -z runasnonroot --as system:admin
fi

# Update scc to enable any user id
if (! oc get serviceaccount runasroot); then
  oc create serviceaccount runasroot
  oc adm policy add-scc-to-user anyuid -z runasroot --as system:admin
fi

# Login with developer
$(crc console --credentials | grep developer | awk -F "'" '{print $2}')

# Switch to project
oc project task-manager

applyFileList=""

for fileName in "$scriptPath"/deployment/*.yaml; do
  applyFileList+="$fileName,"
done

oc apply -f "${applyFileList:0:-1}"

oc delete all -l 'app=user-writer'
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

oc delete all -l 'app=user-reader'
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

oc delete all -l 'app=task-writer'
oc new-app task-writer \
  --env='JAVA_APP_JAR=/tmp/artifacts/m2/com/corp/concepts/taskmanager/services/task-writer/0.0.1-SNAPSHOT/task-writer-0.0.1-SNAPSHOT.jar' \
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
oc patch deployment/task-writer -p '{"metadata":{"labels":{"app.kubernetes.io/part-of": "task"}}}'
oc set volume deployment/task-writer --add --name idp-trust-volume -t secret -m /mnt/trust --secret-name=idp-trust --overwrite

oc delete all -l 'app=task-reader'
oc new-app task-reader \
  --env='JAVA_APP_JAR=/tmp/artifacts/m2/com/corp/concepts/taskmanager/services/task-reader/0.0.1-SNAPSHOT/task-reader-0.0.1-SNAPSHOT.jar' \
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
oc patch deployment/task-reader -p '{"metadata":{"labels":{"app.kubernetes.io/part-of": "task"}}}'
oc set volume deployment/task-reader --add --name idp-trust-volume -t secret -m /mnt/trust --secret-name=idp-trust --overwrite

oc delete all -l 'app=task-processor'
oc new-app task-processor \
  --env='JAVA_APP_JAR=/tmp/artifacts/m2/com/corp/concepts/taskmanager/services/task-processor/0.0.1-SNAPSHOT/task-processor-0.0.1-SNAPSHOT.jar' \
  --env='IDP_PROT=https' \
  --env='IDP_HOST=idp-task-manager.apps-crc.testing' \
  --env='IDP_PORT=443' \
  --env='SR_HOST=schemaregistry' \
  --env='SERVER_PORT=8080' \
  --env='BROKER_1=kafka-broker-1:19091' \
  --env='BROKER_2=kafka-broker-2:19092' \
  --env='BROKER_3=kafka-broker-3:19093' \
  --env='STATE_DIR_ROOT=/var/lib/ks-state' \
  --env='TZ=Europe/Istanbul' \
  --env='JAVA_OPTS=-Djavax.net.ssl.trustStore=/mnt/trust/cacerts -Djavax.net.ssl.trustStorePassword=changeit'
oc patch deployment/task-processor -p '{"metadata":{"labels":{"app.kubernetes.io/part-of": "task"}}}'
oc set volume deployment/task-processor --add --name idp-trust-volume -t secret -m /mnt/trust --secret-name=idp-trust --overwrite
oc set volume deployment/task-processor --add --name tp-ks-state-volume -t pvc --claim-size=1G -m /var/lib/ks-state --overwrite

oc expose service pgadmin
oc expose service ui
oc expose service schemaregistry
oc expose service restproxy
oc expose service kafkaconnect
oc expose service ksql
oc expose service kmonitor
oc expose service user-writer
oc expose service user-reader
oc expose service task-writer
oc expose service task-reader
oc expose service task-processor
