---
layout: wiki
title: "Staircase-Configuration"
lang: en
permalink: /wiki/Staircase-Configuration/
---
---
# Staircase Light configuration
The **KNX Staircase** node emulates the typical stairwell timer using KNX group addresses. When the trigger GA receives an impulse the lamp is forced on, a configurable timer starts and optional warnings are issued before switching off. Additional features cover manual override, blocking (for maintenance), and event reporting to the Node-RED flow.
## Group addresses
| Purpose | Property | Notes |
| -- | -- | -- |
| Trigger impulse | `Trigger GA` (`gaTrigger`) | Rising edge (=1) starts or extends the timer. Optional 0 can cancel the cycle. |
| Output command | `Output GA` (`gaOutput`) | Drives the actuator (default DPT 1.001). |
| Status report | `Status GA` (`gaStatus`) | Mirrors the active state and pre-warning flag. Optional. |
| Override | `Override GA` (`gaOverride`) | Keeps the light permanently on while true and suspends the timer. |
| Block | `Block GA` (`gaBlock`) | Prevents new activations. Can optionally force the output off. |
All group addresses accept custom DPTs, allowing integration with multi-byte actuators or logic addresses.
## Timer behaviour
* **Timer duration** sets the base countdown in seconds.
* **On new trigger** controls how subsequent impulses behave:
  * *Restart timer* – restarts the countdown.
  * *Extend remaining time* – adds the base duration to the current remaining time.
  * *Ignore impulse* – ignores extra pulses while the timer is active.
* **0 command cancels** decides whether a value 0 on the trigger GA immediately switches the light off.
* **When blocked** determines if the output is forced off or left untouched when the block GA becomes true.
## Pre-warning options
Enable *Send pre-warning before timeout* to alert occupants before the light turns off. Configure the offset in seconds and choose between:
* *Toggle status GA* – the status address toggles to signal the alert.
* *Flash output* – the actuator briefly turns off/on for the specified flash duration.
## Events output
Tick *Emit events on node output* to receive structured messages whenever the staircase cycle changes state. Messages contain:
```

{
  topic: <configured outputtopic or GA>,
  event: 'trigger' | 'extend' | 'prewarn' | 'timeout' | 'manual-off' | 'override' | 'block',
  remaining: <seconds>,
  active: <boolean>,
  override: <boolean>,
  blocked: <boolean>
}
```

This is useful for dashboards, logging, or custom automation around the staircase timer.
## KNX status throttling
The node honours the KNX Config node status throttle, so frequent timer updates do not overload the editor.
## Flow example
```javascript

// Start the staircase timer
msg.payload = true;
return msg;
```

```javascript
// Cancel the cycle (requires "0 command cancels the cycle")
msg.payload = false;
return msg;
```

## Tips
* Use the override GA for cleaning/maintenance situations.
* Pair the status GA with a visual indicator on the wall or a dashboard widget.
* Enable pre-warning flash only with actuators that support rapid switching.
