#!/bin/bash
directory=$(pwd)
cd ../server
tsoa spec-and-routes
npx openapi-typescript ./src/tsoa/swagger.json --output ./spec/api/apiTypes.ts
cd $directory
npx openapi-typescript ../server/src/tsoa/swagger.json --output ./src/apiTypes.ts