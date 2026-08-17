import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist/components');
const pkgPath = path.join(distDir, 'package.json');

const registryHost = process.env.CI_SERVER_HOST ?? 'gitlab.agora.md';
const projectRef = process.env.CI_PROJECT_ID ?? 'laziar%2Ffrontend-components';
const registryBase =
  process.env.CI_API_V4_URL != null
    ? `${process.env.CI_API_V4_URL}/projects/${process.env.CI_PROJECT_ID}/packages/npm/`
    : `https://${registryHost}/api/v4/projects/${projectRef}/packages/npm/`;

const token = process.env.CI_JOB_TOKEN ?? process.env.GITLAB_NPM_TOKEN;
if (!token) {
  console.error('Set GITLAB_NPM_TOKEN (local) or run in GitLab CI (CI_JOB_TOKEN).');
  process.exit(1);
}

if (!process.argv.includes('--skip-build')) {
  execSync('npm run build:lib', { stdio: 'inherit' });
}

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

if (process.env.CI_PIPELINE_IID) {
  pkg.version = `0.1.${process.env.CI_PIPELINE_IID}`;
  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
  console.log(`Publishing version ${pkg.version}`);
}

const npmrc = `@laziar:registry=${registryBase}
//${registryHost}/api/v4/projects/${projectRef}/packages/npm/:_authToken=${token}
`;
fs.writeFileSync(path.join(distDir, '.npmrc'), npmrc);

execSync('npm publish --access restricted', { cwd: distDir, stdio: 'inherit' });
