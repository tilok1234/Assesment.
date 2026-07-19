# Windows release guide

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

## Packaged smoke test

Before publishing a release:

1. Install the generated setup executable.
2. Launch **8-Bit Sprite Assembler** from the Start menu.
3. Change a player option and confirm the preview updates.
4. Export one PNG, one combat-loadout JSON file, and one ZIP pack. Confirm each action opens a native Save dialog in Downloads and creates a readable file at the chosen location.
5. Cancel one Save dialog and confirm the app reports cancellation instead of success.
6. Save a preset, close the app, reopen it, and confirm the preset remains available.
7. Uninstall the app and confirm user-exported PNG, JSON, and ZIP files remain untouched.

## Versioned GitHub release

Keep the version synchronized in `package.json`, `src-tauri/tauri.conf.json`, and `src-tauri/Cargo.toml`; `npm run check:release` enforces this. After the intended commit is on the release branch, push a matching tag such as `v0.1.0`, or start the **Windows Release** workflow manually. The workflow validates the project, builds the NSIS installer, verifies the executable, and creates a draft GitHub release for human review.

The first installer remains unsigned. Configure a trusted Windows code-signing certificate before changing a draft into a broadly distributed public release. Automatic updates are intentionally deferred until releases have a stable public download location and signing identity.

## Content and migration safety

Adding content after packaging is not harder. Keep stable option IDs, advance any changed preset or pack schema version, retain migrations for older saved data, run `npm run check`, and rebuild the installer. Existing local presets live in the WebView profile and should be covered by the packaged smoke test whenever a schema changes.
