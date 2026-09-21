---
layout: wiki
title: "Upgrade to KNX Ultimate 8"
lang: en
permalink: /wiki/Upgrade-to-v8
---
# Upgrade to KNX Ultimate 8

Version 7 shows a compact **Upgrade to v8** button at the top of every KNX Ultimate node editor. One guided operation performs the migration; do not install version 8 manually first.

## What the button does

1. Downloads a JSON backup of every flow currently in the editor. Protected credentials are excluded from the file, as with the standard Node-RED export, but remain stored by Node-RED.
2. Installs HUE Ultimate and/or Matter Ultimate only when the flows contain nodes that need those packages.
3. Converts compatible KNX Utility, HUE and Matter nodes in place, preserving IDs, wires, groups, configuration references and Matter storage.
4. Performs a full Deploy and reads the saved flows back from Node-RED. KNX Ultimate 8 is installed only if no removed node type remains.
5. Asks you to restart the Node-RED service. This restart is mandatory; reloading the browser is not enough.

The current node form closes when the operation starts, so save any edits in that form first. The account must be allowed to read and deploy flows and to install/update palette modules.

If an older standalone HUE Ultimate or Matter Ultimate package is already installed, the button first stages its update and asks for a preliminary service restart. Reload the editor and press the button again; no flow is changed during that preliminary step. A normal version 7 installation does not need this extra restart.

## Safety stops

The operation stops before changing anything when it finds a locked flow, an unrelated unknown or invalid node, or a legacy KNX AI / KNX AI Home Assistant node. AI settings cannot be converted safely to Cerebrum Ultimate; replace or remove those rare nodes manually, then run the button again.

If package installation fails before Deploy, the in-editor conversion is rolled back. If the converted flow was already deployed but installing KNX Ultimate 8 fails, version 7 and the standalone packages remain usable: resolve the reported error and run the button again.

If a package request times out and may still be running, do not Deploy: restart the Node-RED service, reload the editor and press the button again.

If a connection interruption makes the Deploy result impossible to verify, the procedure does not guess and does not perform an automatic rollback. Reload the editor and inspect the saved flows before trying again. If another editor changed the flow revision, only the automatic conversion is rolled back locally; review or export any pre-existing local changes, then reload the editor.

Node-RED can run as a system service, Docker container, Home Assistant add-on or another supervisor, so the editor cannot issue one universal safe restart command.
