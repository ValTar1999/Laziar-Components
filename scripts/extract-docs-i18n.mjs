import fs from 'fs';
import path from 'path';

const hostDir = 'projects/docs/src/app/pages/component-host';
const files = fs.readdirSync(hostDir).filter((f) => f.endsWith('.meta.ts'));

function extractSelector(src) {
  return src.match(/selector:\s*'([^']+)'/)?.[1] ?? '';
}

function extractDescription(src) {
  const idx = src.indexOf('DocsComponentMeta');
  const body = idx >= 0 ? src.slice(idx) : src;
  const m = body.match(/description:\s*\n?\s*'((?:\\'|[^'])*)'/);
  return m ? m[1].replace(/\\'/g, "'") : '';
}

function extractSection(src, sectionName) {
  const re = new RegExp(sectionName + ':\\s*\\[([\\s\\S]*?)\\n\\s*\\],');
  return src.match(re)?.[1] ?? '';
}

function extractNamedDescriptions(block) {
  const items = [];
  const objs = block.match(/\{[\s\S]*?name:[\s\S]*?description:[\s\S]*?\}/g) || [];
  for (const obj of objs) {
    const name = obj.match(/name:\s*'([^']*)'/)?.[1];
    const desc = obj.match(/description:\s*'((?:\\'|[^'])*)'/)?.[1];
    if (name && desc) items.push({ name, description: desc.replace(/\\'/g, "'") });
  }
  return items;
}

function extractControls(block) {
  const items = [];
  const parts = block.split(/\n\s*\{/).slice(1);
  for (const part of parts) {
    const name = part.match(/name:\s*'([^']*)'/)?.[1];
    if (!name) continue;
    const description = part.match(/description:\s*'((?:\\'|[^'])*)'/)?.[1]?.replace(/\\'/g, "'");
    const defMatch = part.match(/default:\s*'((?:\\'|[^'])*)'/);
    const defaultStr = defMatch?.[1]?.replace(/\\'/g, "'");
    const label = part.match(/label:\s*'((?:\\'|[^'])*)'/)?.[1]?.replace(/\\'/g, "'");
    items.push({ name, description, default: defaultStr, label });
  }
  return items;
}

function extractExamples(block) {
  const items = [];
  const parts = block.split(/\n\s*\{/).slice(1);
  let i = 0;
  for (const part of parts) {
    const title = part.match(/title:\s*'((?:\\'|[^'])*)'/)?.[1]?.replace(/\\'/g, "'");
    const description = part.match(/description:\s*'((?:\\'|[^'])*)'/)?.[1]?.replace(/\\'/g, "'");
    if (title) items.push({ index: i++, title, description });
  }
  return items;
}

function extractTokens(block) {
  const items = [];
  const re = /name:\s*'([^']*)'[\s\S]*?description:\s*'((?:\\'|[^'])*)'/g;
  let m;
  while ((m = re.exec(block))) {
    items.push({ name: m[1], description: m[2].replace(/\\'/g, "'") });
  }
  return items;
}

function seg(name) {
  return (
    name
      .replace(/^\[|\]$/g, '')
      .replace(/^\((.*)\)$/, '$1')
      .replace(/[^a-zA-Z0-9]+/g, '_')
      .replace(/^_|_$/g, '')
      .toLowerCase() || 'item'
  );
}

const components = {};
for (const file of files) {
  const src = fs.readFileSync(path.join(hostDir, file), 'utf8');
  const selector = extractSelector(src);
  const id = selector.replace(/^lz-/, '');
  if (!id) continue;

  const description = extractDescription(src);
  const controls = extractControls(extractSection(src, 'controls'));
  const inputs = extractNamedDescriptions(extractSection(src, 'inputs'));
  const outputs = extractNamedDescriptions(extractSection(src, 'outputs'));
  const slots = extractNamedDescriptions(extractSection(src, 'slots'));
  const deprecated = extractNamedDescriptions(extractSection(src, 'deprecated') || '');
  const examples = extractExamples(extractSection(src, 'examples'));
  const tokens = extractTokens(extractSection(src, 'tokens'));

  const entry = { description };
  const controlObj = {};
  for (const c of controls) {
    const o = {};
    if (c.description) o.hint = c.description;
    if (c.label) o.label = c.label;
    if (c.default && /[А-Яа-яЁё]/.test(c.default)) o.default = c.default;
    if (Object.keys(o).length) controlObj[c.name] = o;
  }
  if (Object.keys(controlObj).length) entry.controls = controlObj;

  const mapNamed = (arr) => Object.fromEntries(arr.map((x) => [seg(x.name), x.description]));
  if (inputs.length) entry.inputs = mapNamed(inputs);
  if (outputs.length) entry.outputs = mapNamed(outputs);
  if (slots.length) entry.slots = mapNamed(slots);
  if (deprecated.length) entry.deprecated = mapNamed(deprecated);

  if (examples.length) {
    entry.examples = Object.fromEntries(
      examples.map((e) => [
        String(e.index),
        { title: e.title, ...(e.description ? { description: e.description } : {}) },
      ]),
    );
  }
  if (tokens.length) {
    entry.tokens = Object.fromEntries(
      tokens.map((t) => [seg(t.name.replace(/^--/, '')), t.description]),
    );
  }

  components[id] = entry;
}

fs.writeFileSync('tmp-docs-i18n-ru.json', JSON.stringify({ components }, null, 2));
console.log('ok', Object.keys(components).length, Object.keys(components).join(', '));
