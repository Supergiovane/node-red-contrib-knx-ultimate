**Please note**: if you use `eibd` or `knxd` as your IP router, and you have it running on the **same** box as your NodeJS app, then eibd/knxd will DROP multicast packets coming from the same source IP address. This is meant to prevent endless loops: if by error knxd is configured also as a client (that will join the same multicast group), then a multicast storm will flood your LAN. I'm sure you've experienced something similar if you take a microphone connected to an amplifier and put it near the speakers (ECHO!)

`Layer 0 [11:server/Server     7.133] Dropped(017): 06 10 05 30 00 11 29 00 BC D0 11 64 29 0F 01 00 80`

The trick here (although not entirely within the specs) is to use the loopback interface, so if you define the KNX connection address/port to `127.0.0.1:3671` then this will bypass the source address check (and happily route your packets down your USB or TPUART interface).
