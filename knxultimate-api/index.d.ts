/// <reference types="node" />

import * as events from 'events'

type HandlersSpec = {
    connected?: () => void,
    event?: (evt: string, src: KnxDeviceAddress, dest: KnxGroupAddress, value: Buffer ) => void,
    error?: (connstatus: any) => void
}

type ConnectionSpec = {
    ipAddr?: string,
    ipPort?: number,
    interface?: string,
    physAddr?: string,
    debug?: boolean,
    manualConnect?: true,
    minimumDelay?: number,
    handlers: HandlersSpec,
}

type KnxDeviceAddress = string

type KnxGroupAddress = string

// The type of the KnxValue depends on the DPT that it is associated with
type KnxValue = number|string|boolean|Date

// Possible formats "X" or "X.Y", i.e. "1" or "1.001"
type DPT = string

type DatapointOptions = {
    ga: KnxGroupAddress,
    dpt: DPT
}

interface DatapointEvent {
    on( event: 'change', listener: (old_value: KnxValue, new_value: KnxValue) => void): this
    on(event: string, listener: Function): this
}

declare module 'knx' {
    export interface IConnection extends events.EventEmitter {
        debug: boolean
        Disconnect(): void
        read( ga: KnxGroupAddress, cb?: (value: Buffer) => void ): void
        write( ga: KnxGroupAddress, value: Buffer, dpt: DPT, cb?: () => void): void
    }

    export class Connection extends events.EventEmitter implements IConnection {
        public debug: boolean
        constructor( conf: ConnectionSpec )
        Disconnect(): void
        read( ga: KnxGroupAddress, cb?: (value: Buffer) => void ): void
        write( ga: KnxGroupAddress, value: Buffer, dpt: DPT, cb?: () => void): void
        writeRaw( ga: KnxGroupAddress, value: Buffer, bitlength?: number, cb?: () => void): void
    }

    export class Datapoint extends events.EventEmitter implements DatapointEvent {
        readonly current_value: KnxValue
        readonly dptid: DPT

        constructor(options: DatapointOptions, conn?: IConnection)
        bind(conn: Connection): void
        write(value: KnxValue): void
        read(callback?: (src: KnxDeviceAddress, value: KnxValue) => void): void
    }
}
