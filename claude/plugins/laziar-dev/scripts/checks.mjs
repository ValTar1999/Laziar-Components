#!/usr/bin/env node
// Runs a project's own checks (lint, tests) before Claude finishes a turn in
// which the code changed, and sends any failure back to Claude to fix.
//
//   node checks.mjs baseline   SessionStart: remember the code as it is now
//   node checks.mjs stop       Stop: if the code changed since it last passed
//                              (or since the session began), run the checks
//
// A project opts in with .claude/laziar-checks.json at its git root:
//   {
//     "watch": ["src/"],                      // paths whose changes trigger checks
//     "checks": [
//       { "name": "lint",  "command": "npx eslint {files}", "extensions": [".ts", ".html"] },
//       { "name": "tests", "command": "npx ng test --watch=false", "timeoutSeconds": 600 }
//     ]
//   }
// `{files}` is replaced by the watched files changed since the session began
// (committed or not, filtered by `extensions`); a check with `{files}` and no
// such file is skipped. That keeps lint to this session's work, so old
// problems elsewhere in a repository do not block it.
// Without that file the hook does nothing, so it is safe in any repository.
//
// Exit 0 lets Claude stop; exit 2 blocks the stop and hands stderr to Claude.

import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

/** After this many failed attempts in a row Claude may stop, with the failure reported. */
const MAX_BLOCKS = 3;
/** How much of a failing check's output Claude is shown. */
const OUTPUT_TAIL_LINES = 80;

const mode = process.argv[2];
const input = readInput();
const root = gitRoot(input.cwd || process.cwd());
if (!root) process.exit(0);

const config = readConfig(root);
if (!config) process.exit(0);

const stateFile = path.join(
  os.tmpdir(),
  'laziar-dev-checks',
  `${createHash('sha1').update(root.toLowerCase()).digest('hex')}.json`,
);
const state = readState();
const session = input.session_id || '';

if (mode === 'baseline') {
  writeState({ passed: fingerprint(), baseHead: headCommit(), blocks: 0, session });
  process.exit(0);
}

if (mode !== 'stop') process.exit(0);

const current = fingerprint();
if (state.passed === current) process.exit(0);

const baseHead = state.baseHead || headCommit();
for (const check of config.checks) {
  const result = run(check, changedFiles(baseHead));
  if (result.ok) continue;

  const blocks = (state.session === session ? state.blocks || 0 : 0) + 1;
  writeState({ passed: state.passed, baseHead, blocks, session });
  if (blocks > MAX_BLOCKS) {
    // Do not trap the session: report, then let it end.
    process.stderr.write(
      `laziar-dev: "${check.name}" still fails after ${MAX_BLOCKS} attempts; stopping anyway. Tell the user it fails.\n`,
    );
    process.exit(0);
  }
  process.stderr.write(
    [
      `Checks failed in ${root}: "${check.name}" (\`${check.command}\`, exit ${result.code}).`,
      'Fix the cause, then finish again; the checks rerun automatically.',
      'If the failure is not caused by this session\'s changes, say so to the user instead of hiding it.',
      '',
      `Last ${OUTPUT_TAIL_LINES} lines of output:`,
      tail(result.output, OUTPUT_TAIL_LINES),
    ].join('\n') + '\n',
  );
  process.exit(2);
}

writeState({ passed: current, baseHead, blocks: 0, session });
process.exit(0);

// ---------------------------------------------------------------------------

function readInput() {
  try {
    const raw = fs.readFileSync(0, 'utf8');
    return raw.trim() ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * The repository root, with an upper-case drive letter on Windows: tools that
 * resolve paths twice (Vitest among them) break when the drive is spelled c:\.
 */
function gitRoot(cwd) {
  const out = spawnSync('git', ['rev-parse', '--show-toplevel'], { cwd, encoding: 'utf8' });
  if (out.status !== 0) return null;
  const resolved = path.resolve(out.stdout.trim());
  return resolved.replace(/^[a-z]:/, (drive) => drive.toUpperCase());
}

function readConfig(dir) {
  try {
    const parsed = JSON.parse(fs.readFileSync(path.join(dir, '.claude', 'laziar-checks.json'), 'utf8'));
    const checks = Array.isArray(parsed.checks) ? parsed.checks.filter((c) => c && c.command) : [];
    if (checks.length === 0) return null;
    const watch = Array.isArray(parsed.watch) && parsed.watch.length ? parsed.watch : ['.'];
    return { watch, checks: checks.map((c) => ({ name: c.name || c.command, ...c })) };
  } catch {
    return null;
  }
}

function readState() {
  try {
    return JSON.parse(fs.readFileSync(stateFile, 'utf8'));
  } catch {
    return {};
  }
}

function writeState(next) {
  try {
    fs.mkdirSync(path.dirname(stateFile), { recursive: true });
    fs.writeFileSync(stateFile, JSON.stringify(next));
  } catch {
    // No state means the checks simply run again next time.
  }
}

/**
 * What the watched code looks like: the commit checked out, plus every
 * changed or new watched file with its size and modification time. Committing
 * changes the first part, editing the second, so either reruns the checks.
 */
function fingerprint() {
  const head = headCommit();
  const status = git(['status', '--porcelain=v1', '-uall', '--', ...config.watch]);
  const files = status
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const file = line.slice(3).replace(/^"|"$/g, '').split(' -> ').pop();
      try {
        const stat = fs.statSync(path.join(root, file));
        return `${line}|${stat.size}|${stat.mtimeMs}`;
      } catch {
        return line;
      }
    });
  return createHash('sha1').update([head, ...files].join('\n')).digest('hex');
}

function git(args) {
  return spawnSync('git', args, { cwd: root, encoding: 'utf8' }).stdout || '';
}

function headCommit() {
  return git(['rev-parse', 'HEAD']).trim();
}

/**
 * Watched files changed since `base` (the commit the session began on), as
 * they are now: committed, staged, unstaged or new. Deleted files are left out.
 */
function changedFiles(base) {
  const names = new Set([
    ...git(['diff', '--name-only', '--diff-filter=d', base, '--', ...config.watch]).split('\n'),
    ...git(['ls-files', '--others', '--exclude-standard', '--', ...config.watch]).split('\n'),
  ]);
  return [...names].filter((name) => name && fs.existsSync(path.join(root, name)));
}

/** Runs one check; with `{files}`, once per batch of changed files, or not at all without any. */
function run(check, changed) {
  if (!check.command.includes('{files}')) return exec(check.command, check);
  const extensions = Array.isArray(check.extensions) ? check.extensions : null;
  const files = changed.filter((file) => !extensions || extensions.some((ext) => file.endsWith(ext)));
  if (files.length === 0) return { ok: true, code: 0, output: '' };
  // Batches keep the command line under Windows' length limit.
  for (let i = 0; i < files.length; i += 40) {
    const list = files.slice(i, i + 40).map((file) => `"${file}"`).join(' ');
    const result = exec(check.command.replaceAll('{files}', list), check);
    if (!result.ok) return result;
  }
  return { ok: true, code: 0, output: '' };
}

function exec(command, check) {
  const result = spawnSync(command, {
    cwd: root,
    shell: true,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    timeout: (check.timeoutSeconds || 900) * 1000,
    env: { ...process.env, CI: process.env.CI || '1', FORCE_COLOR: '0', NO_COLOR: '1' },
  });
  const output = `${result.stdout || ''}${result.stderr || ''}`;
  if (result.error) {
    return { ok: false, code: result.error.code || 'error', output: `${output}\n${result.error.message}` };
  }
  return { ok: result.status === 0, code: result.status, output };
}

function tail(text, lines) {
  const all = text.replace(/\x1b\[[0-9;]*m/g, '').split(/\r?\n/);
  return all.slice(-lines).join('\n');
}
