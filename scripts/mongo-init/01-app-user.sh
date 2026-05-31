#!/bin/bash
set -e

# Runs once on empty mongo_data (docker-entrypoint-initdb.d). Creates SCRAM user for the app.
mongosh "$MONGO_INITDB_DATABASE" --eval "
db.createUser({
  user: '${MONGO_APP_USER}',
  pwd: '${MONGO_APP_PASSWORD}',
  roles: [{ role: 'readWrite', db: '${MONGO_INITDB_DATABASE}' }],
});
"
