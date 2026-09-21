# Version 7 to version 8 release runbook

The guided upgrade uses two npm channels:

- `7.1.4` is published with the `latest` dist-tag. This is the only version that the normal Node-RED Palette Manager must offer.
- `8.0.1-beta.0` is published with the `beta` dist-tag. The version 7 upgrade button installs this exact version; it must never be published as `latest`.

The beta package is public because Node-RED must be able to install it without npm credentials. The non-default dist-tag keeps it out of normal installs and Palette Manager updates.

## Release order

1. In `node-red-contrib-matter-ultimate`, run its tests immediately before the release commit, commit `1.0.3`, then publish it first. This version registers the migrated door-lock PIN as a protected runtime credential; neither KNX upgrade build may be published before it is available from npm. Verify it before continuing:

   ```sh
   npm view node-red-contrib-matter-ultimate@1.0.3 version
   ```

2. From the version 8 worktree, run the tests immediately before the release commit, commit the `8.0.1-beta.0` compatibility build, then publish it with `npm run release:publish -- --skip-tests`. The release script verifies the `beta` dist-tag and deliberately skips flows.nodered.org; `--skip-tests` avoids rerunning the already-passed suite after the commit.
3. Verify that npm reports `beta` as `8.0.1-beta.0` and that `latest` has not changed:

   ```sh
   npm view node-red-contrib-knx-ultimate dist-tags --json
   ```

4. Remove the obsolete version 8 packages from npm: `8.0.0-beta.0`, `8.0.0-beta.2`, `8.0.0-beta.3` and `8.0.0`. Do not remove `8.0.1-beta.0`.
5. From the `7.x` worktree, run the tests immediately before the release commit, commit `7.1.4`, then publish it with `npm run release:publish -- --skip-tests`. This assigns `latest` and requests a Flow Library refresh.
6. Verify that npm reports `latest` as `7.1.4` and `beta` as `8.0.1-beta.0`, and that the obsolete version 8 packages no longer appear in `npm view node-red-contrib-knx-ultimate versions --json`.
7. Wait for the asynchronous Node-RED catalogue build, then verify both the package page and the Palette Manager catalogue before announcing the release:

   ```sh
   curl -fsSL https://catalogue.nodered.org/catalogue.json \
     | jq -c '.modules[] | select(.id == "node-red-contrib-knx-ultimate") | {id,version,updated_at}'
   ```

   The reported version must be `7.1.4`. Also check <https://flows.nodered.org/node/node-red-contrib-knx-ultimate>.

Do not publish the version 7 release before the beta target exists. Do not submit the beta to flows.nodered.org, and do not unpublish `8.0.1-beta.0` later: version 7.1.4 installs that exact immutable target. Every later public version 8 must retain the recovery bridge and legacy runtime placeholders so direct Palette Manager upgrades remain recoverable. Users who already installed version 8 are not automatically downgraded by this process.
