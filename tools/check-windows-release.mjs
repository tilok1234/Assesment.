import { open, readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const requireArtifact = process.argv.includes('--require-artifact');
const errors = [];
let assertions = 0;

function check(condition, message) {
  assertions += 1;
  if (!condition) errors.push(message);
}

async function readText(relativePath) {
  return readFile(path.join(root, relativePath), 'utf8');
}

async function fileExists(relativePath) {
  try {
    return (await stat(path.join(root, relativePath))).isFile();
  } catch {
    return false;
  }
}

async function listFiles(directory) {
  const files = [];
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await listFiles(fullPath));
    if (entry.isFile()) files.push(fullPath);
  }
  return files;
}

const packageJson = JSON.parse(await readText('package.json'));
const tauriConfig = JSON.parse(await readText('src-tauri/tauri.conf.json'));
const capability = JSON.parse(await readText('src-tauri/capabilities/default.json'));
const cargoToml = await readText('src-tauri/Cargo.toml');
const rustLib = await readText('src-tauri/src/lib.rs');
const appSource = await readText('app.js');
const workflow = await readText('.github/workflows/windows-release.yml');
const v2Launcher = await readText('start-assembler-v2.bat');

const cargoVersion = cargoToml.match(/\[package\][\s\S]*?\nversion\s*=\s*"([^"]+)"/)?.[1];
check(packageJson.version === tauriConfig.version, 'package.json and tauri.conf.json versions must match');
check(packageJson.version === cargoVersion, 'package.json and Cargo.toml versions must match');
check(tauriConfig.productName === '8-Bit Sprite Assembler', 'Tauri product name must be 8-Bit Sprite Assembler');
check(tauriConfig.identifier === 'com.tilok1234.spriteassembler', 'Tauri bundle identifier changed unexpectedly');
check(tauriConfig.build?.beforeBuildCommand === 'npm run build', 'Tauri must build the production frontend before packaging');
check(tauriConfig.build?.frontendDist === '../dist', 'Tauri must package the dist frontend');
check(tauriConfig.app?.withGlobalTauri === true, 'Vanilla JavaScript native APIs require app.withGlobalTauri');
check(tauriConfig.app?.windows?.[0]?.title === tauriConfig.productName, 'Window title and product name must match');
check(tauriConfig.bundle?.active === true, 'Tauri bundling must be active');
check(Array.isArray(tauriConfig.bundle?.targets) && tauriConfig.bundle.targets.length === 1 && tauriConfig.bundle.targets[0] === 'nsis', 'The default Windows release target must be NSIS');
check(tauriConfig.bundle?.windows?.webviewInstallMode?.type === 'embedBootstrapper', 'The installer must embed the WebView2 bootstrapper');
check(tauriConfig.bundle?.windows?.nsis?.installMode === 'currentUser', 'The NSIS installer must use the non-admin current-user mode');
check(typeof tauriConfig.bundle?.publisher === 'string' && tauriConfig.bundle.publisher.length > 0, 'Bundle publisher metadata is required');

for (const icon of tauriConfig.bundle?.icon || []) {
  check(await fileExists(path.join('src-tauri', icon)), `Missing configured bundle icon: ${icon}`);
}

check(packageJson.scripts?.['tauri:build'] === 'tauri build --bundles nsis', 'tauri:build must produce the NSIS installer');
check(packageJson.scripts?.['tauri:build:exe'] === 'tauri build --no-bundle', 'tauri:build:exe must preserve the fast standalone proof build');
check(packageJson.scripts?.['release:windows']?.includes('--require-artifact'), 'release:windows must verify the generated installer');
check(Boolean(packageJson.dependencies?.['@tauri-apps/plugin-dialog']), 'Missing Tauri dialog JavaScript binding');
check(Boolean(packageJson.dependencies?.['@tauri-apps/plugin-fs']), 'Missing Tauri file-system JavaScript binding');
check(cargoToml.includes('tauri-plugin-dialog = "2"'), 'Missing Tauri dialog Rust dependency');
check(cargoToml.includes('tauri-plugin-fs = "2"'), 'Missing Tauri file-system Rust dependency');
check(rustLib.includes('.plugin(tauri_plugin_dialog::init())'), 'Tauri dialog plugin is not initialized');
check(rustLib.includes('.plugin(tauri_plugin_fs::init())'), 'Tauri file-system plugin is not initialized');
check(capability.permissions?.includes('dialog:allow-save'), 'Native save dialog permission is missing');
check(capability.permissions?.includes('fs:allow-write-file'), 'Native export write permission is missing');
check(!capability.permissions?.includes('fs:write-all'), 'Release capability must not grant unrestricted file writes');
check(appSource.includes('window.__TAURI__'), 'Frontend native export bridge is missing');
check(appSource.includes('pathApi.downloadDir()'), 'Native exports must default to the user Downloads folder');
check(appSource.includes("return 'cancelled'"), 'Native save cancellation must be handled without reporting success');
check(workflow.includes('tauri-apps/tauri-action@v1'), 'Windows release workflow must use the official Tauri release action');
check(workflow.includes('npm run check'), 'Windows release workflow must run the project validator');
check(workflow.includes('npm run check:release -- --require-artifact'), 'Windows release workflow must verify its installer artifact');
check(v2Launcher.includes('src-tauri\\target\\release\\sprite-assembler.exe'), 'V2 launcher must target this checkout\'s standalone executable');
check(v2Launcher.includes('if exist "%ASSEMBLER_EXE%"'), 'V2 launcher must prefer the current standalone executable when present');
check(v2Launcher.includes('node tools\\dev-server.mjs --open'), 'V2 launcher must retain a same-checkout browser fallback');

const targetRoot = path.join(root, 'src-tauri', 'target');
const standalone = path.join(targetRoot, 'release', 'sprite-assembler.exe');
const installers = (await listFiles(targetRoot)).filter((file) => /[\\/]bundle[\\/]nsis[\\/].+-setup\.exe$/i.test(file));
if (requireArtifact) check(installers.length > 0, 'No NSIS setup executable was found under src-tauri/target');

if (await fileExists(path.join('src-tauri', 'target', 'release', 'sprite-assembler.exe'))) {
  const info = await stat(standalone);
  const handle = await open(standalone, 'r');
  const signature = Buffer.alloc(2);
  await handle.read(signature, 0, signature.length, 0);
  await handle.close();
  check(signature.toString('ascii') === 'MZ', 'The standalone Sprite Assembler is not a Windows executable');
  check(info.size > 100_000, 'The standalone Sprite Assembler executable is unexpectedly small');
}

for (const installer of installers) {
  const info = await stat(installer);
  const handle = await open(installer, 'r');
  const signature = Buffer.alloc(2);
  await handle.read(signature, 0, signature.length, 0);
  await handle.close();
  check(signature.toString('ascii') === 'MZ', `${path.relative(root, installer)} is not a Windows executable`);
  check(info.size > 100_000, `${path.relative(root, installer)} is unexpectedly small`);
}

if (errors.length) {
  console.error(`Windows release check failed (${errors.length}/${assertions}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const artifactMessage = installers.length
  ? `${installers.length} NSIS installer artifact${installers.length === 1 ? '' : 's'} verified`
  : 'configuration verified; build the installer to verify its artifact';
console.log(`Windows release check passed (${assertions} assertions; ${artifactMessage}).`);
