# New Chat Handoff

Date: 2026-07-19
Workspace: `C:\Users\headc\Documents\8-bit sprite assembler`
Repository: `tilok1234/8-bit-sprite-assembler`

## Immediate state

The weapon-readability overhaul for all 15 weapon families and five RPG tiers is complete through Pass 7. The user visually approved the corrected bow. Passes 1-4 are in `3cb45fb`; Passes 5-7 are committed and pushed in `4fbb2ca` (`Complete weapon readability overhaul`) on `codex/weapon-readability-bow`. Preserve the approved weapon rendering exactly unless new visual evidence justifies a change.

The active branch is `codex/windows-release`, based on `4fbb2ca`. Phase 6 release work is implemented locally but not yet committed. All PNG, JSON, and ZIP exports share one native-aware helper: packaged Tauri builds open a Windows Save dialog in Downloads and write only the user-selected path; browser builds keep their normal download behavior. Cancellation is reported instead of being mistaken for success.

The default native release is now a current-user NSIS installer with final product metadata, the existing generated icon family, an embedded WebView2 bootstrapper, focused release validation, and a GitHub Actions draft-release workflow. The Rust/JavaScript dialog and file-system plugins use only `dialog:allow-save` and `fs:allow-write-file`; no unrestricted write permission was added.

Current magic-weapon intent:

- Staff remains the longest casting weapon, with a connected countershaft, grip, crown, and focus in every pose.
- Wand stays visibly shorter and more compact than the staff across all five tiers.
- Spellbook keeps a physical cover, spine, and page spread; upper tiers widen the tome instead of turning it into a slab.
- Runes, clasps, focus stones, and page details remain connected to the physical weapon. No detached casting particles are part of these silhouettes.
- Left and right views remain exact mirrors.
- Legacy enemy staves remain on their established Tier 1 renderer; the new readable magic path is player-only.

Primary implementation: `engine/weapon-renderer.js`, functions `drawReadableStaff`, `drawReadableWand`, and `drawReadableSpellbook`.

## Weapon plan

The source of truth is `WEAPON_READABILITY_PLAN.md`.

- Pass 1 complete: sword, greatsword, dagger
- Pass 2 complete: scimitar, rapier, axe
- Pass 3 complete: mace, warhammer, club
- Pass 4 complete and user-approved: spear, bow, crossbow
- Pass 5 complete and user-approved: staff, wand, spellbook
- Pass 6 complete: global Tier 4/Tier 5 comparison, acceptance, and decluttering guardrails
- Pass 7 complete: exhaustive direction, motion, occlusion, frame-safety, recomposition, and native export validation

## Review workflow

Generate the complete weapon review:

```powershell
npm.cmd run review:weapons
```

Generate the exhaustive enlarged and true-native Pass 7 review:

```powershell
npm.cmd run review:weapons -- --all-frames
```

Generate a focused Pass 5 review:

```powershell
npm.cmd run review:weapons -- --focus staff,wand,spellbook --out C:\tmp\pass5-review
```

Important review sheets:

- `weapon-review/03-tier-assembled-side-strike.svg`
- `weapon-review/05-tier5-direction-strike.svg`
- `weapon-review/07-tier5-side-attack.svg`
- `weapon-review/all-frames/<weapon>-all-frames.svg`
- `weapon-review/all-frames-native/<weapon>-all-frames.svg`
- `weapon-review/weapon-frame-audit.csv`
- `weapon-review/weapon-frame-audit.json`

Inspect at native 24x24 scale and enlarged nearest-neighbor scale. Mechanical checks do not override a poor visual read. The generated `weapon-review/` directory is intentionally ignored by Git.

## Validation status

These commands pass on the active Windows release worktree:

```powershell
npm.cmd run check
npm.cmd run check:release -- --require-artifact
npm.cmd run tauri:build
```

Generated installer:

`src-tauri/target/release/bundle/nsis/8-Bit Sprite Assembler_0.1.0_x64-setup.exe`

The release checker verifies the setup executable's PE signature and minimum size. A live standalone packaged-app smoke test also passed: the app launched, opened a native JSON Save dialog in Downloads with the correct filename/type filter, saved a valid schema-v1 loadout, and reported cancellation correctly in a separate run. The verified test export remains at `C:\Users\headc\Downloads\hero-dwarf-sturdy-surprised-glasses-ranger-tier3-scimitar-loadout.json`.

The NSIS setup executable itself has not been installed or uninstalled during this pass, because GUI software installation requires a separate action-time confirmation. The installer is unsigned, and automatic updates remain deferred until a stable public distribution URL and signing identity exist.

Latest reported project totals:

- Player combinations: 10,447,982,899,200
- Enemy families: 57
- Enemy variants: 202
- Combat effects: 24
- Validated PNG sheets: 232 at 1152x384

## Working tree

The Windows release changes are intentionally uncommitted on `codex/windows-release`:

```text
 M ARCHITECTURE.md
 M README.md
 M ROADMAP.md
 M app.js
 M package-lock.json
 M package.json
 M src-tauri/Cargo.lock
 M src-tauri/Cargo.toml
 M src-tauri/capabilities/default.json
 M src-tauri/src/lib.rs
 M src-tauri/tauri.conf.json
 M tools/check-project.mjs
?? .github/workflows/windows-release.yml
?? WINDOWS_RELEASE.md
?? tools/check-windows-release.mjs
```

Key additions include:

- Native Save dialogs for all PNG, JSON, and ZIP exports, defaulting to Downloads
- Browser download fallback and explicit native cancellation/error handling
- Official Tauri dialog/file-system bindings and narrowly scoped permissions
- NSIS-by-default build scripts, current-user installation, and embedded WebView2 bootstrapper
- Synchronized product metadata, icons, version checks, and installer artifact validation
- Version-tag/manual GitHub workflow that creates a draft Windows release
- `WINDOWS_RELEASE.md` with local build, packaged smoke, migration, signing, and release instructions

## Recommended next action

1. Review the active release diff, then commit and push it only when the user asks.
2. If the user wants the full installer lifecycle proof, request action-time confirmation immediately before running the NSIS setup UI; then verify install, Start-menu launch, PNG/JSON/ZIP export, persistence, uninstall, and preservation of user exports.
3. Configure Windows code signing before broad public distribution. Add the updater only after a stable release URL and signing identity exist.
4. Future outfits, hairstyles, headgear, weapons, enemies, effects, and templates remain ordinary catalog/renderer work. Preserve stable IDs, advance affected schema versions, retain migrations, run `npm.cmd run check`, and rebuild the installer.
