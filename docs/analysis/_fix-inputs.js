const fs = require('fs');
const path = require('path');

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith('.component.ts') && !e.name.includes('.spec.')) acc.push(p);
    else if (e.name.endsWith('.service.ts')) acc.push(p);
  }
  return acc;
}

function extract(content) {
  const inputs = [];
  const re =
    /@Input\s*(?:\(([^)]*)\))?\s*(?:set\s+)?(\w+)\s*(?:\([^)]*\))?\s*(?::\s*([\s\S]*?))?(?:\s*=\s*([\s\S]*?))?\s*;/g;
  let m;
  while ((m = re.exec(content))) {
    let typ = (m[3] || '').trim() || null;
    let def = (m[4] || '').trim() || null;
    if (typ) typ = typ.replace(/\s+/g, ' ').slice(0, 160);
    if (def) def = def.replace(/\s+/g, ' ').slice(0, 100);
    inputs.push({
      name: m[2],
      alias: ((m[1] || '').match(/['"]([^'"]+)['"]/) || [])[1] || null,
      type: typ,
      default: def,
      required: /required:\s*true/.test(m[1] || '') || (!def && /!$/.test(typ || '')),
    });
  }
  const outputs = [];
  const outRe =
    /@Output\s*(?:\(([^)]*)\))?\s*(\w+)\s*(?:=\s*new\s+EventEmitter\s*(?:<([^>]+)>)?\s*\(\s*\))?/g;
  while ((m = outRe.exec(content))) {
    outputs.push({
      name: m[2],
      type: (m[3] || 'unknown').trim(),
    });
  }
  return {
    selector: (content.match(/selector:\s*['"]([^'"]+)/) || [])[1] || null,
    className: (content.match(/export\s+class\s+(\w+)/) || [])[1] || null,
    cva: /ControlValueAccessor/.test(content),
    standalone: /standalone:\s*true/.test(content),
    inputs,
    outputs,
    lifecycle: ['ngOnInit', 'ngOnDestroy', 'ngOnChanges', 'ngAfterViewInit', 'ngAfterContentInit'].filter(
      (h) => new RegExp('\\b' + h + '\\s*\\(').test(content)
    ),
    hostListeners: [...content.matchAll(/@HostListener\s*\(\s*['"]([^'"]+)/g)].map((x) => x[1]),
    inject: [
      ...new Set([
        ...[...content.matchAll(/inject\s*\(\s*(\w+)/g)].map((x) => x[1]),
        ...[
          ...(
            (content.match(/constructor\s*\(([^)]*)\)/s) || [])[1] || ''
          ).matchAll(/(?:private|public|protected|readonly)\s+(?:readonly\s+)?\w+\s*:\s*(\w+)/g),
        ].map((x) => x[1]),
      ]),
    ],
    methods: [
      ...content.matchAll(
        /(?:^\s*)(?:public|private|protected)?\s*(?:async\s+)?(\w+)\s*\([^)]*\)\s*(?::\s*[^{]+)?\s*\{/gm
      ),
    ]
      .map((x) => x[1])
      .filter((n) => !['constructor', 'if', 'for', 'while', 'switch', 'catch'].includes(n)),
    componentImports: (
      (content.match(/imports:\s*\[([^\]]*)\]/s) || [])[1] || ''
    )
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    implements: [...content.matchAll(/implements\s+([^{]+)/g)].map((x) =>
      x[1].replace(/\s+/g, ' ').trim()
    ),
  };
}

const bases = {
  publikator: path.join(
    'c:/Users/user/Documents/Work-2/publikator/src/app/common/components/base'
  ),
  agora: path.join(
    'c:/Users/user/Documents/Work-2/agora-frontend/src/app/common/components/base'
  ),
};

const out = {};
for (const [proj, base] of Object.entries(bases)) {
  out[proj] = {};
  for (const f of walk(base)) {
    const rel = path.relative(base, f).split(path.sep).join('/');
    out[proj][rel] = extract(fs.readFileSync(f, 'utf8'));
  }
}

const outPath = path.join(
  'c:/Users/user/Documents/Work-2/Laziar-Components/docs/analysis/_inputs-fixed.json'
);
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log('Wrote', outPath);
for (const [proj, data] of Object.entries(out)) {
  console.log('\n===' + proj + '===');
  for (const [k, v] of Object.entries(data)) {
    if (!v.className) continue;
    console.log(
      k,
      'in=' + v.inputs.length,
      v.inputs.map((i) => i.name).join(','),
      '| out=' + v.outputs.map((o) => o.name).join(',')
    );
  }
}
