# Upgrading to KNX Ultimate 8

Version 8 contains the current KNX nodes and gateway. HUE and Matter are provided by `node-red-contrib-hue-ultimate` and `node-red-contrib-matter-ultimate`; the old dedicated KNX utility nodes are replaced by KNX Utility.

## Recommended path from version 7

Install KNX Ultimate 7.1.4 first, open any KNX Ultimate node and press **Upgrade to v8**. The guided operation backs up the flows, installs the required HUE/Matter packages, converts compatible nodes, performs and verifies a full Deploy, and installs version 8. Restart the Node-RED service when requested.

This is the preferred route because the legacy nodes remain operational until the converted flow has been safely deployed.

## Direct upgrade from an older version 7

Every version 8 also includes a recovery bridge for users who reach it without passing through 7.1.4:

1. Install version 8 and restart the Node-RED service.
2. Open the Node-RED editor. A migration prompt appears when legacy nodes or configuration nodes are found, including nodes displayed as unknown.
3. Start the guided migration. It downloads a JSON backup, installs HUE Ultimate and/or Matter Ultimate when needed, converts supported nodes in place, performs a full Deploy and reads the saved flows back for verification.
4. Reload the editor when prompted so converted configuration nodes are re-indexed from the saved flow before any further editing.

IDs, wires, groups and configuration references are preserved. Existing Node-RED credentials remain associated with the same configuration-node IDs, and Matter storage under `knxultimatestorage` is not deleted.

Version 8 registers hidden, inert compatibility runtimes for removed types so that their presence does not stop every unrelated flow from starting. Those legacy nodes do not perform their old automation while they are awaiting conversion. Complete the migration immediately after the restart and do not manually Deploy unknown nodes first.

## Legacy KNX AI nodes

`knxUltimateAI` and `knxUltimateAIHomeAssistant` cannot be converted automatically to Cerebrum Ultimate. The guided process stops before changing flows when it finds either type. Replace or remove those nodes manually, then start the migration again. Their credential schema remains registered during the transition so saved secrets are not discarded merely because version 8 was installed.

## Safety behaviour

The migration stops before changing anything if it finds a locked flow, an unrelated unknown/invalid node, insufficient editor permissions or disabled Palette Manager installation. A flow backup is requested before conversion. Package installation happens through the authenticated Node-RED Admin API, not through a nested npm process.

If HUE Ultimate or Matter Ultimate is installed or updated in a way that requires a restart, the bridge asks for that restart before changing flows. After conversion it validates the editor graph, performs a revision-aware full Deploy and verifies the persisted result. Package timeouts and ambiguous Deploy responses are treated as uncertain rather than guessed.

Node-RED can use custom storage and can contain undeployed browser changes, so an npm lifecycle script cannot safely perform this conversion. The version 8 `preinstall` hook is diagnostic only: when npm allows lifecycle scripts it scans common saved-flow locations and prints a migration warning, but it never edits a flow or starts a nested package installation. Some npm/Node-RED policies disable dependency lifecycle scripts entirely, so the editor bridge is the authoritative migration path.

## Using the separate packages

HUE Ultimate and Matter Ultimate provide their own configuration nodes and device connections. Select the existing `knxUltimate-config` gateway in their editors to enable KNX integration. They can also work without KNX Ultimate.

Keep the same Node-RED user directory and do not delete `knxultimatestorage`. The separate Matter package uses the existing pairing identity, fabrics and device storage.
