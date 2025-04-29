#!/bin/bash

# Install dependencies
npm install

# Build the client
npm run build

# Copy static assets to the correct directory
mkdir -p dist/public
cp -r dist/client/* dist/public/
