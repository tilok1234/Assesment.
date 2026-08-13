# Windows release guide

Latest verified artifact snapshot (2026-08-14): the current V2 checkout built a
local standalone proof executable from pushed, remote-verified integration and
launcher implementation `016d79333aada592025a15cb77f42d05f755a9e7` at
`C:\Users\headc\Documents\sprite-assembler-v2\src-tauri\target\release\sprite-assembler.exe`.
It contains the approved 100-family / 316-variant catalog, is 5,986,816 bytes,
and has SHA-256
`0ac4d7313f215121c8c5729e89acb92f129f4863cbd81dfb4fa2182ce3a62555`.
The packaged V3 integration module is byte-identical to source at SHA-256
`1eda6de99862fab7f1d08c9d0ddac74103b7477458d98d5938f337d03142c715`.
`start-assembler-v2.bat` launched that exact executable path in a direct smoke
and the app remained responsive. Release configuration plus launcher and
standalone structure pass 40 assertions; fast/full project validation passes
in about 66.0s/129.8s with all 232 fixtures unchanged.

The executable is version `0.1.0`, unsigned, ignored, and local. It is not a
distributable NSIS installer or approved release candidate, and the full
packaged export/persistence smoke checklist remains outstanding. No NSIS setup
executable exists under this worktree's
`src-tauri/target/release/bundle/nsis/`. The older 2026-08-07 Briar Reveler
standalone and 2026-08-01 `bf6269c` standalone are historical.

The Windows edition packages the same production frontend and procedural engine used by the browser build. Packaging does not freeze the content catalog: outfits, hairstyles, headgear, weapons, enemies, effects, and templates can still be changed normally, then included by rebuilding the application.

## Local release build

Prerequisites:

- Node.js 18 or newer
- Rust stable
- Microsoft C++ Build Tools with the desktop C++ workload
- WebView2 for development

From the repository root:

```powershell
npm ci
npm run check
npm run check:release
npm run tauri:build
npm run check:release -- --require-artifact
```

The distributable setup executable is written beneath `src-tauri/target/release/bundle/nsis/`. The default installer is current-user only, so it does not require administrator access. It embeds Microsoft's small WebView2 bootstrapper so Windows can install the runtime when needed.

For a quick standalone executable without building an installer, use `npm run tauri:build:exe`.

The standalone executable and NSIS installer are separate artifacts. Rebuilding one does not update the other. After any frontend or renderer change, verify the artifact timestamp and hash and run `npm run check:release`; an existing installer passing structural validation does not prove that it embeds the latest `dist/` build.
The `--require-artifact` release check specifically requires an NSIS setup
executable; the standalone proof executable does not satisfy that release gate.

## Packaged smoke test

Before publishing a release:

1. Install the generated setup executable.
2. Launch **8-Bit Sprite Assembler** from the Start menu.
3. Change a player option and confirm the preview updates.
4. Confirm combat effects start Off. Then explicitly enable the legacy overlay,
   inspect a weapon-and-shield attack in all four directions and all four
   attack frames, and turn it Off again. Compare the same packaged `dist/`
   state in the isolated browser when non-intrusive visual QA is required.
5. Export one PNG, one combat-loadout JSON file, and one ZIP pack. Confirm each action opens a native Save dialog in Downloads and creates a readable file at the chosen location.
6. Cancel one Save dialog and confirm the app reports cancellation instead of success.
7. Save a preset, close the app, reopen it, and confirm the preset remains available.
8. Uninstall the app and confirm user-exported PNG, JSON, and ZIP files remain untouched.

## Versioned GitHub release

Keep the version synchronized in `package.json`, `src-tauri/tauri.conf.json`, and `src-tauri/Cargo.toml`; `npm run check:release` enforces this. After the intended commit is on the release branch, push a matching tag such as `v0.1.0`, or start the **Windows Release** workflow manually. The workflow validates the project, builds the NSIS installer, verifies the executable, and creates a draft GitHub release for human review.

The first installer remains unsigned. Configure a trusted Windows code-signing certificate before changing a draft into a broadly distributed public release. Automatic updates are intentionally deferred until releases have a stable public download location and signing identity.

## Content and migration safety

Adding content after packaging is not harder. Keep stable option IDs, advance any changed preset or pack schema version, retain migrations for older saved data, run `npm run check`, and rebuild the installer. Existing local presets live in the WebView profile and should be covered by the packaged smoke test whenever a schema changes.
