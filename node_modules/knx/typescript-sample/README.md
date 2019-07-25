# Typescript sample for knx.js

This directory contains a sample application in typescript using knx.js

## Usage

    cd typescript-sample
    npm install
    npm run build
    node test-toggle-onoff.js 13/0/137

If you have a knx gateway that doesn't support IP multicast, set the environment variable
KNXGW to the IP-address of your gateway:

    KNXGW=192.168.1.17 node test-toggle-onoff.js 13/0/137
