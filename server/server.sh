#!/bin/bash

sudo kill -9 $(lsof -t -i:3000)
sudo kill -9 $(lsof -t -i:4200)
echo "start server.."
npm run dev