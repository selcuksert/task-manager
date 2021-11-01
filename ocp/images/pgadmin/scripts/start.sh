#!/bin/sh

if [ ! -d /var/lib/pgadmin/storage/pgadmin_corp.com ]
then
	mkdir -p -m 700 /var/lib/pgadmin/storage/pgadmin_corp.com
	cp /tmp/passfile /var/lib/pgadmin/storage/pgadmin_corp.com/
	chmod 600 /var/lib/pgadmin/storage/pgadmin_corp.com/passfile
fi

/entrypoint.sh