#!/bin/zsh

scriptPath=${0:a:h}

kompose convert --provider openshift -f "$scriptPath/docker-compose.yml" -o "$scriptPath"


