#!/bin/sh

function deleteVolume() {
  local volumeName="$1"
  if [ $(docker volume ls -q -f name="$volumeName") ]
  then
    docker volume remove "$volumeName"
  fi
}

function deleteFolder() {
    local folderName="$1"

    if [ -d $folderName ]; then
      rm -rf $folderName
    fi
}