# Product and Windows Roadmap

This roadmap records the agreed order for turning the current Sprite Assembler into a maintainable editor and, ultimately, a proper Windows application.

## Guiding decision

Do not spend the next major phase polishing an installer, and do not add a large amount of hard-coded content to the current monolithic engine.

The order is:

1. Preserve and validate the baseline.
2. Make the frontend and content model app-ready.
3. Prove Windows packaging with a minimal Tauri build.
4. Add the highest-value editor features and establish the content workflow.
5. Expand content through that stable workflow.
6. Finish and distribute the Windows application.

The procedural rendering and exported sprite-sheet contract remain stable throughout these phases.

## Phase 1 - Clean development baseline

Goals:

- Place the existing project under Git on the `main` branch.
- Connect it to the `tilok1234/8-bit-sprite-assembler` GitHub repository.
- Document how to run and validate it.
- Provide a one-click Windows development launcher.
- Validate JavaScript, manifest references, engine definitions, and every PNG dimension.
- Publish the first known-good baseline commit.

Exit criteria:

- The live UI renders without browser errors.
- All project checks pass from one command.
- A fresh checkout can be started without installing project dependencies.
- Generated and user-local files are not committed accidentally.

## Phase 2 - App-ready frontend and content foundation

Progress: complete for the current engine contract. The standard frontend, restrictive-CSP-compatible runtime, dependency-free production build, stable public engine facade, focused catalogs, renderer, sheet/export, and generator modules are all in place and parity-verified.

Goals:

- Replace the exported runtime-driven page with a standard bundled frontend entry point.
- Remove runtime code generation so the desktop application can use a restrictive content-security policy.
- Split the engine into clear boundaries:
  - player and enemy definitions
  - palettes and equipment catalogs
  - procedural renderers
  - animation definitions
  - sprite-sheet generation and export
  - editor state and persistence
- Make content definitions easy to extend without editing unrelated rendering code.
- Preserve every existing character option, enemy, animation, and exported sheet layout.

Exit criteria:

- The editor behaves like the current baseline.
- Existing asset and engine validators still pass.
- The new frontend runs through a normal `index.html` development/build flow.
- No `eval` or `new Function` requirement remains in application code.

## Phase 3 - Minimal Windows packaging proof

Progress: the Tauri 2 wrapper is configured and the first optimized Windows executable has been compiled and visually verified under the production content-security policy. The proof executable is intentionally built without an installer while editor development continues.

Goals:

- Add a small Tauri 2 wrapper around the app-ready frontend.
- Produce a development executable on Windows.
- Verify preview animation, local settings, and PNG export inside WebView2.
- Keep native permissions minimal.

This phase is deliberately a proof, not the final installer or release design.

Exit criteria:

- A local Windows executable launches successfully.
- The core editor works without a separate web server.
- Exported PNGs match browser output.
- The app uses a restrictive content-security policy.

## Phase 4 - Core editor features

Progress: the first editor-workflow slices are complete. Named player and enemy presets use a sanitized, versioned local format shared by the browser and Windows builds; schema v3 carries character names, export names, and optional player palette overrides while migrating existing v1 and v2 libraries. Bounded undo/redo tracks editable sprite documents without rewinding preview-only direction, animation, zoom, cycle, or export-scale choices. Header controls and `Ctrl+Z`, `Ctrl+Y`, and `Ctrl+Shift+Z` are supported. Every player and enemy option group has an undoable randomize control that always selects a different valid value. Character names appear in the live preview, and exports support persistent Windows-safe filename overrides with an automatic fallback. Players can override base/shadow tones for skin, hair, and outfit, then save those six tones in a separate versioned reusable palette library. PNG export can target the full sheet, one selected animation across all directions, or one selected direction across all animations, with adaptive previews, filenames, and dimensions. These workflows are production-smoke-tested.

Priority order:

1. Save and load named character presets. Complete.
2. Undo and redo. Complete.
3. Randomize individual categories as well as the whole character. Complete.
4. Custom character and export names. Complete.
5. Palette editing and reusable palette presets. Complete.
6. Export a selected animation or direction in addition to the full sheet. Complete.
7. Improved playback controls and frame inspection.
8. Reset, duplicate, and compare workflows.

Exit criteria:

- The editor supports a complete create, revise, save, reopen, and export workflow.
- Preset data has a versioned format.
- Browser and Windows builds share the same editor logic.

## Phase 5 - Content expansion

Candidate additions:

- Body types and silhouettes
- Facial details and expressions
- More hairstyles and headgear
- Armor layers, outfits, robes, capes, and accessories
- More melee, ranged, and magical weapons
- More shields and off-hand items
- Species-specific features such as ears, horns, wings, and tails
- Additional enemy families and variants
- Optional new animations after the existing sheet contract has a versioning plan

Content is added through the stable definition and validation workflow established in Phases 2 and 4.

## Phase 6 - Windows release

Goals:

- Native save and open dialogs where they improve the workflow.
- Final application icon, product metadata, and window behavior.
- NSIS setup executable and/or MSI packaging.
- Versioned release builds through GitHub.
- Code signing and automatic updates when distribution warrants them.
- Release notes, migration checks, and packaged smoke tests.

Exit criteria:

- A signed, versioned Windows installer can be distributed confidently.
- Installation, launch, export, update, and uninstall are verified.
- A release can be reproduced from the repository.
