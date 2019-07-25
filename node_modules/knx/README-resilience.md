## And why should I bother?

The main cause for writing my own KNX protocol stack is that I couldn't find a *robust* access layer that properly handles state management.
Connections tend to fail all the time; consider flakey Wi-Fi, RRR's (Recalcitrant Rebooting Routers), bad karma, it happens all the time. A KNX access layer should be *resilient* and be able to recover if needed.

Also, although seemingly innocent, the consecutive calls to *read()* and then *write()* on the same group address will either *confuse* your KNX IP router, or *return incoherent results*.
KNXnet/IP uses **UDP** sockets, which is not ideal from a programmer's perspective. Packets can come and go in any order; very few libraries offer the robustness to reconcile state and ensure a **steady and reliable connection**.

This library is, to the best of my knowledge, the only one that can handle the *serialisation* of tunneling requests in a way that your program will have a *robust and reliable* KNX connection. Try toggling your Wi-Fi or disconnect your Ethernet cable while you're connected; the library will detect this and reconnect when network access is restored :)

```
27 Oct 15:44:24 - [info] Started flows
27 Oct 15:44:24 - [info] [knx-controller:9ab91ab8.547938] KNX: successfully connected to 224.0.23.12:3671
27 Oct 15:44:24 - [info] [knx-controller:9ab91ab8.547938] GroupValue_Read {"srcphy":"15.15.15","dstgad":"0/0/15"}
...
27 Oct 15:44:54 - [info] [knx-controller:9ab91ab8.547938] KNX Connection Error: timed out waiting for CONNECTIONSTATE_RESPONSE
27 Oct 15:45:36 - [info] [knx-controller:9ab91ab8.547938] KNX: successfully connected to 224.0.23.12:3671
27 Oct 15:45:36 - [info] [knx-in:input] GroupValue_Read {"srcphy":"15.15.15","dstgad":"0/0/15"}
```


## A note on resilience

There are basically *two* ways to talk to KNX via UDP/IP:

- **Tunneling** is effectively UDP **unicast** with connection state (essentially mimicking TCP), thus we get to make a CONNECT_REQUEST to establish a session id with the router or interface. This enables us to periodically check on the connection's health (with CONNECTIONSTATE_REQUESTs) and handle retries, acknowledgements etc. The disadvantage here is that KNXnet/IP lacks a service discovery mechanism, thus you need to specify the router/interface endpoint IP address and port.

- **Routing** is a plain UDP multicast transport *without any connection or reliability semantics whatsoever* - which makes it much harder to detect dropped packets eg due to congested networks. The multicast approach works well on wired high-speed (eg Ethernet) segments that are dedicated to KNX traffic only. As we all know, KNX/TP1 has a bandwidth that is several orders of magnitude slower than a LAN, but this isn't necessarily the case when you connect over a VPN! *In reality, your network is definately going to drop some packets*. The advantage of multicast though is that it needs no configuration, as long as the IP router is configured to the default KNX multicast address (224.0.23.12)

- Finally, this library allows a **hybrid** approach, that's taking the best of the two methods above: You can use **multicast** transport with a **tunnelling** connection to ensure reliable communication. *Unfortunately this deviates from the official KNXnet/IP spec*, and is therefore not compatible with some IP routers. You can enable this "hybrid mode" by enabling the `forceTunneling` option when constructing a new Connection object as follows:

```js
var connection = new knx.Connection( {
  // use tunneling with multicast - this is NOT supported by all routers!
  forceTunneling: true,
...
});
```
