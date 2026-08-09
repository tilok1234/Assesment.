# Windows release guide

Latest verified artifact snapshot (2026-08-07): a local standalone proof executable was
built from exact pushed checkpoint
`4bea4102b0ddf94b020d5b7c66f1f9af806aab8f` at
`C:\tmp\8-bit-sprite-assembler-en-e03-briar-reveler-attack\src-tauri\target\release\sprite-assembler.exe`.
It is 5,375,488 bytes with SHA-256
`a303a0e83f54466d44dc312444e8f41883834f7d40b3ef01dd74bb87972502b4`.
The packaged Briar Reveler Attack module is byte-identical to source at SHA-256
`5500b1342ad448bd43e084ba2777554587807bf74839d9fc1d91444eb64b5288`.
The executable is version `0.1.0`, unsigned, ignored, and uncommitted. A direct
startup/render smoke opened the assembler, showed the expected Effects Off UI,
and remained responsive, but the full packaged-smoke checklist and release
approval are still outstanding. It is not a distributable NSIS installer. No
NSIS setup executable exists under this worktree's
`src-tauri/target/release/bundle/nsis/`, so there is still no approved Windows
release candidate. The older 2026-08-01 `bf6269c` standalone is historical.

Re-audited on 2026-08-09: the current checkout still contains no NSIS artifact;
no newer executable has been promoted or approved by this documentation lane.
The approved 80-family / 259-variant enemy integration has passed source-level
and full project validation, but no Windows executable or installer has been
rebuilt from that working branch. The artifact snapshot above therefore remains
historical and must not be represented as containing the new catalog.

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
