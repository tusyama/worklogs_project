#!/bin/sh
set -e

DB="${MONGO_INITDB_DATABASE:-worklog}"
USER="${MONGO_APP_USER:?}"
PASS="${MONGO_APP_PASSWORD:?}"

mongosh "mongodb://${USER}:${PASS}@localhost:27017/${DB}?authSource=${DB}" \
  --quiet \
  --eval "db.adminCommand({ ping: 1 }).ok" | grep -q 1
