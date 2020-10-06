#!/bin/sh
echo "REACT_APP_INFURA_URI=$REACT_APP_INFURA_URI" >> .env
echo "REACT_APP_CHAIN_ID=$REACT_APP_CHAIN_ID=" >> .env

yarn build
