![Logo](img/logo-big.png)

<br/>

[![NPM version][npm-version-image]][npm-url]
[![NPM downloads per month][npm-downloads-month-image]][npm-url]
[![NPM downloads total][npm-downloads-total-image]][npm-url]
[![MIT License][license-image]][license-url]
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Youtube][youtube-image]][youtube-url]


![Sample Node](img/readmemain.png)


<p align='center'>
<img width="110px" src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/KNX_CERTI_MARK_RGB.jpg" ></br>
<span style="font-size:0.7em;color:grey;">Authorized KNX logo by the KNX Association*</span>
</p>

</br>

**You can use it immediately!**

```javascript

msg.payload = true // Turn light on
msg.payload = {red:255, green:200, blue:30} // Put some colors in our life

```

<br/>

> [!TIP]
> I invest a lot of effort, money, and free time into this node, so please consider [making a small donation](https://www.paypal.com/donate/?hosted_button_id=S8SKPUBSPK758) if you're using KNX-Ultimate. Thank you!

<br/>

## SUPPORTED TECHNOLOGIES

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


## DOCUMENTATION

* [Documentation](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Home)
* [FAQ + Troubleshoot](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/FAQ-Troubleshoot)
* [Security best practices](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/SECURITY)
* <a href="https://www.youtube.com/@maxsupervibe" target="_blank"> <img width="30px" src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/youtube-logo.jpeg" ></a> Subscribe to my [YouTube channel](https://www.youtube.com/@maxsupervibe) and watch the node in action. 

<br/>
<br/>

## NODE LIST

**Core KNX nodes**

- **KNX Ultimate** - [docs](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Device). The primary node for interacting with your KNX installation. Send and receive telegrams, create virtual group addresses, and bridge non‑KNX devices into your bus with an intuitive, highly configurable interface.
- **KNX Config** - Shared configuration for gateways, security settings, and bus parameters used by every runtime node.
- **Scene Controller** - [docs](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/SceneController-Configuration). Recall, store, and manage scenes exactly as a hardware KNX scene keypad would, including optional learn buttons from the flow.
- **Auto Responder** - Automatically answers KNX read requests (ideal for virtual devices or when you need deterministic status values).
- **Global Context** - [docs](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/GlobalVariable). Mirrors selected group addresses into Node-RED’s global context for easy use inside function nodes and custom logic.
- **Viewer** - [docs](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/knxUltimateViewer). Dashboard widget that shows live KNX group address activity and values.

**Automation, safety, and diagnostics**

- **Watchdog** - [docs](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/WatchDog-Configuration). Monitors bus availability, triggers notifications (e-mail, Telegram, Alexa, Siri, Sonos, …), and can automatically fail over to a backup KNX/IP router or reconnect on demand.
- **Logger** - [docs](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Logger-Configuration). Captures telegrams into an ETS‑compatible XML log for in-depth diagnostics (note: KNX/IP interfaces do not report KNX-Ultimate telegrams).
- **Alerter** - [docs](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Alerter-Configuration). Raises visual or audio alerts (for instance with node-red-contrib-tts-ultimate) when monitored addresses signal an alarm condition.
- **Load Control** - [docs](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/LoadControl-Configuration). Supervises energy usage (oven, washing machine, EV charger…) and sheds loads before the main breaker trips.
- **Staircase** - Automates staircase lighting timers with configurable fade and reminder options.
- **Garage** - Manages garage door or gate logic, including impulse control, status feedback, and safety interlocks.

**IoT integrations**

- **IoT Bridge** - Bridges MQTT/REST devices with KNX, handling payload translations so non‑KNX equipment becomes bus-aware.
- **Home Assistant Translator** - [docs](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HATranslator). Converts Home Assistant service payloads to KNX telegrams using a built-in, user-editable mapping table.

**Philips Hue nodeset** - [guide](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Bridge%20configuration)  
Use the dedicated Hue config node plus the following device nodes to mirror Hue state into KNX and vice versa:

- **Hue Light** - Bi-directional light control with day/night scenes, dimming curves, and tunable white.
- **Hue Button** - Listens to Hue Tap Dial/Dimmer button presses and emits KNX-friendly events.
- **Hue Motion**, **Hue Camera Motion** - Motion detection with daylight filters and occupancy timers.
- **Hue Tap Dial** - Exposes dial rotation and button presses for scene selection or dimming.
- **Hue Light Sensor**, **Hue Temperature Sensor**, **Hue Humidity Sensor** - Publishes environmental readings to KNX.
- **Hue Scene** - Activates Hue scenes and optionally synchronises the status back to KNX.
- **Hue Battery** - Reports battery percentage for Zigbee accessories.
- **Hue Zigbee Connectivity** - Monitors Zigbee connectivity status and signal quality.
- **Hue Plug** - Controls smart plugs/outlets through KNX telegrams.
- **Hue Contact Sensor** - Mirrors door/window contact states.
- **Hue Device Software Update** - Tracks and exposes firmware update availability for Hue devices.

**Additional utility nodes**

- **Hue Config** - Stores bridge credentials and polling intervals for the Hue nodes.
- **KNX/IP Router & Interface config** - Define multiple secure or plain gateways that any runtime node can reuse.

Each node links to detailed wiki documentation with configuration hints, sample payloads, and best practices.

<br>

## CHANGELOG

* <a href="https://github.com/Supergiovane/node-red-contrib-knx-ultimate/blob/master/CHANGELOG.md">CHANGELOG</a>



## WORKING WITH ETS CSV OR ESF FILES

<div align="center" style="margin:40px 0;">
  <div style="max-width:940px;width:100%;display:flex;flex-wrap:wrap;gap:32px;align-items:center;justify-content:center;padding:38px 42px;border-radius:26px;background:linear-gradient(135deg,#f2f8ff 0%,#dbe9ff 55%,#c9dfff 100%);box-shadow:0 20px 42px rgba(16,38,60,0.16);color:#0f2538;">
    <div style="flex:0 0 170px;display:flex;align-items:center;justify-content:center;">
      <div style="width:150px;height:150px;border-radius:28px;background:linear-gradient(135deg,#002d62,#005b96);display:flex;align-items:center;justify-content:center;color:#ffffff;font-size:2.4rem;font-weight:800;letter-spacing:0.08em;box-shadow:0 14px 32px rgba(0,45,98,0.35);">
        ETS
      </div>
    </div>
    <div style="flex:1 1 320px;text-align:left;">
      <div style="font-size:0.9rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;margin-bottom:12px;color:#0b3b6b;">Import once, stay synchronized</div>
      <div style="font-size:1.45rem;font-weight:700;line-height:1.3;margin-bottom:16px;">Drop your ETS export and let KNX-Ultimate map datapoints, descriptions, and group addresses for you.</div>
      <ul style="padding:0;margin:0;list-style:none;line-height:1.55;">
        <li style="display:flex;gap:12px;margin-bottom:10px;">
          <span style="font-size:1.2rem;">✅</span>
          <span>Universal mode becomes a single I/O node that knows every address, so your flows stay clean and scalable.</span>
        </li>
        <li style="display:flex;gap:12px;margin-bottom:10px;">
          <span style="font-size:1.2rem;">✅</span>
          <span>Outgoing payloads are automatically encoded with the right datapoint type before hitting the bus.</span>
        </li>
        <li style="display:flex;gap:12px;margin-bottom:0;">
          <span style="font-size:1.2rem;">✅</span>
          <span>Incoming telegrams are decoded into readable values with the names and notes you already maintain in ETS.</span>
        </li>
      </ul>
    </div>
  </div>
</div>

<div align="center" style="margin:0 0 32px 0;">
  <div style="max-width:900px;width:100%;display:flex;flex-wrap:wrap;gap:18px;justify-content:center;">
    <div style="flex:1 1 240px;min-width:240px;padding:20px;border-radius:18px;background:#112d44;color:#f0f7ff;box-shadow:0 16px 32px rgba(17,45,68,0.22);text-align:left;">
      <div style="font-size:0.85rem;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;margin-bottom:8px;color:#8ce3ff;">Quick start</div>
      <ol style="margin:0;padding-left:20px;line-height:1.6;">
        <li>In ETS, export your project as CSV or ESF.</li>
        <li>Open the KNX-Ultimate config node and paste the file contents into the <em>ETS import</em> field.</li>
        <li>Set the runtime node to <strong>Universal mode</strong> and deploy&mdash;no extra nodes required.</li>
      </ol>
    </div>
    <div style="flex:1 1 240px;min-width:240px;padding:20px;border-radius:18px;background:#ffffff;box-shadow:0 12px 28px rgba(15,40,60,0.14);text-align:left;color:#14324a;">
      <div style="font-size:0.85rem;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;margin-bottom:10px;color:#1d4b72;">See it in action</div>
      <p style="margin:0 0 16px 0;line-height:1.55;">Watch how the universal node reads an ETS export and starts driving a full project in minutes.</p>
      <a href="https://youtu.be/egRbR_KwP9I" target="_blank" style="display:inline-flex;align-items:center;gap:10px;padding:11px 20px;border-radius:12px;background:#1d4b72;color:#ffffff;font-weight:600;text-decoration:none;box-shadow:0 12px 24px rgba(29,75,114,0.3);">▶️ Watch the quick demo</a>
    </div>
  </div>
</div>

<div align="center" style="margin:0 0 28px 0;">
  <div style="max-width:920px;width:100%;display:flex;flex-wrap:wrap;gap:22px;justify-content:center;">
    <details style="flex:1 1 320px;min-width:300px;padding:22px;border-radius:18px;background:#0f2538;color:#f0f7ff;box-shadow:0 12px 28px rgba(15,37,56,0.22);">
      <summary style="cursor:pointer;font-size:1rem;font-weight:700;">Sample ETS CSV (copy &amp; paste)</summary>
      <p style="margin:14px 0 16px 0;color:rgba(240,247,255,0.78);">Copy/Paste this into your configuration node.</p>
      <pre style="margin:0;max-height:280px;overflow:auto;background:#06182c;border-radius:12px;padding:14px;font-size:0.85rem;line-height:1.45;"><code>"Group name"	"Address"	"Central"	"Unfiltered"	"Description"	"DatapointType"	"Security"
"Attuatori luci"	"0/-/-"	""	""	"Attuatori luci"	""	"Auto"
"Luci primo piano"	"0/0/-"	""	""	"Luci primo piano"	""	"Auto"
"Camera da letto luce"	"0/0/1"	""	""	"Camera da letto luce"	"DPST-1-8"	"Auto"
"Loggia camera da letto"	"0/0/2"	""	""	"Loggia camera da letto"	"DPST-1-1"	"Auto"
"Camera armadi luce"	"0/0/3"	""	""	"Camera armadi luce"	"DPST-1-1"	"Auto"
"Bagno grande luce"	"0/0/4"	""	""	"Bagno grande luce"	"DPST-1-1"	"Auto"
"Loggia bagno grande"	"0/0/5"	""	""	"Loggia bagno grande"	"DPST-1-1"	"Auto"
"Bagno grande specchio (switch)"	"0/0/6"	""	""	"Bagno grande specchio switch"	"DPST-1-1"	"Auto"
"Lavanderia luce"	"0/0/7"	""	""	"Lavanderia luce"	"DPST-1-1"	"Auto"
"Lavanderia specchio (switch)"	"0/0/8"	""	""	"Lavanderia specchio switch"	"DPST-1-1"	"Auto"
"Studio luce"	"0/0/9"	""	""	"Studio luce"	"DPST-1-1"	"Auto"
"Soggiorno luce (switch)"	"0/0/10"	""	""	"Soggiorno luce switch"	"DPST-1-1"	"Auto"
"Soggiorno aplique (switch)"	"0/0/11"	""	""	"Soggiorno aplique switch"	"DPST-1-1"	"Auto"
"Loggia soggiorno cucina"	"0/0/12"	""	""	"Loggia soggiorno-cucina"	"DPST-1-1"	"Auto"
"Cucina luce"	"0/0/13"	""	""	"Cucina luce"	"DPT-1"	"Auto"
"Cucina luce pensili"	"0/0/14"	""	""	"Cucina luce pensili"	"DPT-1"	"Auto"
"Corridoio luce"	"0/0/15"	""	""	"Corridoio luce"	"DPST-1-1"	"Auto"
"Scala LED"	"0/0/16"	""	""	"Scala LED"	"DPST-1-1"	"Auto"
"Soggiorno aplique brighness value"	"0/0/17"	""	""	""	"DPST-5-1"	"Auto"
"Bagno grande specchio (dim)"	"0/0/18"	""	""	"Bagno grande specchio dim"	"DPST-3-7"	"Auto"
"Soggiorno luce brighness value"	"0/0/19"	""	""	""	"DPST-5-1"	"Auto"
"Lavanderia specchio (dim)"	"0/0/20"	""	""	"Lavanderia specchio dim"	"DPST-3-7"	"Auto"
"Scala LED cambiacolori RGB"	"0/0/21"	""	""	""	"DPST-1-1"	"Auto"
"Bagno grande specchio brightness value"	"0/0/22"	""	""	""	"DPST-5-1"	"Auto"
"Soggiorno luce (dim)"	"0/0/23"	""	""	"Soggiorno luce dim"	"DPST-3-7"	"Auto"</code></pre>
    </details>
    <details style="flex:1 1 320px;min-width:300px;padding:22px;border-radius:18px;background:#ffffff;color:#14324a;box-shadow:0 12px 28px rgba(15,37,56,0.18);">
      <summary style="cursor:pointer;font-size:1rem;font-weight:700;">Sample ETS ESF (copy &amp; paste)</summary>
      <p style="margin:14px 0 16px 0;color:rgba(20,50,74,0.75);">Copy/Paste this into your configuration node.</p>
      <pre style="margin:0;max-height:280px;overflow:auto;background:#0c1c2b;border-radius:12px;padding:14px;font-size:0.85rem;line-height:1.45;color:#b5d7ff;"><code>My beautiful home
Attuatori luci.Luci primo piano.0/0/1	Luce camera da letto	EIS 1 'Switching' (1 Bit)	Low	
Attuatori luci.Luci primo piano.0/0/2	Luce loggia camera da letto	EIS 1 'Switching' (1 Bit)	Low	
Attuatori luci.Luci primo piano.0/0/3	Luce camera armadi	EIS 1 'Switching' (1 Bit)	Low	
Attuatori luci.Luci primo piano.0/0/4	Luce bagno grande	EIS 1 'Switching' (1 Bit)	Low	
Attuatori luci.Luci primo piano.0/0/5	Luce loggia bagno grande	EIS 1 'Switching' (1 Bit)	Low	
Attuatori luci.Luci primo piano.0/0/6	Luce specchio bagno grande (switch)	EIS 1 'Switching' (1 Bit)	Low	
Attuatori luci.Luci primo piano.0/0/7	Luce lavanderia	EIS 1 'Switching' (1 Bit)	Low	
Attuatori luci.Luci primo piano.0/0/8	Luce specchio lavanderia (switch)	EIS 1 'Switching' (1 Bit)	Low	
Attuatori luci.Luci primo piano.0/0/9	Luce studio	EIS 1 'Switching' (1 Bit)	Low	
Attuatori luci.Luci primo piano.0/0/10	Plafoniera soggiorno (switch)	EIS 1 'Switching' (1 Bit)	Low	
Attuatori luci.Luci primo piano.0/0/11	Applique soggiorno (switch)	EIS 1 'Switching' (1 Bit)	Low	
Attuatori luci.Luci primo piano.0/0/12	Luce loggia soggiorno cucina	EIS 1 'Switching' (1 Bit)	Low	
Attuatori luci.Luci primo piano.0/0/13	Luce cucina	EIS 1 'Switching' (1 Bit)	Low	
Attuatori luci.Luci primo piano.0/0/14	Pensili cucina	EIS 1 'Switching' (1 Bit)	Low	
Attuatori luci.Luci primo piano.0/0/15	Luce corridoio	EIS 1 'Switching' (1 Bit)	Low	
Attuatori luci.Luci primo piano.0/0/16	LED scala	EIS 1 'Switching' (1 Bit)	Low	
Attuatori luci.Luci primo piano.0/0/18	Luce specchio bagno grande(dim)	EIS 2 'Dimming - control' (4 Bit)	Low	
Attuatori luci.Luci primo piano.0/0/20	Luce specchio lavanderia (dim)	EIS 2 'Dimming - control' (4 Bit)	Low	
Attuatori luci.Luci primo piano.0/0/23	Plafoniera soggiorno (dim)	EIS 2 'Dimming - control' (4 Bit)	Low	
Attuatori luci.Luci primo piano.0/0/24	Applique soggiorno (dim)	EIS 2 'Dimming - control' (4 Bit)	Low	
Attuatori luci.Luci primo piano.0/0/17	Applique soggiorno brighness value	Uncertain (1 Byte)	Low	
Attuatori luci.Luci primo piano.0/0/19	Plafoniera soggiorno brighness value	Uncertain (1 Byte)	Low	
Attuatori luci.Luci primo piano.0/0/21	LED cambiacolori RGB scala	EIS 1 'Switching' (1 Bit)	Low	</code></pre>
    </details>
  </div>
</div>

<br/>




## COMMERCIAL COMPANIES USING KNX-ULTIMATE
The following commercial companies asked be mentioned on this page.  
Do you want to be listed as well? Send an email to maxsupergiovane@icloud.com.

<br/>

<div align="center">
  <a href="https://www.tervis.it" style="display:inline-block; margin:14px;">
    <img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/c/tervis.png" alt="Tervis" height="75" />
  </a>
  <a href="http://www.knxsardegna.com" style="display:inline-block; margin:14px;">
    <img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/c/knxsardegna.png" alt="KNX Sardegna" height="75" />
  </a>
  <a href="https://www.agatastore.it" style="display:inline-block; margin:14px;">
    <img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/c/agata.png" alt="Agata Store" height="75" />
  </a>
  <a href="https://proknx.com" style="display:inline-block; margin:14px;">
    <img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/c/proKNX.png" alt="ProKNX" height="75" />
  </a>
  <a href="https://altis.swiss" style="display:inline-block; margin:14px;">
    <img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/c/altis.png" alt="Altis" height="75" />
  </a>
  <a href="https://can-nx.com/kloudnx-routeur-knx-iot-connecte-a-un-cloud-securise/" style="display:inline-block; margin:14px;">
    <img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/c/cannx.png" alt="Can'nX" height="75" />
  </a>
  <a href="https://www.onsystem-iot.com/" style="display:inline-block; margin:14px;">
    <img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/c/innovationsystem.png" alt="Innovation System" height="75" />
  </a>
  <a href="https://inventife.com" style="display:inline-block; margin:14px;">
    <img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/c/inventife.png" alt="Inventife" height="75" />
  </a>
</div>

<br/>


## FRIENDLY COMMUNITIES AROUND THE WORLD

<div align="center">
  <div style="display:inline-block; margin:12px 20px; text-align:center;">
    <a href="https://www.facebook.com/groups/viveresmart" style="display:inline-block; margin-bottom:6px;">
      <img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/c/viveresmart.png" alt="VivereSmart" height="70" />
    </a>
    <div><strong>Italy</strong></div>
    <div><a href="https://www.facebook.com/groups/viveresmart">Community</a> · <a href="https://www.youtube.com/channel/UC6GlFhcbNuoSEejZ_HlCynA">VivereSmart TV</a></div>
  </div>
  <div style="display:inline-block; margin:12px 20px; text-align:center;">
    <a href="https://knx-user-forum.de/forum/öffentlicher-bereich/knx-eib-forum/1389088-knx-node-for-node-red" style="display:inline-block; margin-bottom:6px;">
      <img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/c/knxuserforum.png" alt="KNX User Forum" height="70" />
    </a>
    <div><strong>Germany</strong></div>
    <div><a href="https://knx-user-forum.de/forum/öffentlicher-bereich/knx-eib-forum/1389088-knx-node-for-node-red">KNX User Forum</a></div>
  </div>
  <div style="display:inline-block; margin:12px 20px; text-align:center;">
    <div style="display:inline-block; margin-bottom:6px;">
      <img src="./img/c/qq.svg" alt="QQ Group" height="70" />
    </div>
    <div><strong>China</strong></div>
    <div><a href="tencent://groupwpa/?subcmd=all&param=7b2267726f757055696e223a3833373537393231392c2274696d655374616d70223a313633303934363639312c22617574684b6579223a22762b72482b466f4a496a75613033794e4a30744a6970756c55753639424f4d55724f464c4a6c474b77346a30326b7a4f7a3338535536517844684d7756414d62222c2261757468223a22227d&jump_from=">QQ group: 837579219</a></div>
  </div>
</div>

<br/>

A big THANK YOU to [@svenflender](https://github.com/svenflender) for the logo and icon graphics!
<br/>

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
        Your donation funds new hardware test benches, multilingual documentation, and the countless hours spent keeping releases rock solid. If KNX-Ultimate saves you time on the job, consider giving back&mdash;even a small tip keeps the project healthy.
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
      <img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/flags/madeinitaly.png" alt="Made in Italy" height="120">
    </div>
    <div style="max-width:420px;text-align:left;color:#0b1f2c;">
      <div style="font-size:0.9rem;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;margin-bottom:10px;color:#0b3b22;">Made in Italy</div>
      <div style="font-size:1.35rem;font-weight:700;line-height:1.35;margin-bottom:12px;">Designed, engineered, and supported in Italy.</div>
      <p style="margin:0 0 16px 0;line-height:1.55;">
        KNX-Ultimate is crafted with Italian passion for detail and reliability. Every release is hand-tested on real installations, combining craftsmanship with a certified KNX workflow.
      </p>
      <div style="display:flex;align-items:center;gap:12px;">
        <img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/KNX_CERTI_MARK_RGB.jpg" alt="Authorized KNX partner" height="70" style="border-radius:12px;background:#ffffff;padding:10px;box-shadow:0 6px 18px rgba(11,31,44,0.22);">
        <div style="font-size:0.85rem;line-height:1.4;color:#15323f;">
          Authorized KNX logo by KNX Association*<br/>
          Officially recognized for compliant KNX integrations.
        </div>
      </div>
    </div>
  </div>
</div>
<p align="center"><em>*The author <strong>Massimo Saccani</strong> has been authorized to use the KNX logo.<br/>Forks of the knx-ultimate node are not implicitly allowed to use the KNX logo.</em></p>





[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: https://github.com/Supergiovane/node-red-contrib-knx-ultimate/master/LICENSE
[npm-url]: https://npmjs.org/package/node-red-contrib-knx-ultimate
[npm-version-image]: https://img.shields.io/npm/v/node-red-contrib-knx-ultimate.svg
[npm-downloads-month-image]: https://img.shields.io/npm/dm/node-red-contrib-knx-ultimate.svg
[npm-downloads-total-image]: https://img.shields.io/npm/dt/node-red-contrib-knx-ultimate.svg
[youtube-image]: https://img.shields.io/badge/Visit%20me-Youtube-red
[youtube-url]: https://www.youtube.com/channel/UCA9RsLps1IthT7fDSeUbRZw/playlists
