# Security Policy

Home automation is not a joke. Please consider all dangers involving the use of this repository to control your home or building.
A single light that remains ON while you're not at home, for example, **can become a serious danger for fire**.<br/>
All unattended devices put your building at risk.<br/>
Not to mention if, for your fault or for a BUG in the knx-ultimate repository, a garage doors closes while a child is sitting inbetween.
The **building security** must be your primary concern.<br/>
Please use knx-ultimate (but it's generally the same for ALL repositories) only to control actuators that have been secured by other certified means.<br/>
For the example above, the garage door must be secured by a **CERTIFIED mechanical or electronical system**, preventing damages to people, animals or things.
The developer of knx-ultimate repository and all developers involved in this project, is not responsible in any way for any damage, as stated in the MIT License you can find [here](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/blob/master/LICENSE).<br/>


## Home automation rules

In my experience, i developed some **best practices** to secure my home from fire, damages and risks for third persons.<br/>

* Install one or more main power switches, that cut off the power in your whole house while you're away, leaving powered only the minimal number of necessary devices (like refirgerator, alarm panel, internet router and so on). If you need some automation while youre away, you can temporarly switch on the main power switch and regain full access. This is worthful to avoid possible hacking of your home by someone having access, for example, to an improperly secured IOT device.
* Install a redundant internet router using another wan line, for example an LTE connection. In case you lost one wan, you have another one to rely to.
* Find a way to **enter** in your home, even in case of power outages (for example, a phisycal mechanichal key somewhere in the garden).
* Find a way to **exit** your home, even in case of power outages (for example, a phisycal mechanichal key somewhere near your main door).
* Find a way to **escape** from your home in case of bulgary or fire alarm (for example, by means of an extensible ladder from a balcony).
* Use only professional and certified bulgary/fire security system and command it by KNX. Be aware, the KNX command becomes the backdoor of possible problems. Never ever allow the KNX node to disarm your security system without a password. If you use a touchscreen, avoid **single button disarm** capability. Create buttons simulating a security panel **keypad** pression instead.
* Install a **medical emergency** KNX pushbutton and put it, for example, near your bed. In case of emergency, automatically notify your family or someone that can help you, turn on all significant lights, create a **visible entrance pattern** for paramedics, unlock doors and the pathway to allow them to reach you even in case you become inconscious. You can even use Alexa, Siri or Google Home to trigger this KNX pushbutton (see in the example section of the wiki), in case you've a stroke and you can't move.




Use this section to tell people about which versions of your project are
currently being supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 5.1.x   | :white_check_mark: |
| 5.0.x   | :x:                |
| 4.0.x   | :white_check_mark: |
| < 4.0   | :x:                |

## Reporting a Vulnerability

Use this section to tell people how to report a vulnerability.

Tell them where to go, how often they can expect to get an update on a
reported vulnerability, what to expect if the vulnerability is accepted or
declined, etc.
