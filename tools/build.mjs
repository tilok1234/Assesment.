import { copyFile, cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const output = path.join(root, 'dist');
const runtimeFiles = ['index.html', 'styles.css', 'app.js', 'sprite-engine.js', 'zip.js'];
const runtimeDirectories = ['engine'];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const relativePath of runtimeFiles) {
  await copyFile(path.join(root, relativePath), path.join(output, relativePath));
}

for (const relativePath of runtimeDirectories) {
  await cp(path.join(root, relativePath), path.join(output, relativePath), { recursive: true });
}

console.log(`Built ${runtimeFiles.length} runtime files and ${runtimeDirectories.length} module directory in ${path.relative(root, output)}.`);
