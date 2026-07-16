import { copyFile, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const output = path.join(root, 'dist');
const runtimeFiles = ['index.html', 'styles.css', 'app.js', 'sprite-engine.js'];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const relativePath of runtimeFiles) {
  await copyFile(path.join(root, relativePath), path.join(output, relativePath));
}

console.log(`Built ${runtimeFiles.length} runtime files in ${path.relative(root, output)}.`);
