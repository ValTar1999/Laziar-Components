const fs = require('fs');
const path = require('path');

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.(ts|html|css|scss)$/.test(e.name) && !/\.spec\.ts$/.test(e.name)) acc.push(p);
  }
  return acc;
}

function classify(file, content) {
  const base = path.basename(file);
  const types = [];
  if (/@Component\s*\(/.test(content)) types.push('component');
  if (/@Directive\s*\(/.test(content)) types.push('directive');
  if (/@Pipe\s*\(/.test(content)) types.push('pipe');
  if (/@Injectable\s*\(/.test(content)) types.push('service');
  if (/@NgModule\s*\(/.test(content)) types.push('module');
  if (
    /export\s+(interface|type|enum|const|class|function)\s+/.test(content) &&
    !types.some((t) => ['component', 'service', 'directive', 'pipe'].includes(t))
  ) {
    if (/export\s+(interface|type|enum)\s+/.test(content)) types.push('model');
    else if (/export\s+const\s+/.test(content)) types.push('constants');
    else if (/export\s+function\s+/.test(content)) types.push('utility');
    else if (/export\s+class\s+/.test(content)) types.push('class');
    else types.push('model');
  }
  if (file.endsWith('.html')) types.push('template');
  if (/\.(css|scss)$/.test(file)) types.push('styles');
  if (!types.length && file.endsWith('.ts')) types.push('typescript');
  return [...new Set(types)];
}

function extractComponentMeta(content) {
  const meta = {
    selector: null,
    className: null,
    standalone: null,
    inputs: [],
    outputs: [],
    implements: [],
    cva: false,
    lifecycle: [],
    inject: [],
    methods: [],
    hostListeners: [],
    a11y: [],
  };
  const sel = content.match(/selector:\s*['"]([^'"]+)['"]/);
  if (sel) meta.selector = sel[1];
  const stand = content.match(/standalone:\s*(true|false)/);
  if (stand) meta.standalone = stand[1] === 'true';
  const cls = content.match(/export\s+class\s+(\w+)/);
  if (cls) meta.className = cls[1];

  let m;
  const inputRe =
    /@Input\s*(?:\(([^)]*)\))?\s*(?:set\s+)?(\w+)\s*(?:\([^)]*\))?\s*(?::\s*([^=;{]+))?(?:\s*=\s*([^;]+))?;/g;
  while ((m = inputRe.exec(content))) {
    meta.inputs.push({
      name: m[2],
      alias: ((m[1] || '').match(/['"]([^'"]+)['"]/) || [])[1] || null,
      type: (m[3] || '').trim() || null,
      default: (m[4] || '').trim() || null,
      required: /required:\s*true/.test(m[1] || ''),
    });
  }
  const sigIn = /(?:readonly\s+)?(\w+)\s*=\s*input(?:\.required)?\s*(?:<([^>]+)>)?\s*\(([^)]*)\)/g;
  while ((m = sigIn.exec(content))) {
    meta.inputs.push({
      name: m[1],
      alias: null,
      type: (m[2] || '').trim() || null,
      default: (m[3] || '').trim() || null,
      required: /input\.required/.test(m[0]),
      api: 'signal',
    });
  }
  const outRe =
    /@Output\s*(?:\(([^)]*)\))?\s*(\w+)\s*(?:=\s*new\s+EventEmitter\s*(?:<([^>]+)>)?\s*\(\s*\))?/g;
  while ((m = outRe.exec(content))) {
    meta.outputs.push({
      name: m[2],
      alias: ((m[1] || '').match(/['"]([^'"]+)['"]/) || [])[1] || null,
      type: (m[3] || 'unknown').trim(),
    });
  }
  const sigOut = /(?:readonly\s+)?(\w+)\s*=\s*output\s*(?:<([^>]+)>)?\s*\(\s*\)/g;
  while ((m = sigOut.exec(content))) {
    meta.outputs.push({ name: m[1], type: (m[2] || 'void').trim(), api: 'signal' });
  }

  meta.cva = /ControlValueAccessor/.test(content);
  meta.implements = [...content.matchAll(/implements\s+([^{]+)/g)].map((x) =>
    x[1].replace(/\s+/g, ' ').trim()
  );
  for (const h of [
    'ngOnInit',
    'ngOnDestroy',
    'ngOnChanges',
    'ngAfterViewInit',
    'ngAfterContentInit',
    'ngDoCheck',
    'ngAfterViewChecked',
  ]) {
    if (new RegExp('\\b' + h + '\\s*\\(').test(content)) meta.lifecycle.push(h);
  }
  const inj = [...content.matchAll(/inject\s*\(\s*(\w+)/g)].map((x) => x[1]);
  const ctor = content.match(/constructor\s*\(([^)]*)\)/s);
  if (ctor) {
    for (const d of ctor[1].matchAll(
      /(?:private|public|protected|readonly)\s+(?:readonly\s+)?(\w+)\s*:\s*(\w+)/g
    )) {
      meta.inject.push(d[2]);
    }
  }
  meta.inject = [...new Set([...meta.inject, ...inj])];
  meta.methods = [
    ...content.matchAll(
      /(?:^\s*)(?:public|private|protected)?\s*(?:async\s+)?(\w+)\s*\([^)]*\)\s*(?::\s*[^{]+)?\s*\{/gm
    ),
  ]
    .map((x) => x[1])
    .filter((n) => !['constructor', 'if', 'for', 'while', 'switch', 'catch'].includes(n));
  if (/aria-|role=|tabindex|keydown|keyup|focus\(/i.test(content)) meta.a11y.push('ts-a11y-patterns');
  meta.hostListeners = [...content.matchAll(/@HostListener\s*\(\s*['"]([^'"]+)/g)].map((x) => x[1]);

  // imports in @Component
  const importsBlock = content.match(/imports:\s*\[([^\]]*)\]/s);
  if (importsBlock) {
    meta.componentImports = importsBlock[1]
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return meta;
}

function analyzeProject(name, baseDir) {
  const files = walk(baseDir);
  const items = [];
  for (const f of files) {
    const rel = path.relative(baseDir, f).split(path.sep).join('/');
    const content = fs.readFileSync(f, 'utf8');
    const types = classify(f, content);
    const item = { path: rel, name: path.basename(f), types, size: content.length };
    if (types.some((t) => ['component', 'service', 'directive', 'pipe'].includes(t))) {
      item.meta = extractComponentMeta(content);
    }
    if (types.some((t) => ['model', 'constants', 'utility', 'class'].includes(t))) {
      item.exports = [
        ...content.matchAll(
          /export\s+(?:declare\s+)?(?:abstract\s+)?(?:interface|type|enum|const|class|function)\s+(\w+)/g
        ),
      ].map((x) => x[1]);
      // capture type aliases values briefly
      item.snippets = {};
      for (const exp of item.exports || []) {
        const typeMatch = content.match(
          new RegExp('export\\s+type\\s+' + exp + '\\s*=\\s*([^;]+);')
        );
        if (typeMatch) item.snippets[exp] = typeMatch[1].trim().slice(0, 200);
        const constMatch = content.match(
          new RegExp('export\\s+const\\s+' + exp + '\\s*[:=][^=]*=\\s*([\\s\\S]*?);\\s*(?:export|$)')
        );
        if (constMatch) item.snippets[exp] = constMatch[1].trim().slice(0, 300);
      }
    }
    if (f.endsWith('.html')) {
      item.ngContent = [...content.matchAll(/<ng-content([^>]*)>/g)].map((x) => {
        const sel = x[1].match(/select=['"]([^'"]+)['"]/);
        return sel ? sel[1] : 'default';
      });
      item.ngIf = (content.match(/\*ngIf|@if\s*\(/g) || []).length;
      item.ngFor = (content.match(/\*ngFor|@for\s*\(/g) || []).length;
      item.aria = [...content.matchAll(/\baria-[\w-]+(?:=['"][^'"]*['"])?|\brole=['"][^'"]+['"]/g)].map(
        (x) => x[0]
      );
      item.classes = [
        ...new Set(
          [...content.matchAll(/class=['"]([^'"]+)['"]/g)].flatMap((x) => x[1].split(/\s+/))
        ),
      ].slice(0, 60);
    }
    if (/\.(css|scss)$/.test(f)) {
      const colors = [...content.matchAll(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]+\)|hsla?\([^)]+\)/g)].map(
        (x) => x[0]
      );
      const varsUsed = [...content.matchAll(/var\((--[\w-]+)/g)].map((x) => x[1]);
      const varsDef = [...content.matchAll(/(--[\w-]+)\s*:/g)].map((x) => x[1]);
      const host = /:host\b/.test(content);
      const radii = [...content.matchAll(/border-radius\s*:\s*([^;]+)/g)].map((x) => x[1].trim());
      const fonts = [...content.matchAll(/font-size\s*:\s*([^;]+)/g)].map((x) => x[1].trim());
      const pads = [...content.matchAll(/(?:padding|margin|gap)\s*(?:-[a-z]+)?\s*:\s*([^;]+)/g)].map(
        (x) => x[0].trim()
      );
      const shadows = [...content.matchAll(/box-shadow\s*:\s*([^;]+)/g)].map((x) => x[1].trim());
      const transitions = [...content.matchAll(/transition\s*:\s*([^;]+)/g)].map((x) => x[1].trim());
      const breakpoints = [
        ...content.matchAll(/@media[^{]+/g),
      ].map((x) => x[0].trim());
      item.design = {
        colors: [...new Set(colors)],
        varsUsed: [...new Set(varsUsed)],
        varsDef: [...new Set(varsDef)],
        host,
        radii: [...new Set(radii)],
        fonts: [...new Set(fonts)],
        pads: [...new Set(pads)].slice(0, 40),
        shadows: [...new Set(shadows)],
        transitions: [...new Set(transitions)],
        breakpoints: [...new Set(breakpoints)],
      };
    }
    // purpose from first comment or class name
    if (fileEndsTs(f) && item.meta) {
      const comment = content.match(/\/\*\*([\s\S]*?)\*\//);
      item.purpose = comment
        ? comment[1].replace(/\s*\*\s?/g, ' ').trim().slice(0, 160)
        : null;
    }
    items.push(item);
  }
  return { project: name, baseDir, items };
}

function fileEndsTs(f) {
  return f.endsWith('.ts');
}

const projects = {
  publikator: path.join(
    'c:',
    'Users',
    'user',
    'Documents',
    'Work-2',
    'publikator',
    'src',
    'app',
    'common',
    'components',
    'base'
  ),
  agora: path.join(
    'c:',
    'Users',
    'user',
    'Documents',
    'Work-2',
    'agora-frontend',
    'src',
    'app',
    'common',
    'components',
    'base'
  ),
};

const out = {};
for (const [k, v] of Object.entries(projects)) out[k] = analyzeProject(k, v);

const outDir = path.join('c:', 'Users', 'user', 'Documents', 'Work-2', 'Laziar-Components', 'docs', 'analysis');
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, '_raw-extract.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log('Wrote', outPath);

for (const [k, v] of Object.entries(out)) {
  const comps = v.items.filter((i) => i.types.includes('component'));
  const svcs = v.items.filter((i) => i.types.includes('service'));
  const models = v.items.filter((i) => i.types.includes('model') || i.types.includes('constants'));
  console.log(
    k,
    'files=',
    v.items.length,
    'components=',
    comps.length,
    'services=',
    svcs.length,
    'models=',
    models.length
  );
  for (const c of comps) {
    console.log(
      ' -',
      c.meta?.selector || c.path,
      '|',
      c.meta?.className,
      '| in:',
      c.meta?.inputs?.length,
      'out:',
      c.meta?.outputs?.length,
      'cva:',
      c.meta?.cva
    );
  }
}
