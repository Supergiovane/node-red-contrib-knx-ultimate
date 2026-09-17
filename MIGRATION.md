# Upgrading to KNX Ultimate 8

Version 8 contains only the current KNX nodes and the KNX gateway. Hue, Matter, the old dedicated KNX utility nodes and the old KNX AI nodes are removed, including their configuration nodes.

## Before upgrading

Keep KNX Ultimate 7 installed while completing these steps:

1. Back up your entire Node-RED user directory, including flows, credentials, settings and `knxultimatestorage`. A flow export alone does not contain Matter pairing data or all credentials.
2. Convert the old dedicated KNX utility nodes with the **Migrate KNX** button to **KNX Utility**. Check all flows and subflows, then Deploy.
3. Install `node-red-contrib-hue-ultimate` and `node-red-contrib-matter-ultimate` as needed, and restart Node-RED. Use their migration messages to convert the old HUE/Matter nodes and their configuration nodes. All dedicated HUE nodes become profiles of the new HUE Controller.
4. Review and Deploy the migrated flows. Confirm that the new nodes use the existing KNX gateway and that your devices work.
5. Replace or remove any old `knxUltimateAI` and `knxUltimateAIHomeAssistant` nodes. They are not converted by the HUE/Matter migration tools.
6. Check that no old nodes or unused old configuration nodes remain, including in disabled flows and subflows. Then install KNX Ultimate 8 and restart Node-RED.

Use the migration tools instead of manually recreating configuration nodes: their IDs and credentials must be preserved. Keep the same Node-RED user directory and **do not delete `knxultimatestorage`**. The separate Matter package uses the existing Matter storage, pairing identity and fabrics; the KNX package cleanup does not remove this data.

## If you upgraded too early

Missing old node types cannot run in version 8. Reinstall the previous KNX Ultimate 7 version and restart Node-RED before migrating. Restore the complete backup if necessary. Do not delete unknown nodes or reset Matter to try to fix an incomplete migration.

## After installing version 8

Restart the Node-RED service, then reload the editor. Reloading the browser or pressing Deploy does not replace the service restart.

Until Node-RED restarts, it may still serve editor definitions from version 7. Small compatibility resources keep that editor from getting stuck on “Loading Plugins” or “Loading Nodes”, and the old migration notice asks you to restart. Complete the restart before editing or deploying flows. These resources do not restore removed nodes or perform migrations.

## Using the separate packages

Hue Ultimate and Matter Ultimate provide their own configuration nodes and device connections. To integrate with KNX, select a `knxUltimate-config` gateway in their editors. KNX Ultimate continues to provide group address suggestions, datapoints and telegram exchange; it does not need Hue or Matter libraries installed inside its own package.

The separate packages work with normal Node-RED messages, using `msg.topic` and `msg.payload`. Selecting a KNX gateway enables their native KNX mode.

## Installation check in version 8

Version 8 runs a `preinstall` check. It refuses installation when saved flows contain old HUE/Matter nodes or their configuration nodes, including disabled flows and subflows. Installing the new packages alone is not enough: convert the nodes and Deploy first. The check only reads files; it does not migrate or delete anything.

It looks in the npm installation directory and launch directory, then falls back to `~/.node-red` if no saved flow was successfully inspected and no read errors were found. It examines flow-shaped JSON files directly in those directories, literal `flowFile` paths in `settings.js`, and the active project recorded in `.config.projects.json`. It does not execute `settings.js`, read credential files, or traverse backup folders. A JSON flow export left beside the active flow may also be detected; move archived exports into a separate backup folder if necessary.

For a custom installation, explicitly select the saved flow or Node-RED user directory before installing:

```sh
KNXULTIMATE_FLOW_FILE=/absolute/path/house.json npm install node-red-contrib-knx-ultimate@8
# Alternatively:
KNXULTIMATE_NODE_RED_USER_DIR=/absolute/path/node-red-data npm install node-red-contrib-knx-ultimate@8
```

An unreadable standard/explicit flow stops installation. If no flow can be found, installation continues with a warning: new installations must remain possible. Dynamic settings, custom storage, unsaved editor changes, and installation tools that disable lifecycle scripts cannot be fully checked. This is an additional guard, not a substitute for the migration steps and backup. npm runs lifecycle scripts during installation; the guard cannot guarantee that an interrupted upgrade leaves the previously installed package intact. Reinstall version 7 if necessary before migrating.

Lifecycle behaviour: [npm scripts documentation](https://docs.npmjs.com/cli/v11/using-npm/scripts/). Flow storage discovery: [Node-RED local filesystem storage](https://github.com/node-red/node-red/tree/master/packages/node_modules/%40node-red/runtime/lib/storage/localfilesystem).
