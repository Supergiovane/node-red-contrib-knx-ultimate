/**
* knx.js - a KNX protocol stack in pure Javascript
* (C) 2016-2017 Elias Karakoulakis
*/

import * as knx from 'knx'

let groupAddress = process.argv[2]

let connection = new knx.Connection({
    ipAddr: process.env.KNXGW,
    handlers: {
        connected: onConnected
    }
})

async function onConnected() {
    console.log('Connected')
    let dp = new knx.Datapoint({
        ga: groupAddress,
        dpt: 'DPT1.001'
    }, connection)

    dp.on('change', (oldValue: number, newValue: number) =>
        console.log(`Value changed from ${oldValue} to ${newValue}`) )

    dp.read()
    await wait(2000)

    dp.write(1)
    await wait(2000)

    dp.write(0)
    await wait(2000)

    connection.Disconnect()
}

function wait(ms: number) {
    return new Promise( (resolve) => {
        setTimeout(resolve, ms)
    })
}