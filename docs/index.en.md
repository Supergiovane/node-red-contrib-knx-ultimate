---
layout: homepage
title: KNX-Ultimate
permalink: /
lang: en
translation_key: homepage
---


<div style="margin:0 auto 48px auto;max-width:980px;padding:42px 46px;border-radius:28px;background:linear-gradient(145deg,#06182c 0%,#093253 45%,#0d4c70 100%);color:#f4fbff;box-shadow:0 28px 68px rgba(5,24,44,0.42);">
<div style="text-align:center;margin-bottom:32px;">
  <img src="{{ site.baseurl }}/logo.png" alt="KNX Ultimate logo">
</div>
  <div style="max-width:680px;margin:0 auto;text-align:center;">
    <div style="font-size:0.95rem;font-weight:700;letter-spacing:0.24em;text-transform:uppercase;margin-bottom:16px;color:#8ad8ff;">Node-RED meets KNX</div>
    <div style="font-size:2rem;font-weight:700;line-height:1.25;margin-bottom:18px;">Build professional KNX automations faster—the perfect blend of simplicity and power.</div>
    <p style="margin:0 0 22px 0;line-height:1.6;color:rgba(244,251,255,0.85);">
      KNX-Ultimate brings together the flexibility of Node-RED with enterprise-grade KNX/IP integration: secure tunnelling, routing, Hue v2, context synchronisation, watchdogs, diagnostics, and more—ready for real projects.
    </p>
    <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:12px;">
      <a href="https://www.npmjs.com/package/node-red-contrib-knx-ultimate" style="padding:12px 24px;border-radius:999px;background:#ffc439;color:#0b141f;font-weight:700;text-decoration:none;box-shadow:0 18px 30px rgba(255,196,57,0.32);">Install from npm</a>
      <a href="https://github.com/Supergiovane/node-red-contrib-knx-ultimate" style="padding:12px 24px;border-radius:999px;background:rgba(255,255,255,0.16);color:#f4fbff;font-weight:700;text-decoration:none;box-shadow:0 18px 30px rgba(0,0,0,0.22);">View on GitHub</a>
    </div>
  </div>
</div>

<div style="margin:0 auto 42px auto;max-width:880px;text-align:center;">
  <img src="{{ site.baseurl }}/assets/hero-flow.svg" alt="Sample Node-RED flow featuring KNX-Ultimate" style="width:100%;height:auto;border-radius:24px;box-shadow:0 20px 42px rgba(0,0,0,0.22);" />
</div>

<h2 style="text-align:center;">Supported technologies</h2>

<div align="center" style="margin:36px 0;">
  <div style="max-width:960px;width:100%;display:flex;flex-wrap:wrap;gap:22px;justify-content:center;">
    <div style="flex:1 1 220px;min-width:220px;padding:22px 24px;border-radius:20px;background:linear-gradient(140deg,#072b36 0%,#0c4b61 50%,#0c5f7b 100%);box-shadow:0 16px 32px rgba(7,43,54,0.32);color:#f2fbff;display:flex;flex-direction:column;">
      <div style="font-size:0.8rem;letter-spacing:0.18em;font-weight:700;text-transform:uppercase;color:rgba(255,255,255,0.68);margin-bottom:8px;">Core KNX</div>
      <div style="font-size:1.2rem;font-weight:700;margin-bottom:10px;">KNX Tunnelling</div>
      <p style="flex:1;margin:0 0 20px 0;line-height:1.55;">Native ETS-style tunnelling with automatic reconnect, multi-session safety, and high-performance telegram streaming.</p>
      <div style="display:inline-flex;align-items:center;gap:10px;padding:8px 14px;border-radius:999px;background:rgba(255,255,255,0.14);font-weight:600;">
        <span style="font-size:1.1rem;">✅</span>
        <span>Production ready</span>
      </div>
    </div>
    <div style="flex:1 1 220px;min-width:220px;padding:22px 24px;border-radius:20px;background:#ffffff;box-shadow:0 16px 32px rgba(15,40,60,0.18);color:#123042;display:flex;flex-direction:column;">
      <div style="font-size:0.8rem;letter-spacing:0.18em;font-weight:700;text-transform:uppercase;color:#1c6085;margin-bottom:8px;">Bus backbone</div>
      <div style="font-size:1.2rem;font-weight:700;margin-bottom:10px;">KNX Routing</div>
      <p style="flex:1;margin:0 0 20px 0;line-height:1.55;">Supports multicast routing across KNX/IP routers with throttling and storm protection for large sites.</p>
      <div style="display:inline-flex;align-items:center;gap:10px;padding:8px 14px;border-radius:999px;background:#c5f4df;color:#0c4631;font-weight:600;">
        <span style="font-size:1.1rem;">✅</span>
        <span>Fully supported</span>
      </div>
    </div>
    <div style="flex:1 1 220px;min-width:220px;padding:22px 24px;border-radius:20px;background:linear-gradient(135deg,#162236 0%,#20375c 48%,#274c83 100%);box-shadow:0 16px 32px rgba(22,34,54,0.34);color:#eef4ff;display:flex;flex-direction:column;">
      <div style="font-size:0.8rem;letter-spacing:0.18em;font-weight:700;text-transform:uppercase;color:rgba(255,255,255,0.62);margin-bottom:8px;">Secure transport</div>
      <div style="font-size:1.2rem;font-weight:700;margin-bottom:10px;">KNX IP Secure / Data Secure</div>
      <p style="flex:1;margin:0 0 20px 0;line-height:1.55;">Full handshake, certificate, and session key handling for both tunnelling and group-address secured payloads.</p>
      <div style="display:inline-flex;align-items:center;gap:10px;padding:8px 14px;border-radius:999px;background:rgba(255,255,255,0.18);font-weight:600;">
        <span style="font-size:1.1rem;">🔒</span>
        <span>Secure by design</span>
      </div>
    </div>
    <div style="flex:1 1 220px;min-width:220px;padding:22px 24px;border-radius:20px;background:#fff7e6;box-shadow:0 16px 32px rgba(206,145,37,0.22);color:#392400;display:flex;flex-direction:column;">
      <div style="font-size:0.8rem;letter-spacing:0.18em;font-weight:700;text-transform:uppercase;color:#e28407;margin-bottom:8px;">Lighting bridge</div>
      <div style="font-size:1.2rem;font-weight:700;margin-bottom:10px;">Philips Hue v2</div>
      <p style="flex:1;margin:0 0 20px 0;line-height:1.55;">Advanced Hue v2 API integration with scene recall, effects, gradient fixtures, and KNX/Hue state synchronization.</p>
      <div style="display:inline-flex;align-items:center;gap:10px;padding:8px 14px;border-radius:999px;background:#ffdf9b;font-weight:600;">
        <span style="font-size:1.1rem;">✅</span>
        <span>Ready today</span>
      </div>
    </div>
  </div>
</div>

<div align="center" style="margin-bottom:28px;color:#284259;font-size:0.9rem;">
  Need something not listed here? <a href="mailto:maxsupergiovane@icloud.com" style="color:#0c5f7b;font-weight:600;text-decoration:none;">Reach out</a> for roadmap requests or enterprise support.
</div>

<h2 style="text-align:center;">Node list</h2>

<div align="center" style="margin:32px 0 46px 0;">
  <div style="max-width:1040px;width:100%;display:flex;flex-wrap:wrap;gap:8px;justify-content:center;">
    <div style="flex:1 1 140px;min-width:130px;padding:12px;border-radius:10px;background:linear-gradient(135deg,#0f3f2d 0%,#11824f 45%,#1ab96b 100%);box-shadow:0 8px 16px rgba(16,60,40,0.22);color:#f2fff6;">
      <div style="font-size:0.55rem;letter-spacing:0.18em;text-transform:uppercase;color:rgba(242,255,246,0.65);font-weight:700;margin-bottom:4px;">KNX Core</div>
      <div style="font-size:1rem;font-weight:700;margin-bottom:6px;">Knx Ultimate</div>
      <p style="margin:0 0 6px 0;font-size:0.72rem;line-height:1.35;color:rgba(242,255,246,0.92);">Primary runtime node to send/receive telegrams, build virtual devices, and bridge non-KNX systems.</p>
      <a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Device" style="color:#d7ffe8;font-weight:600;text-decoration:none;font-size:0.7rem;">Documentation</a>
    </div>
    <div style="flex:1 1 140px;min-width:130px;padding:12px;border-radius:10px;background:linear-gradient(135deg,#0f3f2d 0%,#11824f 45%,#1ab96b 100%);box-shadow:0 8px 16px rgba(16,60,40,0.22);color:#f2fff6;">
      <div style="font-size:0.55rem;letter-spacing:0.18em;text-transform:uppercase;color:rgba(242,255,246,0.65);font-weight:700;margin-bottom:4px;">Configuration</div>
      <div style="font-size:1rem;font-weight:700;margin-bottom:6px;">Knx Config</div>
      <p style="margin:0 0 6px 0;font-size:0.72rem;line-height:1.35;color:rgba(242,255,246,0.92);">Stores gateway credentials and security shared by every runtime node.</p>
      <span style="color:#d7ffe8;font-weight:600;font-size:0.7rem;">Shared configuration</span>
    </div>
    <div style="flex:1 1 140px;min-width:130px;padding:12px;border-radius:10px;background:linear-gradient(135deg,#0f3f2d 0%,#11824f 45%,#1ab96b 100%);box-shadow:0 8px 16px rgba(16,60,40,0.22);color:#f2fff6;">
      <div style="font-size:0.55rem;letter-spacing:0.18em;text-transform:uppercase;color:rgba(242,255,246,0.65);font-weight:700;margin-bottom:4px;">Scenes</div>
      <div style="font-size:1rem;font-weight:700;margin-bottom:6px;">Scene Controller</div>
      <p style="margin:0 0 6px 0;font-size:0.72rem;line-height:1.35;color:rgba(242,255,246,0.92);">Recall, store, and learn scenes directly inside Node-RED.</p>
      <a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/SceneController-Configuration" style="color:#d7ffe8;font-weight:600;text-decoration:none;font-size:0.7rem;">Documentation</a>
    </div>
    <div style="flex:1 1 140px;min-width:130px;padding:12px;border-radius:10px;background:linear-gradient(135deg,#0f3f2d 0%,#11824f 45%,#1ab96b 100%);box-shadow:0 8px 16px rgba(16,60,40,0.22);color:#f2fff6;">
      <div style="font-size:0.55rem;letter-spacing:0.18em;text-transform:uppercase;color:rgba(242,255,246,0.65);font-weight:700;margin-bottom:4px;">Automation</div>
      <div style="font-size:1rem;font-weight:700;margin-bottom:6px;">Auto Responder</div>
      <p style="margin:0 0 6px 0;font-size:0.72rem;line-height:1.35;color:rgba(242,255,246,0.92);">Automatically replies to KNX read requests or keeps virtual datapoints in sync.</p>
      <a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/KNXAutoResponder/" style="color:#d7ffe8;font-weight:600;text-decoration:none;font-size:0.7rem;">Documentation</a>
    </div>
    <div style="flex:1 1 140px;min-width:130px;padding:12px;border-radius:10px;background:linear-gradient(135deg,#0f3f2d 0%,#11824f 45%,#1ab96b 100%);box-shadow:0 8px 16px rgba(16,60,40,0.22);color:#f2fff6;">
      <div style="font-size:0.55rem;letter-spacing:0.18em;text-transform:uppercase;color:rgba(242,255,246,0.65);font-weight:700;margin-bottom:4px;">Integration</div>
      <div style="font-size:1rem;font-weight:700;margin-bottom:6px;">Global Context</div>
      <p style="margin:0 0 6px 0;font-size:0.72rem;line-height:1.35;color:rgba(242,255,246,0.92);">Mirrors selected group addresses into the Node-RED global context.</p>
      <a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/GlobalVariable" style="color:#d7ffe8;font-weight:600;text-decoration:none;font-size:0.7rem;">Documentation</a>
    </div>
    <div style="flex:1 1 140px;min-width:130px;padding:12px;border-radius:10px;background:linear-gradient(135deg,#0f3f2d 0%,#11824f 45%,#1ab96b 100%);box-shadow:0 8px 16px rgba(16,60,40,0.22);color:#f2fff6;">
      <div style="font-size:0.55rem;letter-spacing:0.18em;text-transform:uppercase;color:rgba(242,255,246,0.65);font-weight:700;margin-bottom:4px;">Monitoring</div>
      <div style="font-size:1rem;font-weight:700;margin-bottom:6px;">Viewer</div>
      <p style="margin:0 0 6px 0;font-size:0.72rem;line-height:1.35;color:rgba(242,255,246,0.92);">Live dashboard to inspect telegrams and decoded values in real time.</p>
      <a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/knxUltimateViewer" style="color:#d7ffe8;font-weight:600;text-decoration:none;font-size:0.7rem;">Documentation</a>
    </div>
    <div style="flex:1 1 140px;min-width:130px;padding:12px;border-radius:10px;background:linear-gradient(135deg,#0f3f2d 0%,#11824f 45%,#1ab96b 100%);box-shadow:0 8px 16px rgba(16,60,40,0.22);color:#f2fff6;">
      <div style="font-size:0.55rem;letter-spacing:0.18em;text-transform:uppercase;color:rgba(242,255,246,0.65);font-weight:700;margin-bottom:4px;">Reliability</div>
      <div style="font-size:1rem;font-weight:700;margin-bottom:6px;">Watchdog</div>
      <p style="margin:0 0 6px 0;font-size:0.72rem;line-height:1.35;color:rgba(242,255,246,0.92);">Watches the bus, sends alerts, and can fail over to backup gateways.</p>
      <a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/WatchDog-Configuration" style="color:#d7ffe8;font-weight:600;text-decoration:none;font-size:0.7rem;">Documentation</a>
    </div>
    <div style="flex:1 1 140px;min-width:130px;padding:12px;border-radius:10px;background:linear-gradient(135deg,#0f3f2d 0%,#11824f 45%,#1ab96b 100%);box-shadow:0 8px 16px rgba(16,60,40,0.22);color:#f2fff6;">
      <div style="font-size:0.55rem;letter-spacing:0.18em;text-transform:uppercase;color:rgba(242,255,246,0.65);font-weight:700;margin-bottom:4px;">Diagnostics</div>
      <div style="font-size:1rem;font-weight:700;margin-bottom:6px;">Logger</div>
      <p style="margin:0 0 6px 0;font-size:0.72rem;line-height:1.35;color:rgba(242,255,246,0.92);">Records telegrams into ETS-friendly XML for deep troubleshooting.</p>
      <a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Logger-Configuration" style="color:#d7ffe8;font-weight:600;text-decoration:none;font-size:0.7rem;">Documentation</a>
    </div>
    <div style="flex:1 1 140px;min-width:130px;padding:12px;border-radius:10px;background:linear-gradient(135deg,#0f3f2d 0%,#11824f 45%,#1ab96b 100%);box-shadow:0 8px 16px rgba(16,60,40,0.22);color:#f2fff6;">
      <div style="font-size:0.55rem;letter-spacing:0.18em;text-transform:uppercase;color:rgba(242,255,246,0.65);font-weight:700;margin-bottom:4px;">Alerts</div>
      <div style="font-size:1rem;font-weight:700;margin-bottom:6px;">Alerter</div>
      <p style="margin:0 0 6px 0;font-size:0.72rem;line-height:1.35;color:rgba(242,255,246,0.92);">Raises visual or audio alarms when monitored addresses hit critical events.</p>
      <a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Alerter-Configuration" style="color:#d7ffe8;font-weight:600;text-decoration:none;font-size:0.7rem;">Documentation</a>
    </div>
    <div style="flex:1 1 140px;min-width:130px;padding:12px;border-radius:10px;background:linear-gradient(135deg,#0f3f2d 0%,#11824f 45%,#1ab96b 100%);box-shadow:0 8px 16px rgba(16,60,40,0.22);color:#f2fff6;">
      <div style="font-size:0.55rem;letter-spacing:0.18em;text-transform:uppercase;color:rgba(242,255,246,0.65);font-weight:700;margin-bottom:4px;">Energy</div>
      <div style="font-size:1rem;font-weight:700;margin-bottom:6px;">Load Control</div>
      <p style="margin:0 0 6px 0;font-size:0.72rem;line-height:1.35;color:rgba(242,255,246,0.92);">Coordinates heavy loads to prevent the main breaker from tripping.</p>
      <a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/LoadControl-Configuration" style="color:#d7ffe8;font-weight:600;text-decoration:none;font-size:0.7rem;">Documentation</a>
    </div>
    <div style="flex:1 1 140px;min-width:130px;padding:12px;border-radius:10px;background:linear-gradient(135deg,#0f3f2d 0%,#11824f 45%,#1ab96b 100%);box-shadow:0 8px 16px rgba(16,60,40,0.22);color:#f2fff6;">
      <div style="font-size:0.55rem;letter-spacing:0.18em;text-transform:uppercase;color:rgba(242,255,246,0.65);font-weight:700;margin-bottom:4px;">Timers</div>
      <div style="font-size:1rem;font-weight:700;margin-bottom:6px;">Staircase</div>
      <p style="margin:0 0 6px 0;font-size:0.72rem;line-height:1.35;color:rgba(242,255,246,0.92);">Smart staircase timer with fade-out and reminder options.</p>
      <a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Staircase-Configuration/" style="color:#d7ffe8;font-weight:600;text-decoration:none;font-size:0.7rem;">Documentation</a>
    </div>
    <div style="flex:1 1 140px;min-width:130px;padding:12px;border-radius:10px;background:linear-gradient(135deg,#0f3f2d 0%,#11824f 45%,#1ab96b 100%);box-shadow:0 8px 16px rgba(16,60,40,0.22);color:#f2fff6;">
      <div style="font-size:0.55rem;letter-spacing:0.18em;text-transform:uppercase;color:rgba(242,255,246,0.65);font-weight:700;margin-bottom:4px;">Entrances</div>
      <div style="font-size:1rem;font-weight:700;margin-bottom:6px;">Garage</div>
      <p style="margin:0 0 6px 0;font-size:0.72rem;line-height:1.35;color:rgba(242,255,246,0.92);">Manages gate and door logic with impulse control, feedback, and interlocks.</p>
      <a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Garage-Configuration/" style="color:#d7ffe8;font-weight:600;text-decoration:none;font-size:0.7rem;">Documentation</a>
    </div>
    <div style="flex:1 1 140px;min-width:130px;padding:12px;border-radius:10px;background:linear-gradient(135deg,#0f3f2d 0%,#11824f 45%,#1ab96b 100%);box-shadow:0 8px 16px rgba(16,60,40,0.22);color:#f2fff6;">
      <div style="font-size:0.55rem;letter-spacing:0.18em;text-transform:uppercase;color:rgba(242,255,246,0.65);font-weight:700;margin-bottom:4px;">IoT Bridge</div>
      <div style="font-size:1rem;font-weight:700;margin-bottom:6px;">IoT Bridge</div>
      <p style="margin:0 0 6px 0;font-size:0.72rem;line-height:1.35;color:rgba(242,255,246,0.92);">Transforms MQTT/REST payloads into KNX telegrams.</p>
      <a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/IoT-Bridge-Configuration/" style="color:#d7ffe8;font-weight:600;text-decoration:none;font-size:0.7rem;">Documentation</a>
    </div>
    <div style="flex:1 1 140px;min-width:130px;padding:12px;border-radius:10px;background:linear-gradient(135deg,#0f3f2d 0%,#11824f 45%,#1ab96b 100%);box-shadow:0 8px 16px rgba(16,60,40,0.22);color:#f2fff6;">
      <div style="font-size:0.55rem;letter-spacing:0.18em;text-transform:uppercase;color:rgba(242,255,246,0.65);font-weight:700;margin-bottom:4px;">Home Assistant</div>
      <div style="font-size:1rem;font-weight:700;margin-bottom:6px;">HA Translator</div>
      <p style="margin:0 0 6px 0;font-size:0.72rem;line-height:1.35;color:rgba(242,255,246,0.92);">Maps Home Assistant services to KNX group writes via flexible tables.</p>
      <a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HATranslator" style="color:#d7ffe8;font-weight:600;text-decoration:none;font-size:0.7rem;">Documentation</a>
    </div>
    <div style="flex:1 1 140px;min-width:130px;padding:12px;border-radius:10px;background:linear-gradient(135deg,#0b2d5a 0%,#1767bf 50%,#2a8dff 100%);box-shadow:0 8px 16px rgba(16,60,40,0.22);color:#f2fff6;">
      <div style="font-size:0.55rem;letter-spacing:0.18em;text-transform:uppercase;color:rgba(242,255,246,0.65);font-weight:700;margin-bottom:4px;">Hue</div>
      <div style="font-size:1rem;font-weight:700;margin-bottom:6px;">Hue Config</div>
      <p style="margin:0 0 6px 0;font-size:0.72rem;line-height:1.35;color:rgba(242,255,246,0.92);">Maintains bridge credentials and polling for every Philips Hue node.</p>
      <a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Bridge%20configuration/" style="color:#d3e7ff;font-weight:600;text-decoration:none;font-size:0.7rem;">Documentation</a>
    </div>
    <div style="flex:1 1 140px;min-width:130px;padding:12px;border-radius:10px;background:linear-gradient(135deg,#0b2d5a 0%,#1767bf 50%,#2a8dff 100%);box-shadow:0 8px 16px rgba(16,60,40,0.22);color:#f2fff6;">
      <div style="font-size:0.55rem;letter-spacing:0.18em;text-transform:uppercase;color:rgba(242,255,246,0.65);font-weight:700;margin-bottom:4px;">Hue</div>
      <div style="font-size:1rem;font-weight:700;margin-bottom:6px;">Hue Light</div>
      <p style="margin:0 0 6px 0;font-size:0.72rem;line-height:1.35;color:rgba(242,255,246,0.92);">Bi-directional Hue light control with dimming and scene support.</p>
      <a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Light/" style="color:#d3e7ff;font-weight:600;text-decoration:none;font-size:0.7rem;">Documentation</a>
    </div>
    <div style="flex:1 1 140px;min-width:130px;padding:12px;border-radius:10px;background:linear-gradient(135deg,#0b2d5a 0%,#1767bf 50%,#2a8dff 100%);box-shadow:0 8px 16px rgba(16,60,40,0.22);color:#f2fff6;">
      <div style="font-size:0.55rem;letter-spacing:0.18em;text-transform:uppercase;color:rgba(242,255,246,0.65);font-weight:700;margin-bottom:4px;">Hue</div>
      <div style="font-size:1rem;font-weight:700;margin-bottom:6px;">Hue Scene</div>
      <p style="margin:0 0 6px 0;font-size:0.72rem;line-height:1.35;color:rgba(242,255,246,0.92);">Recalls Hue scenes and mirrors their status onto KNX.</p>
      <a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Scene/" style="color:#d3e7ff;font-weight:600;text-decoration:none;font-size:0.7rem;">Documentation</a>
    </div>
    <div style="flex:1 1 140px;min-width:130px;padding:12px;border-radius:10px;background:linear-gradient(135deg,#0b2d5a 0%,#1767bf 50%,#2a8dff 100%);box-shadow:0 8px 16px rgba(16,60,40,0.22);color:#f2fff6;">
      <div style="font-size:0.55rem;letter-spacing:0.18em;text-transform:uppercase;color:rgba(242,255,246,0.65);font-weight:700;margin-bottom:4px;">Hue</div>
      <div style="font-size:1rem;font-weight:700;margin-bottom:6px;">Hue Button</div>
      <p style="margin:0 0 6px 0;font-size:0.72rem;line-height:1.35;color:rgba(242,255,246,0.92);">Transform Hue buttons into ready-to-use KNX events.</p>
      <a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Button/" style="color:#d3e7ff;font-weight:600;text-decoration:none;font-size:0.7rem;">Documentation</a>
    </div>
    <div style="flex:1 1 140px;min-width:130px;padding:12px;border-radius:10px;background:linear-gradient(135deg,#0b2d5a 0%,#1767bf 50%,#2a8dff 100%);box-shadow:0 8px 16px rgba(16,60,40,0.22);color:#f2fff6;">
      <div style="font-size:0.55rem;letter-spacing:0.18em;text-transform:uppercase;color:rgba(242,255,246,0.65);font-weight:700;margin-bottom:4px;">Hue</div>
      <div style="font-size:1rem;font-weight:700;margin-bottom:6px;">Hue Tap Dial</div>
      <p style="margin:0 0 6px 0;font-size:0.72rem;line-height:1.35;color:rgba(242,255,246,0.92);">Exposes Tap Dial rotations and button presses for scenes or dimming.</p>
      <a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Tapdial/" style="color:#d3e7ff;font-weight:600;text-decoration:none;font-size:0.7rem;">Documentation</a>
    </div>
    <div style="flex:1 1 140px;min-width:130px;padding:12px;border-radius:10px;background:linear-gradient(135deg,#0b2d5a 0%,#1767bf 50%,#2a8dff 100%);box-shadow:0 8px 16px rgba(16,60,40,0.22);color:#f2fff6;">
      <div style="font-size:0.55rem;letter-spacing:0.18em;text-transform:uppercase;color:rgba(242,255,246,0.65);font-weight:700;margin-bottom:4px;">Hue</div>
      <div style="font-size:1rem;font-weight:700;margin-bottom:6px;">Hue Motion</div>
      <p style="margin:0 0 6px 0;font-size:0.72rem;line-height:1.35;color:rgba(242,255,246,0.92);">Streams Hue motion sensor events to your KNX logic.</p>
      <a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Motion/" style="color:#d3e7ff;font-weight:600;text-decoration:none;font-size:0.7rem;">Documentation</a>
    </div>
    <div style="flex:1 1 140px;min-width:130px;padding:12px;border-radius:10px;background:linear-gradient(135deg,#0b2d5a 0%,#1767bf 50%,#2a8dff 100%);box-shadow:0 8px 16px rgba(16,60,40,0.22);color:#f2fff6;">
      <div style="font-size:0.55rem;letter-spacing:0.18em;text-transform:uppercase;color:rgba(242,255,246,0.65);font-weight:700;margin-bottom:4px;">Hue</div>
      <div style="font-size:1rem;font-weight:700;margin-bottom:6px;">Hue Camera Motion</div>
      <p style="margin:0 0 6px 0;font-size:0.72rem;line-height:1.35;color:rgba(242,255,246,0.92);">Brings Hue camera motion detection into KNX automations.</p>
      <a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Camera%20motion/" style="color:#d3e7ff;font-weight:600;text-decoration:none;font-size:0.7rem;">Documentation</a>
    </div>
    <div style="flex:1 1 140px;min-width:130px;padding:12px;border-radius:10px;background:linear-gradient(135deg,#0b2d5a 0%,#1767bf 50%,#2a8dff 100%);box-shadow:0 8px 16px rgba(16,60,40,0.22);color:#f2fff6;">
      <div style="font-size:0.55rem;letter-spacing:0.18em;text-transform:uppercase;color:rgba(242,255,246,0.65);font-weight:700;margin-bottom:4px;">Hue</div>
      <div style="font-size:1rem;font-weight:700;margin-bottom:6px;">Hue Light Sensor</div>
      <p style="margin:0 0 6px 0;font-size:0.72rem;line-height:1.35;color:rgba(242,255,246,0.92);">Publishes Hue ambient light readings for daylight-aware logic.</p>
      <a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Light%20sensor/" style="color:#d3e7ff;font-weight:600;text-decoration:none;font-size:0.7rem;">Documentation</a>
    </div>
    <div style="flex:1 1 140px;min-width:130px;padding:12px;border-radius:10px;background:linear-gradient(135deg,#0b2d5a 0%,#1767bf 50%,#2a8dff 100%);box-shadow:0 8px 16px rgba(16,60,40,0.22);color:#f2fff6;">
      <div style="font-size:0.55rem;letter-spacing:0.18em;text-transform:uppercase;color:rgba(242,255,246,0.65);font-weight:700;margin-bottom:4px;">Hue</div>
      <div style="font-size:1rem;font-weight:700;margin-bottom:6px;">Hue Temperature</div>
      <p style="margin:0 0 6px 0;font-size:0.72rem;line-height:1.35;color:rgba(242,255,246,0.92);">Shares temperature data from Hue sensors with the KNX bus.</p>
      <a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Temperature%20sensor/" style="color:#d3e7ff;font-weight:600;text-decoration:none;font-size:0.7rem;">Documentation</a>
    </div>
    <div style="flex:1 1 140px;min-width:130px;padding:12px;border-radius:10px;background:linear-gradient(135deg,#0b2d5a 0%,#1767bf 50%,#2a8dff 100%);box-shadow:0 8px 16px rgba(16,60,40,0.22);color:#f2fff6;">
      <div style="font-size:0.55rem;letter-spacing:0.18em;text-transform:uppercase;color:rgba(242,255,246,0.65);font-weight:700;margin-bottom:4px;">Hue</div>
      <div style="font-size:1rem;font-weight:700;margin-bottom:6px;">Hue Humidity</div>
      <p style="margin:0 0 6px 0;font-size:0.72rem;line-height:1.35;color:rgba(242,255,246,0.92);">Sends relative humidity from Hue environments onto KNX.</p>
      <a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Humidity%20sensor/" style="color:#d3e7ff;font-weight:600;text-decoration:none;font-size:0.7rem;">Documentation</a>
    </div>
    <div style="flex:1 1 140px;min-width:130px;padding:12px;border-radius:10px;background:linear-gradient(135deg,#0b2d5a 0%,#1767bf 50%,#2a8dff 100%);box-shadow:0 8px 16px rgba(16,60,40,0.22);color:#f2fff6;">
      <div style="font-size:0.55rem;letter-spacing:0.18em;text-transform:uppercase;color:rgba(242,255,246,0.65);font-weight:700;margin-bottom:4px;">Hue</div>
      <div style="font-size:1rem;font-weight:700;margin-bottom:6px;">Hue Contact</div>
      <p style="margin:0 0 6px 0;font-size:0.72rem;line-height:1.35;color:rgba(242,255,246,0.92);">Keeps Hue door and window contact states aligned with KNX.</p>
      <a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Contact%20sensor/" style="color:#d3e7ff;font-weight:600;text-decoration:none;font-size:0.7rem;">Documentation</a>
    </div>
    <div style="flex:1 1 140px;min-width:130px;padding:12px;border-radius:10px;background:linear-gradient(135deg,#0b2d5a 0%,#1767bf 50%,#2a8dff 100%);box-shadow:0 8px 16px rgba(16,60,40,0.22);color:#f2fff6;">
      <div style="font-size:0.55rem;letter-spacing:0.18em;text-transform:uppercase;color:rgba(242,255,246,0.65);font-weight:700;margin-bottom:4px;">Hue</div>
      <div style="font-size:1rem;font-weight:700;margin-bottom:6px;">Hue Plug</div>
      <p style="margin:0 0 6px 0;font-size:0.72rem;line-height:1.35;color:rgba(242,255,246,0.92);">Controls Hue plugs and actuators with KNX feedback.</p>
      <a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Plug/" style="color:#d3e7ff;font-weight:600;text-decoration:none;font-size:0.7rem;">Documentation</a>
    </div>
    <div style="flex:1 1 140px;min-width:130px;padding:12px;border-radius:10px;background:linear-gradient(135deg,#0b2d5a 0%,#1767bf 50%,#2a8dff 100%);box-shadow:0 8px 16px rgba(16,60,40,0.22);color:#f2fff6;">
      <div style="font-size:0.55rem;letter-spacing:0.18em;text-transform:uppercase;color:rgba(242,255,246,0.65);font-weight:700;margin-bottom:4px;">Hue</div>
      <div style="font-size:1rem;font-weight:700;margin-bottom:6px;">Hue Device SW Update</div>
      <p style="margin:0 0 6px 0;font-size:0.72rem;line-height:1.35;color:rgba(242,255,246,0.92);">Reports available firmware updates for Hue devices.</p>
      <a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Device%20software%20update/" style="color:#d3e7ff;font-weight:600;text-decoration:none;font-size:0.7rem;">Documentation</a>
    </div>
    <div style="flex:1 1 140px;min-width:130px;padding:12px;border-radius:10px;background:linear-gradient(135deg,#0b2d5a 0%,#1767bf 50%,#2a8dff 100%);box-shadow:0 8px 16px rgba(16,60,40,0.22);color:#f2fff6;">
      <div style="font-size:0.55rem;letter-spacing:0.18em;text-transform:uppercase;color:rgba(242,255,246,0.65);font-weight:700;margin-bottom:4px;">Hue</div>
      <div style="font-size:1rem;font-weight:700;margin-bottom:6px;">Hue Battery</div>
      <p style="margin:0 0 6px 0;font-size:0.72rem;line-height:1.35;color:rgba(242,255,246,0.92);">Surfaces Hue accessory battery status on KNX.</p>
      <a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Battery/" style="color:#d3e7ff;font-weight:600;text-decoration:none;font-size:0.7rem;">Documentation</a>
    </div>
    <div style="flex:1 1 140px;min-width:130px;padding:12px;border-radius:10px;background:linear-gradient(135deg,#0b2d5a 0%,#1767bf 50%,#2a8dff 100%);box-shadow:0 8px 16px rgba(16,60,40,0.22);color:#f2fff6;">
      <div style="font-size:0.55rem;letter-spacing:0.18em;text-transform:uppercase;color:rgba(242,255,246,0.65);font-weight:700;margin-bottom:4px;">Hue</div>
      <div style="font-size:1rem;font-weight:700;margin-bottom:6px;">Hue Zigbee Connectivity</div>
      <p style="margin:0 0 6px 0;font-size:0.72rem;line-height:1.35;color:rgba(242,255,246,0.92);">Monitors the Hue bridge Zigbee connection quality.</p>
      <a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Zigbee%20connectivity/" style="color:#d3e7ff;font-weight:600;text-decoration:none;font-size:0.7rem;">Documentation</a>
    </div>
  </div>
</div>

<h2 style="text-align:center;">Commercial companies using KNX-Ultimate</h2>

<p style="margin:0 auto 12px auto;max-width:780px;text-align:center;color:#32485c;">
  These companies rely on KNX-Ultimate in production environments. Want your logo here? <a href="mailto:maxsupergiovane@icloud.com" style="color:#0c5f7b;font-weight:600;text-decoration:none;">Get in touch</a>.
</p>

<div align="center" style="margin:24px auto 48px auto;max-width:860px;display:flex;flex-wrap:wrap;gap:22px;justify-content:center;">
  <a href="https://www.tervis.it" style="display:flex;align-items:center;justify-content:center;width:200px;height:110px;border-radius:18px;background:#ffffff;box-shadow:0 12px 28px rgba(15,37,56,0.16);padding:12px;">
    <img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/c/tervis.png" alt="Tervis" style="max-height:75px;">
  </a>
  <a href="http://www.knxsardegna.com" style="display:flex;align-items:center;justify-content:center;width:200px;height:110px;border-radius:18px;background:#ffffff;box-shadow:0 12px 28px rgba(15,37,56,0.16);padding:12px;">
    <img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/c/knxsardegna.png" alt="KNX Sardegna" style="max-height:75px;">
  </a>
  <a href="https://www.agatastore.it" style="display:flex;align-items:center;justify-content:center;width:200px;height:110px;border-radius:18px;background:#ffffff;box-shadow:0 12px 28px rgba(15,37,56,0.16);padding:12px;">
    <img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/c/agata.png" alt="Agata Store" style="max-height:75px;">
  </a>
  <a href="https://proknx.com" style="display:flex;align-items:center;justify-content:center;width:200px;height:110px;border-radius:18px;background:#ffffff;box-shadow:0 12px 28px rgba(15,37,56,0.16);padding:12px;">
    <img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/c/proKNX.png" alt="ProKNX" style="max-height:75px;">
  </a>
  <a href="https://altis.swiss" style="display:flex;align-items:center;justify-content:center;width:200px;height:110px;border-radius:18px;background:#ffffff;box-shadow:0 12px 28px rgba(15,37,56,0.16);padding:12px;">
    <img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/c/altis.png" alt="Altis" style="max-height:75px;">
  </a>
  <a href="https://can-nx.com/kloudnx-routeur-knx-iot-connecte-a-un-cloud-securise/" style="display:flex;align-items:center;justify-content:center;width:200px;height:110px;border-radius:18px;background:#ffffff;box-shadow:0 12px 28px rgba(15,37,56,0.16);padding:12px;">
    <img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/c/cannx.png" alt="Can'nX" style="max-height:75px;">
  </a>
  <a href="https://www.onsystem-iot.com/" style="display:flex;align-items:center;justify-content:center;width:200px;height:110px;border-radius:18px;background:#ffffff;box-shadow:0 12px 28px rgba(15,37,56,0.16);padding:12px;">
    <img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/c/innovationsystem.png" alt="Innovation System" style="max-height:75px;">
  </a>
  <a href="https://inventife.com" style="display:flex;align-items:center;justify-content:center;width:200px;height:110px;border-radius:18px;background:#ffffff;box-shadow:0 12px 28px rgba(15,37,56,0.16);padding:12px;">
    <img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/c/inventife.png" alt="Inventife" style="max-height:75px;">
  </a>
</div>

<h2 style="text-align:center;">Friendly communities around the world</h2>

<div align="center" style="margin:24px auto 48px auto;max-width:880px;display:flex;flex-wrap:wrap;gap:22px;justify-content:center;">
  <div style="flex:1 1 240px;min-width:240px;padding:24px;border-radius:18px;background:#ffffff;box-shadow:0 12px 28px rgba(15,37,56,0.12);text-align:center;border:1px solid rgba(15,37,56,0.08);">
    <div style="margin-bottom:14px;">
      <a href="https://www.facebook.com/groups/viveresmart">
        <img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/c/viveresmart.png" alt="VivereSmart" height="68">
      </a>
    </div>
    <div style="font-weight:700;font-size:1.1rem;color:#17364a;margin-bottom:6px;">Italy · VivereSmart</div>
    <div style="font-size:0.95rem;color:#334155;line-height:1.5;">
      <a href="https://www.facebook.com/groups/viveresmart">Community</a> ·
      <a href="https://www.youtube.com/channel/UC6GlFhcbNuoSEejZ_HlCynA">VivereSmart TV</a>
    </div>
  </div>
  <div style="flex:1 1 240px;min-width:240px;padding:24px;border-radius:18px;background:#ffffff;box-shadow:0 12px 28px rgba(15,37,56,0.12);text-align:center;border:1px solid rgba(15,37,56,0.08);">
    <div style="margin-bottom:14px;">
      <a href="https://knx-user-forum.de/forum/öffentlicher-bereich/knx-eib-forum/1389088-knx-node-for-node-red">
        <img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/c/knxuserforum.png" alt="KNX User Forum" height="68">
      </a>
    </div>
    <div style="font-weight:700;font-size:1.1rem;color:#17364a;margin-bottom:6px;">Germany · KNX User Forum</div>
    <div style="font-size:0.95rem;color:#334155;line-height:1.5;">
      <a href="https://knx-user-forum.de/forum/öffentlicher-bereich/knx-eib-forum/1389088-knx-node-for-node-red">Visit the discussion</a>
    </div>
  </div>
  <div style="flex:1 1 240px;min-width:240px;padding:24px;border-radius:18px;background:#ffffff;box-shadow:0 12px 28px rgba(15,37,56,0.12);text-align:center;border:1px solid rgba(15,37,56,0.08);">
    <div style="margin-bottom:14px;">
      <img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/c/qq.svg" alt="QQ Group" height="68">
    </div>
    <div style="font-weight:700;font-size:1.1rem;color:#17364a;margin-bottom:6px;">China · QQ Group</div>
    <div style="font-size:0.95rem;color:#334155;line-height:1.5;">
      <a href="tencent://groupwpa/?subcmd=all&param=7b2267726f757055696e223a3833373537393231392c2274696d655374616d70223a313633303934363639312c22617574684b6579223a22762b72482b466f4a496a75613033794e4a30744a6970756c55753639424f4d55724f464c4a6c474b77346a30326b7a4f7a3338535536517844684d7756414d62222c2261757468223a22227d&jump_from=">QQ group 837579219</a>
    </div>
  </div>
</div>

<h2 style="text-align:center;">Support the project</h2>

<div align="center" style="margin:46px 0;">
  <div style="max-width:760px;width:100%;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:28px;padding:34px 36px;border-radius:24px;background:linear-gradient(145deg,#101b29 0%,#162b3d 55%,#21445f 100%);box-shadow:0 20px 42px rgba(0,0,0,0.28);color:#f0f7ff;text-align:left;">
    <div style="flex:0 0 180px;text-align:center;">
      <img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/CodiceQR.png" alt="Support via PayPal - QR code" style="width:170px;border-radius:18px;background:#ffffff;padding:14px;box-shadow:0 12px 30px rgba(14,32,46,0.35);" />
      <div style="font-size:0.75rem;margin-top:10px;color:rgba(240,247,255,0.7);">Scan with your phone</div>
    </div>
    <div style="max-width:420px;">
      <div style="font-size:0.95rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;margin-bottom:10px;color:#8ce3ff;">Support the project</div>
      <div style="font-size:1.45rem;font-weight:700;line-height:1.35;margin-bottom:14px;">Help KNX-Ultimate stay fast, reliable, and up to date.</div>
      <p style="margin:0 0 16px 0;line-height:1.6;color:rgba(240,247,255,0.82);">
        Your donation funds new hardware test benches, multilingual documentation, and the countless hours spent keeping releases rock solid. If KNX-Ultimate saves you time on the job, consider giving back—even a small tip keeps the project healthy.
      </p>
      <a href="https://www.paypal.com/donate/?hosted_button_id=S8SKPUBSPK758" style="display:inline-flex;align-items:center;gap:12px;padding:13px 26px;border-radius:999px;background:#ffc439;color:#111;font-weight:700;text-decoration:none;box-shadow:0 14px 28px rgba(255,196,57,0.35);">
        <span style="font-size:1.05rem;">Support via PayPal</span>
      </a>
    </div>
  </div>
</div>



<div align="center" style="margin:42px 0;">
  <div style="max-width:860px;width:100%;display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:30px;padding:34px 36px;border-radius:22px;background:linear-gradient(135deg,#008C45 0%,#f5f8f6 55%,#CD212A 100%);box-shadow:0 20px 42px rgba(0,0,0,0.16);">
    <div style="display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.9);border-radius:18px;padding:18px 24px;box-shadow:0 10px 26px rgba(0,0,0,0.18);">
      <img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/flags/madeinitaly.png" alt="Made in Italy" style="max-height:120px;">
    </div>
    <div style="max-width:420px;text-align:left;color:#0b1f2c;">
      <div style="font-size:0.9rem;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;margin-bottom:10px;color:#0b3b22;">Made in Italy</div>
      <div style="font-size:1.35rem;font-weight:700;line-height:1.35;margin-bottom:12px;">Designed, engineered, and supported in Modena.</div>
      <p style="margin:0 0 16px 0;line-height:1.55;">
        KNX-Ultimate is crafted with Italian passion for detail and reliability. Every release is hand-tested on real installations, combining craftsmanship with a certified KNX workflow you can trust in mission-critical projects.
      </p>
      <div style="display:flex;align-items:center;gap:12px;">
        <img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/KNX_CERTI_MARK_RGB.jpg" alt="Authorized KNX partner" style="height:70px;border-radius:12px;background:#ffffff;padding:10px;box-shadow:0 6px 18px rgba(11,31,44,0.22);">
        <div style="font-size:0.85rem;line-height:1.4;color:#15323f;">
          Authorized KNX logo by KNX Association*<br/>
          Officially recognized for compliant KNX integrations.
        </div>
      </div>
    </div>
  </div>
</div>

<p align="center"><em>*The author <strong>Massimo Saccani</strong> has been authorized to use the KNX logo.<br/>Forks of the knx-ultimate node are not implicitly allowed to use the KNX logo.</em></p>

---

[View the KNX-Ultimate source code](https://github.com/Supergiovane/node-red-contrib-knx-ultimate) • [npm package](https://www.npmjs.com/package/node-red-contrib-knx-ultimate)
