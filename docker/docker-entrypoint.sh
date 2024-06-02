#!/bin/sh

# clear dev dependency
echo 'Clear dev dependency...'
npm ci --production

# Run App
echo 'Run app...'

npm run start:prod
