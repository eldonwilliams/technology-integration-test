#!/bin/bash
directory=$(pwd)
cd ../server
tsoa spec-and-routes
cd $directory
npx openapi-typescript ../server/src/tsoa/swagger.json --output ./src/apiTypes.ts