#!/bin/sh

#Stop running container
docker stop $(docker ps -a -q  --filter ancestor=solinfo/orcl_rest)

# Build container
docker build -t solinfo/orcl_rest .

# Run container
docker run -p 5000:5000 -d solinfo/orcl_rest