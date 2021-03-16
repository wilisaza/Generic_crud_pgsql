#!/bin/sh

#Stop running container
docker stop $(docker ps -a -q  --filter ancestor=solinfo/pgsql_gen_rest)

# Build container
docker build -t solinfo/pgsql_gen_rest .

# Run container
docker run -p 5010:5010 -d solinfo/pgsql_gen_rest