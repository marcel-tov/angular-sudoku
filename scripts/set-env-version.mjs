import {readFileSync, writeFileSync} from 'fs';
import {resolve, dirname} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const {version} = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));

const envFiles = [
    resolve(root, 'src/environments/environment.ts'),
    resolve(root, 'src/environments/environment.prod.ts'),
];

for (const file of envFiles) {
    const updated = readFileSync(file, 'utf8').replace(
        /version:\s*'[^']*'/,
        `version: '${version}'`,
    );
    writeFileSync(file, updated);
    console.log(`✔ set version ${version} in ${file.replace(root, '.')}`);
}
