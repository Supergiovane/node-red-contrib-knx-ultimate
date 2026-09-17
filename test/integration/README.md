# KNX hardware check

Copy `config.example.json` to the ignored `config.local.json` and enter the KNX gateway and group addresses for your test installation. Run `npm run avviaquesto-itest:knxbus` only when you intend to send telegrams to that installation.

The old Hue/Matter live runners targeted nodes removed in version 8 and are no longer included. Test the separate packages in their own projects after migration. Do not open production Matter storage from a second controller process.
