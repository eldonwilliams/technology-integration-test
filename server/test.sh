#!/bin/bash

# This is a small runner for the Docker test stage.
# Do not run this script

if [ -f /.dockerenv ]; then
    # Why doesn't pm2 start work on a Docker run command :(
    pm2 start ./dist/index.js --no-autorestart -o ./jest-reports/server-logs.report.txt -e ./jest-reports/server-crash.report.txt
    sleep 5
    jest --no-color 2>./jest-reports/jest.report.txt
else
    echo You\'re not Docker!
    exit 1
fi