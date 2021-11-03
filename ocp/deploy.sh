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
if (! oc get serviceaccount runasnonroot); then
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
