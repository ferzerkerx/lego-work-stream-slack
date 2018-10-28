#!/bin/bash

mkdir backend/dist
mkdir backend/dist/public

cd frontend/
yarn build

cd ..
cp frontend/dist/* backend/dist/public/

cd backend/
yarn test
yarn compile
