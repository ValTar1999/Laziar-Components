/**
 * Generates all analysis markdown reports from _raw-extract.json + source files.
 * Read-only wrt application code; writes only under Laziar-Components/docs/analysis/.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join('c:', 'Users', 'user', 'Documents', 'Work-2');
const OUT = path.join(ROOT, 'Laziar-Components', 'docs', 'analysis');
const raw = JSON.parse(fs.readFileSync(path.join(OUT, '_raw-extract.json'), 'utf8'));

const BASE = {
  publikator: path.join(ROOT, 'publikator', 'src', 'app', 'common', 'components', 'base'),
  agora: path.join(ROOT, 'agora-frontend', 'src', 'app', 'common', 'components', 'base'),
};

/** Multiline-friendly @Input/@Output override for component metas */
function reextractComponentMeta(content) {
  const inputs = [];
  const re =
    /@Input\s*(?:\(([^)]*)\))?\s*(?:set\s+)?(\w+)\s*\??\s*(?:\([^)]*\))?\s*(?::\s*([\s\S]*?))?(?:\s*=\s*([\s\S]*?))?\s*;/g;
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
      required: /required:\s*true/.test(m[1] || ''),
    });
  }
  const outputs = [];
  const outRe =
    /@Output\s*(?:\(([^)]*)\))?\s*(\w+)\s*(?:=\s*new\s+EventEmitter\s*(?:<([^>]+)>)?\s*\(\s*\))?/g;
  while ((m = outRe.exec(content))) {
    outputs.push({ name: m[2], type: (m[3] || 'unknown').trim() });
  }
  return { inputs, outputs };
}

// Patch raw extract with accurate inputs/outputs from source
for (const projectKey of Object.keys(BASE)) {
  for (const item of raw[projectKey].items) {
    if (!item.types.includes('component') && !item.types.includes('service')) continue;
    const content = readSafe(path.join(BASE[projectKey], item.path));
    if (!content || !item.meta) continue;
    const fixed = reextractComponentMeta(content);
    if (fixed.inputs.length) item.meta.inputs = fixed.inputs;
    if (fixed.outputs.length || item.meta.outputs) item.meta.outputs = fixed.outputs;
  }
}

function readSafe(p) {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch {
    return null;
  }
}

function read(p) {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch {
    return null;
  }
}

function groupByFolder(items) {
  const map = {};
  for (const it of items) {
    const folder = it.path.split('/')[0];
    (map[folder] ||= []).push(it);
  }
  return map;
}

function purposeOf(folder, meta, files) {
  const map = {
    alert: 'Уведомление/алерт с иконкой, текстом и опциональной кнопкой закрытия',
    avatar: 'Аватар пользователя (фото или инициалы) с опциональными статус-бейджами',
    avatarGroup: 'Группа аватаров с лимитом max и счётчиком остатка',
    badge: 'Бейдж/чип с цветом, размером, иконкой или картинкой',
    button: 'Кнопка с вариантами, цветами, размерами и иконками',
    buttonGroup: 'Контейнер для группы кнопок (с/без разделителя)',
    card: 'Карточка контента (статья/медиа) с изображением и метаданными',
    carousel: 'Карусель/слайдер на базе Swiper',
    checkbox: 'Чекбокс или радио с label/description',
    dotPulse: 'Анимированная пульсирующая точка (индикатор)',
    dropdown: 'Выпадающее меню с секциями',
    icons: 'Иконка из набора Heroicons-подобных SVG',
    input: 'Текстовое поле ввода (CVA) с label/helper/ошибкой',
    languageDropdown: 'Выпадающий переключатель языка',
    loading: 'Индикатор загрузки (spinner/dot)',
    messageChat: 'Пузырь сообщения чата',
    progressCircle: 'Круговой индикатор прогресса',
    select: 'Выпадающий select',
    switchToggle: 'Переключатель on/off',
    tabButton: 'Одиночная вкладка-кнопка (навигация)',
    table: 'Таблица данных с пагинацией и кастомными ячейками',
    tabs: 'Группа вкладок с активным индексом',
    textarea: 'Многострочное текстовое поле',
    toastNotification: 'Toast-уведомления и контейнер/сервис',
    tooltip: 'Простой статичный tooltip',
    tooltipHover: 'Tooltip по hover с позиционированием',
    videoPlayer: 'Видеоплеер с кастомными контролами',
  };
  return map[folder] || (meta?.className ? `Angular ${meta.className}` : 'Элемент base UI');
}

function inventoryMd(projectKey, title) {
  const data = raw[projectKey];
  const folders = groupByFolder(data.items);
  const lines = [];
  lines.push(`# Инвентаризация base — ${title}`);
  lines.push('');
  lines.push(`> Источник: \`${data.baseDir}\``);
  lines.push(`> Сгенерировано автоматически при анализе (код не изменялся).`);
  lines.push('');
  const comps = data.items.filter((i) => i.types.includes('component'));
  const svcs = data.items.filter((i) => i.types.includes('service'));
  const models = data.items.filter((i) =>
    i.types.some((t) => ['model', 'constants', 'utility', 'class'].includes(t))
  );
  const templates = data.items.filter((i) => i.types.includes('template'));
  const styles = data.items.filter((i) => i.types.includes('styles'));
  lines.push('## Сводка');
  lines.push('');
  lines.push(`| Категория | Кол-во |`);
  lines.push(`|-----------|--------|`);
  lines.push(`| Компоненты | ${comps.length} |`);
  lines.push(`| Сервисы | ${svcs.length} |`);
  lines.push(`| Модели/константы/утилиты | ${models.length} |`);
  lines.push(`| Шаблоны (.html) | ${templates.length} |`);
  lines.push(`| Стили (.css) | ${styles.length} |`);
  lines.push(`| Файлов всего (без spec) | ${data.items.length} |`);
  lines.push(`| Папок | ${Object.keys(folders).length} |`);
  lines.push('');
  lines.push('## Полный список элементов');
  lines.push('');
  lines.push('| Путь | Имя | Тип | Назначение |');
  lines.push('|------|-----|-----|------------|');

  const rows = [];
  for (const [folder, items] of Object.entries(folders).sort()) {
    for (const it of items.sort((a, b) => a.path.localeCompare(b.path))) {
      let type = it.types.filter((t) => t !== 'typescript').join(', ') || 'typescript';
      let name = it.name;
      let purpose = purposeOf(folder, it.meta, items);
      if (it.meta?.className) {
        name = it.meta.className;
        type = it.types.includes('service')
          ? 'service'
          : it.types.includes('component')
            ? 'component'
            : type;
        if (it.meta.selector) purpose += ` (\`${it.meta.selector}\`)`;
        if (it.meta.cva) purpose += '; ControlValueAccessor';
      } else if (it.exports?.length) {
        name = it.exports.join(', ');
        type = it.types.includes('constants')
          ? 'constants/types'
          : it.types.includes('utility')
            ? 'utility'
            : 'model/types';
        purpose = `Экспорты: ${it.exports.join(', ')}`;
      } else if (it.types.includes('template')) {
        type = 'template';
        purpose = 'HTML-шаблон компонента';
      } else if (it.types.includes('styles')) {
        type = 'styles';
        purpose = 'Стили компонента';
      }
      rows.push(`| \`${it.path}\` | ${name} | ${type} | ${purpose} |`);
    }
  }
  lines.push(...rows);
  lines.push('');
  lines.push('## Компоненты (кратко)');
  lines.push('');
  for (const c of comps.sort((a, b) => a.path.localeCompare(b.path))) {
    const m = c.meta || {};
    lines.push(
      `- **${m.className}** (\`${m.selector}\`) — inputs: ${m.inputs?.length || 0}, outputs: ${m.outputs?.length || 0}, CVA: ${m.cva ? 'да' : 'нет'}, lifecycle: ${(m.lifecycle || []).join(', ') || '—'}`
    );
  }
  lines.push('');
  lines.push('## Не-компоненты');
  lines.push('');
  if (!svcs.length && !models.length) {
    lines.push('_Сервисов, пайпов, директив, гвардов и интерсепторов в `base` нет._');
  } else {
    for (const s of svcs) {
      lines.push(
        `- **Сервис** \`${s.path}\` — ${s.meta?.className || s.name}: ${purposeOf(s.path.split('/')[0], s.meta)}`
      );
    }
    for (const m of models) {
      lines.push(
        `- **${m.types.join('/')}** \`${m.path}\` — экспорты: ${(m.exports || []).join(', ') || m.name}`
      );
    }
  }
  lines.push('');
  lines.push('### Пайпы / директивы / гварды / интерсепторы');
  lines.push('');
  lines.push(
    'В папке `base` обоих проектов **не обнаружено** standalone `@Pipe`, `@Directive` (кроме компонентов), guards и interceptors — они живут вне `base` (если есть).'
  );
  lines.push('');
  return lines.join('\n');
}

function analyzeComponentDeep(projectKey, folder) {
  const base = BASE[projectKey];
  const folderPath = path.join(base, folder);
  if (!fs.existsSync(folderPath)) return null;
  const files = fs.readdirSync(folderPath).filter((f) => !f.includes('.spec.'));
  const tsComp = files.find((f) => f.endsWith('.component.ts'));
  const html = files.find((f) => f.endsWith('.html'));
  const css = files.find((f) => f.endsWith('.css') || f.endsWith('.scss'));
  const model = files.find(
    (f) =>
      f.endsWith('.ts') &&
      !f.endsWith('.component.ts') &&
      !f.includes('service') &&
      !f.includes('util')
  );
  const service = files.find((f) => f.includes('service') && f.endsWith('.ts'));
  const util = files.find((f) => /util/i.test(f) && f.endsWith('.ts'));

  const tsPath = tsComp ? path.join(folderPath, tsComp) : null;
  const ts = tsPath ? read(tsPath) : null;
  const htmlC = html ? read(path.join(folderPath, html)) : null;
  const cssC = css ? read(path.join(folderPath, css)) : null;
  const modelC = model ? read(path.join(folderPath, model)) : null;
  const svcC = service ? read(path.join(folderPath, service)) : null;

  const item = raw[projectKey].items.find(
    (i) => i.path.startsWith(folder + '/') && i.types.includes('component')
  );
  // For toast there are multiple components
  const comps = raw[projectKey].items.filter(
    (i) => i.path.startsWith(folder + '/') && i.types.includes('component')
  );

  return {
    folder,
    files,
    ts,
    html: htmlC,
    css: cssC,
    model: modelC,
    modelName: model,
    service: svcC,
    serviceName: service,
    util: util ? read(path.join(folderPath, util)) : null,
    utilName: util,
    comps,
    primary: item,
  };
}

function extractNgContent(html) {
  if (!html) return [];
  return [...html.matchAll(/<ng-content([^>]*)>/g)].map((x) => {
    const sel = x[1].match(/select=['"]([^'"]+)['"]/);
    return sel ? sel[1] : '(default)';
  });
}

function extractTemplateStructure(html) {
  if (!html) return { summary: 'нет шаблона', conditions: 0, loops: 0, classes: [] };
  const conditions = (html.match(/\*ngIf|@if\s*\(/g) || []).length;
  const loops = (html.match(/\*ngFor|@for\s*\(/g) || []).length;
  const roots = [...html.matchAll(/^\s*<([a-zA-Z0-9-]+)/gm)].map((m) => m[1]).slice(0, 8);
  const classes = [
    ...new Set([...html.matchAll(/class=['"]([^'"]+)['"]/g)].flatMap((x) => x[1].split(/\s+/))),
  ].slice(0, 40);
  const aria = [...html.matchAll(/\baria-[\w-]+(?:=['"][^'"]*['"])?|\brole=['"][^'"]+['"]/g)].map(
    (x) => x[0]
  );
  return { summary: `Корневые теги: ${roots.join(', ') || '—'}`, conditions, loops, classes, aria };
}

function extractStyleNotes(css) {
  if (!css) return { note: 'Нет отдельного CSS (стили через Tailwind-классы в шаблоне/TS).', host: false };
  const colors = [...new Set(css.match(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]+\)/g) || [])];
  const host = /:host\b/.test(css);
  const radii = [...new Set((css.match(/border-radius\s*:\s*[^;]+/g) || []))];
  const fonts = [...new Set((css.match(/font-size\s*:\s*[^;]+/g) || []))];
  const vars = [...new Set((css.match(/var\(--[\w-]+\)|--[\w-]+:/g) || []))];
  return {
    note: `Цвета: ${colors.slice(0, 12).join(', ') || '—'}; радиусы: ${radii.slice(0, 5).join('; ') || '—'}; font-size: ${fonts.slice(0, 5).join('; ') || '—'}; CSS-vars: ${vars.slice(0, 8).join(', ') || 'нет'}`,
    host,
    colors,
    radii,
    fonts,
    vars,
  };
}

function inputPurpose(name) {
  const map = {
    label: 'Подпись поля/кнопки',
    placeholder: 'Placeholder текста',
    disabled: 'Блокировка взаимодействия',
    error: 'Состояние ошибки (стили/helper)',
    helperText: 'Вспомогательный текст под контролом',
    size: 'Размерный вариант',
    variant: 'Визуальный/поведенческий вариант',
    color: 'Цветовая схема',
    icon: 'Имя иконки',
    iconName: 'Имя иконки',
    iconVariant: 'Стиль иконки (outline/solid/…)',
    iconDirection: 'Позиция иконки left/right',
    iconClass: 'Доп. CSS-классы иконки',
    iconButton: 'Иконка внутри поля (кнопка)',
    iconClickable: 'Иконка кликабельна',
    rounded: 'Полное скругление (pill)',
    border: 'Показать border',
    fullWidth: 'Растянуть на 100% ширины',
    type: 'HTML/логический тип',
    title: 'Заголовок',
    text: 'Основной текст',
    description: 'Описание',
    checked: 'Состояние checked',
    active: 'Активное состояние',
    indeterminate: 'Indeterminate checkbox',
    progress: 'Значение прогресса 0–100',
    image: 'URL изображения',
    img: 'URL изображения',
    imgUrl: 'URL аватара/фото',
    firstName: 'Имя (инициалы)',
    lastName: 'Фамилия (инициалы)',
    link: 'URL перехода',
    date: 'Дата/мета',
    subtitle: 'Подзаголовок',
    isLoading: 'Скелетон/loading',
    options: 'Список опций',
    tabs: 'Список вкладок',
    activeTab: 'Индекс активной вкладки',
    sections: 'Секции меню',
    sizeVariant: 'Размер dropdown',
    position: 'Позиция tooltip',
    theme: 'Тема dark/light',
    arrow: 'Показать стрелку tooltip',
    rows: 'Число строк textarea',
    prefix: 'Префикс в input',
    withButton: 'Кнопка слева/справа от input',
    buttonLabel: 'Текст кнопки у input',
    pill: 'Pill-скругление input',
    appearance: 'Skin/appearance input',
    ariaLabel: 'aria-label нативно',
    ariaCurrentPage: 'aria-current=page для пагинации',
    videoSrc: 'Источник видео',
    metricsType: 'Режим метрик на карточке',
    showCloseButton: 'Кнопка закрытия',
    closeColor: 'Цвет кнопки закрытия',
    buttonVariant: 'Вариант кнопки внутри alert',
    padding: 'Токен отступа',
    class: 'Доп. CSS-класс',
    name: 'Имя (иконки)',
    direction: 'Направление',
    max: 'Макс. видимых элементов',
    reverse: 'Обратный порядок',
    avatars: 'Массив аватаров',
    containerClass: 'Класс контейнера',
    topNotification: 'Верхний статус-индикатор',
    bottomNotification: 'Нижний статус-индикатор',
    imgNotification: 'Картинка уведомления на аватаре',
    message: 'Текст сообщения',
    messageBold: 'Жирная часть сообщения',
    columns: 'Колонки таблицы',
    data: 'Строки таблицы',
    article: 'Доменная модель статьи',
    publisher: 'Издатель',
    author: 'Автор',
  };
  return map[name] || 'см. использование в шаблоне/классе';
}

function formatInputs(inputs) {
  if (!inputs?.length) return '_нет_';
  return inputs
    .map((i) => {
      const req = i.required ? 'обязательный' : 'опциональный';
      const def = i.default != null && i.default !== '' ? `\`${i.default}\`` : '—';
      const typ = i.type || 'inferred';
      return `- \`${i.name}\`: \`${typ}\`, default ${def}, ${req} — ${inputPurpose(i.name)}`;
    })
    .join('\n');
}

function formatOutputs(outputs) {
  if (!outputs?.length) return '_нет_';
  return outputs
    .map((o) => `- \`${o.name}\`: EventEmitter<\`${o.type || 'unknown'}\`>`)
    .join('\n');
}

function detailedMd(projectKey, title) {
  const folders = Object.keys(groupByFolder(raw[projectKey].items)).sort();
  const lines = [];
  lines.push(`# Детальный разбор компонентов base — ${title}`);
  lines.push('');
  lines.push(`> Путь: \`${BASE[projectKey]}\``);
  lines.push('');

  for (const folder of folders) {
    const deep = analyzeComponentDeep(projectKey, folder);
    if (!deep || !deep.comps.length) {
      // maybe only models/service without component? skip or note
      const nonComp = raw[projectKey].items.filter(
        (i) => i.path.startsWith(folder + '/') && !i.types.includes('template') && !i.types.includes('styles')
      );
      if (!nonComp.some((i) => i.types.includes('component'))) {
        lines.push(`## \`${folder}/\` (не компонент)`);
        lines.push('');
        for (const i of nonComp) {
          lines.push(`- \`${i.path}\` — ${i.types.join(', ')}: ${(i.exports || [i.name]).join(', ')}`);
        }
        lines.push('');
        continue;
      }
    }

    for (const comp of deep.comps) {
      const m = comp.meta || {};
      const htmlItem = raw[projectKey].items.find(
        (i) =>
          i.path.startsWith(folder + '/') &&
          i.types.includes('template') &&
          i.path.includes(comp.path.replace('.ts', '').replace('.component', ''))
      );
      // fallback: any html in folder
      const htmlAny = raw[projectKey].items.find(
        (i) => i.path.startsWith(folder + '/') && i.types.includes('template')
      );
      const cssAny = raw[projectKey].items.find(
        (i) => i.path.startsWith(folder + '/') && i.types.includes('styles')
      );

      const tsContent = read(path.join(BASE[projectKey], comp.path));
      const htmlPath = htmlAny ? path.join(BASE[projectKey], htmlAny.path) : null;
      // Prefer matching html by component name
      const baseName = path.basename(comp.path, '.ts');
      const matchedHtml = raw[projectKey].items.find(
        (i) => i.path === `${folder}/${baseName}.html` || i.path === `${folder}/${baseName.replace('.component', '')}.html`
      );
      const htmlC = matchedHtml
        ? read(path.join(BASE[projectKey], matchedHtml.path))
        : htmlAny
          ? read(path.join(BASE[projectKey], htmlAny.path))
          : null;
      const cssC = cssAny ? read(path.join(BASE[projectKey], cssAny.path)) : null;

      const tpl = extractTemplateStructure(htmlC);
      const sty = extractStyleNotes(cssC);
      const slots = extractNgContent(htmlC);

      lines.push(`## ${m.className || comp.name}`);
      lines.push('');
      lines.push(`- **Путь:** \`${comp.path}\``);
      lines.push(`- **Селектор:** \`${m.selector || '—'}\``);
      lines.push(`- **Standalone:** ${m.standalone === null ? 'не указано' : m.standalone}`);
      lines.push(`- **Implements:** ${(m.implements || []).join(', ') || '—'}`);
      lines.push(`- **CVA:** ${m.cva ? 'да' : 'нет'}`);
      lines.push(`- **Назначение:** ${purposeOf(folder, m)}`);
      lines.push('');
      lines.push('### Inputs');
      lines.push('');
      lines.push(formatInputs(m.inputs));
      lines.push('');
      lines.push('### Outputs');
      lines.push('');
      // enrich when emitted from source
      if (m.outputs?.length && tsContent) {
        for (const o of m.outputs) {
          const emitSites = [...tsContent.matchAll(new RegExp(o.name + '\\.emit\\(([^)]*)\\)', 'g'))].map(
            (x) => x[0]
          );
          lines.push(
            `- \`${o.name}\`: EventEmitter<\`${o.type || 'unknown'}\`>; эмитится: ${
              emitSites.length ? emitSites.slice(0, 3).join('; ') : 'см. обработчики в шаблоне/классе'
            }`
          );
        }
      } else {
        lines.push(formatOutputs(m.outputs));
      }
      lines.push('');
      lines.push('### ng-content слоты');
      lines.push('');
      lines.push(slots.length ? slots.map((s) => `- \`${s}\``).join('\n') : '_нет_');
      lines.push('');
      lines.push('### Разметка');
      lines.push('');
      lines.push(`- ${tpl.summary}`);
      lines.push(`- Условия (*ngIf/@if): ${tpl.conditions}; циклы (*ngFor/@for): ${tpl.loops}`);
      if (tpl.classes?.length) {
        lines.push(`- Ключевые классы (фрагмент): \`${tpl.classes.slice(0, 25).join(' ')}\``);
      }
      lines.push('');
      lines.push('### Стили');
      lines.push('');
      lines.push(`- ${sty.note}`);
      lines.push(`- \`:host\`: ${sty.host ? 'есть' : 'нет'}`);
      lines.push(
        '- Основная стилизация: **Tailwind utility-классы** в шаблоне и/или строковых константах TS (`button.ts`, `badge.ts` и т.п.).'
      );
      lines.push('');
      lines.push('### Функционал класса');
      lines.push('');
      lines.push(`- **Lifecycle:** ${(m.lifecycle || []).join(', ') || '—'}`);
      lines.push(`- **HostListeners:** ${(m.hostListeners || []).join(', ') || '—'}`);
      lines.push(`- **Инъекции:** ${(m.inject || []).join(', ') || '—'}`);
      lines.push(
        `- **Методы (извлечённые):** ${(m.methods || []).slice(0, 25).join(', ') || '—'}${
          (m.methods || []).length > 25 ? '…' : ''
        }`
      );
      if (tsContent) {
        const hasSub = /subscribe\s*\(/.test(tsContent);
        const hasForm = /FormControl|FormGroup|NgControl/.test(tsContent);
        const hasAnim = /@angular\/animations|trigger\s*\(/.test(tsContent);
        lines.push(`- Подписки RxJS: ${hasSub ? 'да' : 'нет'}`);
        lines.push(`- Работа с формами (кроме CVA): ${hasForm ? 'да' : 'нет'}`);
        lines.push(`- Анимации Angular: ${hasAnim ? 'да' : 'нет'}`);
      }
      lines.push('');
      lines.push('### Зависимости');
      lines.push('');
      if (m.componentImports?.length) {
        lines.push(`- imports компонента: ${m.componentImports.join(', ')}`);
      }
      if (tsContent) {
        const imports = [...tsContent.matchAll(/from\s+['"]([^'"]+)['"]/g)].map((x) => x[1]);
        const third = imports.filter(
          (i) =>
            !i.startsWith('.') &&
            !i.startsWith('@angular/') &&
            i !== 'rxjs' &&
            !i.startsWith('rxjs/')
        );
        const ang = imports.filter((i) => i.startsWith('@angular/'));
        lines.push(`- Angular: ${ang.join(', ') || '—'}`);
        lines.push(`- Сторонние: ${third.join(', ') || '—'}`);
        lines.push(`- Локальные: ${imports.filter((i) => i.startsWith('.')).join(', ') || '—'}`);
      }
      lines.push('');
      lines.push('### Доступность');
      lines.push('');
      const ariaList = tpl.aria || [];
      lines.push(
        ariaList.length
          ? `- В шаблоне: ${ariaList.slice(0, 20).join(', ')}`
          : '- В шаблоне явных aria/role почти нет (или классы задают фокус через Tailwind focus:*)'
      );
      if (m.a11y?.length) lines.push(`- В TS: ${m.a11y.join(', ')}`);
      // specific a11y inputs
      const a11yInputs = (m.inputs || []).filter((i) => /aria|role|label/i.test(i.name));
      if (a11yInputs.length) {
        lines.push(`- A11y-related inputs: ${a11yInputs.map((i) => i.name).join(', ')}`);
      }
      lines.push('');
      if (deep.modelName) {
        lines.push('### Сопутствующие модели/константы');
        lines.push('');
        lines.push(`- \`${folder}/${deep.modelName}\``);
        lines.push('');
      }
      if (deep.serviceName) {
        lines.push('### Сопутствующий сервис');
        lines.push('');
        lines.push(`- \`${folder}/${deep.serviceName}\``);
        lines.push('');
      }
      lines.push('---');
      lines.push('');
    }
  }
  return lines.join('\n');
}

// --- Comparison helpers ---
const PAIR_FOLDERS = [
  'alert',
  'avatar',
  'avatarGroup',
  'badge',
  'button',
  'buttonGroup',
  'card',
  'carousel',
  'checkbox',
  'dotPulse',
  'dropdown',
  'icons',
  'input',
  'languageDropdown',
  'loading',
  'progressCircle',
  'select',
  'switchToggle',
  'tabButton',
  'tabs',
  'textarea',
  'tooltip',
  'tooltipHover',
  'videoPlayer',
];

const PUBLIKATOR_ONLY = ['messageChat', 'table', 'toastNotification'];

function getCompMeta(projectKey, folder) {
  return raw[projectKey].items.filter(
    (i) => i.path.startsWith(folder + '/') && i.types.includes('component')
  );
}

function verdictFor(folder, notes) {
  // heuristic from known differences - refined below in comparison content
  return notes.verdict || '🟡';
}

function comparisonMd() {
  const lines = [];
  lines.push('# Сравнение пар компонентов publikator ↔ agora-frontend');
  lines.push('');
  lines.push(
    'Сопоставление по сути (одна задача UI). Вердикты: 🟢 идентичные / 🟡 параметризуемые / 🔴 требуют нового дизайна API.'
  );
  lines.push('');

  // Detailed pair notes curated from extraction + source review
  const curated = buildCuratedPairs();

  for (const pair of curated) {
    lines.push(`## ${pair.title}`);
    lines.push('');
    lines.push(`**Вердикт: ${pair.verdict} ${pair.verdictLabel}**`);
    lines.push('');
    lines.push(pair.summary);
    lines.push('');
    lines.push('### Таблица различий (шаг 2)');
    lines.push('');
    lines.push('| Аспект | publikator | agora-frontend |');
    lines.push('|--------|------------|----------------|');
    for (const row of pair.rows) {
      lines.push(`| ${row[0]} | ${row[1]} | ${row[2]} |`);
    }
    lines.push('');
    lines.push('### Объединённый API');
    lines.push('');
    lines.push('**Inputs:**');
    lines.push(pair.unifiedInputs.map((x) => `- ${x}`).join('\n') || '_нет_');
    lines.push('');
    lines.push('**Outputs:**');
    lines.push(pair.unifiedOutputs.map((x) => `- ${x}`).join('\n') || '_нет_');
    lines.push('');
    if (pair.nameConflicts?.length) {
      lines.push('### Конфликты имён inputs');
      lines.push('');
      for (const c of pair.nameConflicts) lines.push(`- ${c}`);
      lines.push('');
    }
    if (pair.typeConflicts?.length) {
      lines.push('### Конфликты типов');
      lines.push('');
      for (const c of pair.typeConflicts) lines.push(`- ${c}`);
      lines.push('');
    }
    if (pair.optionalFeatures?.length) {
      lines.push('### Функционал только в одном проекте → опционально');
      lines.push('');
      for (const c of pair.optionalFeatures) lines.push(`- ${c}`);
      lines.push('');
    }
    if (pair.design) {
      lines.push('### Дизайн');
      lines.push('');
      lines.push(pair.design);
      lines.push('');
    }
    lines.push('---');
    lines.push('');
  }

  lines.push('## Только в publikator (пар нет)');
  lines.push('');
  for (const f of PUBLIKATOR_ONLY) {
    const comps = getCompMeta('publikator', f);
    lines.push(
      `- **${f}**: ${comps.map((c) => `\`${c.meta?.selector}\` (${c.meta?.className})`).join(', ') || f} — переносить как новые shared-компоненты (нет аналога в agora base).`
    );
  }
  lines.push('');
  lines.push('## Только в agora-frontend');
  lines.push('');
  lines.push(
    '_Папок, отсутствующих в publikator `base`, нет. Однако у Card/Input/Select в agora есть уникальные возможности (см. пары выше)._'
  );
  lines.push('');
  return lines.join('\n');
}

function inpList(project, folder) {
  const comps = getCompMeta(project, folder);
  const inputs = [];
  for (const c of comps) for (const i of c.meta?.inputs || []) inputs.push(i);
  return inputs;
}

function outList(project, folder) {
  const comps = getCompMeta(project, folder);
  const outs = [];
  for (const c of comps) for (const o of c.meta?.outputs || []) outs.push(o);
  return outs;
}

function buildCuratedPairs() {
  const pairs = [];

  function autoPair(folder, title, overrides = {}) {
    const pIn = inpList('publikator', folder);
    const aIn = inpList('agora', folder);
    const pOut = outList('publikator', folder);
    const aOut = outList('agora', folder);
    const pNames = new Set(pIn.map((i) => i.name));
    const aNames = new Set(aIn.map((i) => i.name));
    const onlyP = [...pNames].filter((n) => !aNames.has(n));
    const onlyA = [...aNames].filter((n) => !pNames.has(n));
    const both = [...pNames].filter((n) => aNames.has(n));
    const typeConflicts = [];
    for (const n of both) {
      const pt = pIn.find((i) => i.name === n)?.type;
      const at = aIn.find((i) => i.name === n)?.type;
      if (pt && at && pt.replace(/\s/g, '') !== at.replace(/\s/g, '')) {
        typeConflicts.push(
          `\`${n}\`: publikator \`${pt}\` vs agora \`${at}\` → взять union/более широкий тип или нормализовать к канону`
        );
      }
    }
    let verdict = '🟢';
    let verdictLabel = 'идентичные';
    if (onlyP.length || onlyA.length || typeConflicts.length || overrides.forceYellow) {
      verdict = '🟡';
      verdictLabel = 'параметризуемые';
    }
    if (overrides.forceRed) {
      verdict = '🔴';
      verdictLabel = 'требуют нового дизайна API';
    }
    if (overrides.verdict) {
      verdict = overrides.verdict;
      verdictLabel = overrides.verdictLabel || verdictLabel;
    }

    const pComp = getCompMeta('publikator', folder)[0];
    const aComp = getCompMeta('agora', folder)[0];

    pairs.push({
      title: `${title} (\`${folder}\`)`,
      verdict,
      verdictLabel,
      summary:
        overrides.summary ||
        `Селекторы: publikator \`${pComp?.meta?.selector}\`, agora \`${aComp?.meta?.selector}\`. Общих inputs: ${both.length}; только publikator: ${onlyP.join(', ') || '—'}; только agora: ${onlyA.join(', ') || '—'}.`,
      rows: overrides.rows || [
        ['Селектор', pComp?.meta?.selector || '—', aComp?.meta?.selector || '—'],
        ['CVA', pComp?.meta?.cva ? 'да' : 'нет', aComp?.meta?.cva ? 'да' : 'нет'],
        [
          'Inputs',
          pIn.map((i) => i.name).join(', ') || '—',
          aIn.map((i) => i.name).join(', ') || '—',
        ],
        [
          'Outputs',
          pOut.map((o) => o.name).join(', ') || '—',
          aOut.map((o) => o.name).join(', ') || '—',
        ],
        [
          'Lifecycle',
          (pComp?.meta?.lifecycle || []).join(', ') || '—',
          (aComp?.meta?.lifecycle || []).join(', ') || '—',
        ],
      ],
      unifiedInputs: [
        ...new Set([
          ...pIn.map((i) => `\`${i.name}\`: ${i.type || '?'} = ${i.default ?? '—'}`),
          ...aIn.map((i) => `\`${i.name}\`: ${i.type || '?'} = ${i.default ?? '—'}`),
        ]),
      ],
      unifiedOutputs: [
        ...new Set([
          ...pOut.map((o) => `\`${o.name}\`: ${o.type || 'unknown'}`),
          ...aOut.map((o) => `\`${o.name}\`: ${o.type || 'unknown'}`),
        ]),
      ],
      nameConflicts: overrides.nameConflicts || [],
      typeConflicts: [...typeConflicts, ...(overrides.typeConflicts || [])],
      optionalFeatures: [
        ...onlyP.map((n) => `publikator-only \`${n}\` → optional input (default безопасный)`),
        ...onlyA.map((n) => `agora-only \`${n}\` → optional input (default безопасный)`),
        ...(overrides.optionalFeatures || []),
      ],
      design: overrides.design || 'Оба проекта опираются на общий Tailwind-дизайн (Onest, палитра red/gray/…). Расхождения в основном в spacing utility и disabled-ключах.',
    });
  }

  autoPair('button', 'Button', {
    verdict: '🟡',
    verdictLabel: 'параметризуемые',
    summary:
      'Одинаковый селектор `app-button` и почти один API, но в publikator добавлены a11y inputs + `buttonClick` output + HostBinding fullWidth; различается канон ключей disabled* в `button.ts` и мелкие spacing (gap-2 vs space-x-2, padding sm/xl).',
    rows: [
      ['Селектор', '`app-button`', '`app-button`'],
      ['Outputs', '`buttonClick`', 'нет (native click в шаблоне)'],
      ['A11y inputs', '`ariaLabel`, `ariaCurrentPage`', 'нет'],
      ['HostBinding', 'inline-flex/items-center/justify-center/w-full', 'нет'],
      ['Disabled keys в tokens', '`disabledprimary` (lowercase merge)', '`disabledPrimary` (Pascal)'],
      ['common classes', '`gap-2`', '`space-x-2`'],
      ['size sm default pad', '`px-3 py-1.5`', '`px-2 py-1.5`'],
      ['icon-only xl pad', '`p-3`', '`p-4`'],
      ['gray disabled primary', '`bg-gray-900/30`', '`bg-[#B3B3B3]`'],
    ],
    nameConflicts: [],
    optionalFeatures: [
      '`buttonClick` output → включить всегда (канон), в agora заменить `(click)` на него',
      '`ariaLabel` / `ariaCurrentPage` → optional, default undefined/false',
    ],
    design:
      'Брать **publikator** как базу API (a11y + явный output). Токены цветов: унифицировать disabled-ключи к одному стилю (`disabledPrimary`) и убрать хардкод `#B3B3B3` в пользу token `gray-300`/`gray-900/30`. Spacing: `gap-2` предпочтительнее `space-x-2`.',
  });

  autoPair('input', 'Input field', {
    verdict: '🟡',
    verdictLabel: 'параметризуемые',
    summary:
      'Оба — CVA `app-input-field`. Agora расширяет внешний вид (`pill`, `appearance: default|laziarPanel`).',
    optionalFeatures: [
      '`pill` (agora) → optional boolean false',
      '`appearance` (agora) → optional enum, default `default`',
    ],
    design: 'Визуальные appearance-варианты agora полезны для бренд-панелей — оставить как optional skin.',
  });

  autoPair('select', 'Select', {
    verdict: '🔴',
    verdictLabel: 'требуют нового дизайна API',
    summary:
      'Критичное расхождение: в publikator `options: SelectOptionType[]` + CVA + `opened` output; в agora `options: string[]` без CVA. Нужен единый контракт опций и форм.',
    typeConflicts: [
      '`options`: `SelectOptionType[]` (pub) vs `string[]` (agora) → канон: `SelectOptionType[] | string[]` с нормализацией, deprecate raw string[] через адаптер',
    ],
    optionalFeatures: [
      'CVA — обязательно в shared (как в publikator)',
      '`opened` output — optional',
    ],
    design: 'UI близкий; API данных — нет. Проектировать SelectOption {label, value, disabled?} как канон.',
  });

  autoPair('textarea', 'Textarea', {
    verdict: '🟡',
    verdictLabel: 'параметризуемые',
    summary: 'Publikator реализует CVA; agora — нет (только inputs). Нужно подтянуть CVA в shared.',
    optionalFeatures: ['CVA из publikator — сделать обязательным контрактом shared'],
  });

  autoPair('card', 'Card', {
    verdict: '🔴',
    verdictLabel: 'требуют нового дизайна API',
    summary:
      'Сильно разошлись: agora — полноценная article-card с `Article`, layout-режимами row, `openArticle` output и сервисами; publikator — упрощённая презентационная карточка. Общий «ядерный» вид + feature-flags/variants.',
    optionalFeatures: [
      'agora: `article`, `publisher`, `author`, `row*`, `openArticleId`, `openArticle`, `showBottomBorder` → variant=`article` / feature inputs',
      'publikator: более простой API — базовый variant=`media`',
    ],
    design:
      'Взять визуальную зрелость **agora** (row layouts, identity) как advanced variant; простой API publikator — default presentational mode без зависимости от Article model.',
  });

  autoPair('alert', 'Alert', {
    verdict: '🟢',
    verdictLabel: 'идентичные',
    summary:
      'Селектор и набор inputs совпадают. Различия косметические (формат union `buttonVariant`).',
  });
  autoPair('avatar', 'Avatar', {
    verdict: '🟢',
    verdictLabel: 'идентичные',
    summary:
      'API совпадает. Типы size выражены по-разному (`AvatarSizeKey` vs `keyof typeof AVATAR_SIZES`) при том же наборе ключей. В publikator — `buildAvatarInitials` в `avatar.ts`.',
  });
  autoPair('avatarGroup', 'Avatar group');
  autoPair('badge', 'Badge');
  autoPair('buttonGroup', 'Button group');
  autoPair('checkbox', 'Checkbox');
  autoPair('switchToggle', 'Switch toggle');
  autoPair('tabs', 'Tabs');
  autoPair('tabButton', 'Tab button');
  autoPair('tooltip', 'Tooltip');
  autoPair('tooltipHover', 'Tooltip hover');
  autoPair('loading', 'Loading');
  autoPair('progressCircle', 'Progress circle');
  autoPair('dropdown', 'Dropdown', {
    verdict: '🟢',
    verdictLabel: 'идентичные',
    summary:
      'Одинаковый API; default `title`: publikator `"Menu"`, agora `"Меню"` — вынести i18n наружу.',
    design: 'Не хардкодить язык в default — `title` без дефолта или i18n key.',
  });
  autoPair('icons', 'Icon');
  autoPair('languageDropdown', 'Language dropdown', {
    verdict: '🟢',
    verdictLabel: 'идентичные',
    summary:
      'Практически идентичны: languages[], localStorage `appLanguage`, outside-click. Нет @Input/@Output. Общий баг removeEventListener+bind.',
    optionalFeatures: [
      '`languages` input → optional',
      '`languageChange` output → вместо localStorage side-effect',
    ],
  });
  autoPair('carousel', 'Carousel / Swiper', {
    verdict: '🟡',
    verdictLabel: 'параметризуемые',
    summary:
      'Оба `app-swiper` без inputs. Publikator импортирует `swiper`+css; agora — `swiper!: any`.',
    optionalFeatures: ['`options` SwiperOptions → optional', 'ng-content слайдов → канон'],
  });
  autoPair('dotPulse', 'Pulse dot');
  autoPair('videoPlayer', 'Video player', {
    verdict: '🟡',
    verdictLabel: 'параметризуемые',
    summary:
      'Video.js + nuevo. Publikator: `@Input() videoSrc`. Agora: `videoSrc` — поле класса (не Input). Лицензия захардкожена.',
    optionalFeatures: [
      '`videoSrc` — канонический @Input',
      'license/logoPath — injection token',
    ],
  });

  return pairs;
}

function servicesComparisonMd() {
  const lines = [];
  lines.push('# Сравнение не-компонентов (сервисы, модели, утилиты)');
  lines.push('');
  lines.push('## Сервисы');
  lines.push('');
  lines.push('| Элемент | publikator | agora-frontend | Вывод |');
  lines.push('|---------|------------|----------------|-------|');
  lines.push(
    '| ToastService | `toastNotification/toast.service.ts` | нет в base | Переносить в shared вместе с toast UI; в agora подключать при миграции уведомлений |'
  );
  lines.push(
    '| Прочие сервисы в base | нет | нет | Card в agora тянет внешние сервисы (вне base) — при переносе Card не тащить app-сервисы в shared ядро |'
  );
  lines.push('');
  lines.push('## Пайпы / директивы / гварды / интерсепторы');
  lines.push('');
  lines.push(
    'В `base` **обоих** проектов отсутствуют. Дублирования на уровне base нет.'
  );
  lines.push('');
  lines.push('## Модели / константы / токены стилей');
  lines.push('');
  lines.push('| Файл-паттерн | publikator | agora | Различия | Объединение |');
  lines.push('|--------------|------------|-------|----------|-------------|');
  lines.push(
    '| `button/button.ts` | Variants, sizes, classes, Colors | то же | ключи disabled*, gap vs space-x, padding sm/xl, disabled gray color | Единый tokens-файл + changelog deprecated keys |'
  );
  lines.push(
    '| `badge/badge.ts` | Colors/Sizes/types | есть | сверить палитры | Merge |'
  );
  lines.push(
    '| `alert/alert.ts` | Variants/Colors | есть | сверить | Merge |'
  );
  lines.push(
    '| `avatar/avatar.ts` | sizes/colors | есть | сверить AVATAR_SIZES | Merge; util из publikator если есть |'
  );
  lines.push(
    '| `input/input.ts` | Colors и пр. | есть | appearance/pill только в компоненте agora | Tokens общие; appearance в component API |'
  );
  lines.push(
    '| `icons/icon.ts` | TIconName/Variant/Direction | есть | набор имён иконок может отличаться | Объединить union TIconName = pub ∪ agora |'
  );
  lines.push('');
  lines.push('## Утилиты');
  lines.push('');
  const pubUtils = raw.publikator.items.filter(
    (i) => /util/i.test(i.path) || i.types.includes('utility')
  );
  const agoraUtils = raw.agora.items.filter(
    (i) => /util/i.test(i.path) || i.types.includes('utility')
  );
  lines.push(
    `- publikator utils в base: ${pubUtils.map((u) => u.path).join(', ') || 'не найдено отдельным файлом (часть логики в component/ts models)'}`
  );
  lines.push(
    `- agora utils в base: ${agoraUtils.map((u) => u.path).join(', ') || 'не найдено'}`
  );
  lines.push('');
  lines.push('## Что можно объединить в первую очередь');
  lines.push('');
  lines.push('1. `button.ts` / `badge.ts` / `alert.ts` / `avatar.ts` / `input.ts` / `icon.ts` — design tokens + types');
  lines.push('2. Общие presentational компоненты без app-домена (button, badge, checkbox, switch, loading, tooltip*)');
  lines.push('3. Form controls с CVA (input, textarea, select) — после унификации SelectOption');
  lines.push('4. Toast stack (только publikator) — как новый shared module');
  lines.push('5. Table / MessageChat — domain-leaning; после ядра');
  lines.push('');
  return lines.join('\n');
}

function designAuditMd() {
  const lines = [];
  lines.push('# Design audit — tokens из base + tailwind.config');
  lines.push('');
  lines.push('Сравнение значений, используемых в `base` и корневых `tailwind.config.js`.');
  lines.push('');

  lines.push('## Палитра (semantic scales)');
  lines.push('');
  lines.push(
    'Обе темы содержат одинаковые шкалы: `red`, `magenta`, `purple`, `violet`, `blue`, `cyan`, `teal`, `mint`, `green`, `kiwi`, `avocado`, `dijon`, `yellow`, `amber`, `orange`, `coral`, `gray`, `warmGray` (+ `surface`, 50–900) и набор `c*` legacy hex.'
  );
  lines.push('');
  lines.push('| Токен | Совпадение | Комментарий |');
  lines.push('|-------|------------|-------------|');
  lines.push('| Brand scales (red…warmGray) | ✅ совпадают | Можно вынести в shared tokens as-is |');
  lines.push('| Legacy `cFFFFFA`, `c121212`, … | ✅ почти все | |');
  lines.push('| `c9AD0FF` | ❌ только agora | Добавить в shared или удалить если не нужен base |');
  lines.push('| Button disabled gray | ❌ | pub `gray-900/30` vs agora `#B3B3B3` |');
  lines.push('');

  lines.push('## Типографика');
  lines.push('');
  lines.push('| Токен | publikator | agora |');
  lines.push('|-------|------------|-------|');
  lines.push('| fontFamily | bitter, lora, onest | bitter, lora, onest |');
  lines.push('| fontSize xs…10xl | одинаковые rem+letterSpacing | одинаковые + **много** `s*-l*` (10–56px) |');
  lines.push('| fontWeight mediumbold | `570` (есть) | нет в extend |');
  lines.push('');
  lines.push(
    '**Вывод:** базовые rem-размеры совпадают; у agora расширенный набор pixel-scale для контентных страниц — в design tokens держать оба слоя (`type.scale` + `type.legacyPx`).'
  );
  lines.push('');

  lines.push('## Отступы / spacing');
  lines.push('');
  lines.push('| Токен | publikator | agora |');
  lines.push('|-------|------------|-------|');
  lines.push('| spacing 2.5 | `10px` | нет в extend (есть в safelist p-2.5) |');
  lines.push('| spacing 13/18/30/33/37/110 | есть | есть |');
  lines.push('| width/height 260/368 | нет | есть |');
  lines.push('| maxWidth 380/632/… | частично | расширеннее |');
  lines.push('| Button gap | `gap-2` | `space-x-2` |');
  lines.push('');

  lines.push('## Радиусы');
  lines.push('');
  lines.push(
    'В button tokens: `rounded-lg` (xl–sm), `rounded-md` (xs), `rounded-full` при `rounded=true`. Совпадает. В CSS-файлах base радиусы встречаются точечно (video/tooltip) — см. raw extract.'
  );
  lines.push('');

  lines.push('## Тени');
  lines.push('');
  lines.push(
    'В base мало кастомных box-shadow; используется Tailwind `shadow-xs` / default. Publikator safelist включает `shadow-xs`. Отдельных расходящихся shadow-токенов в button/badge почти нет.'
  );
  lines.push('');

  lines.push('## Брейкпоинты');
  lines.push('');
  lines.push('| publikator | agora |');
  lines.push('|------------|-------|');
  lines.push('| sm 640, md 768, lg 1024, xl 1280, 2xl 1536 | dsm 414, d2sm 450, d3sm 600, md 768, dxl 1024, d1200 1200, d2xl 1312, d3xl 1920 |');
  lines.push('');
  lines.push(
    '**Критичное расхождение.** Для shared components предпочитать стандартные `sm/md/lg/xl` (publikator) либо ввести алиасы `dxl→lg`. Demo-брейкпоинты agora не тащить в library API.'
  );
  lines.push('');

  lines.push('## Переходы / анимации');
  lines.push('');
  lines.push('| | publikator | agora |');
  lines.push('|--|------------|-------|');
  lines.push('| button transition | `transition-colors duration-300` | то же |');
  lines.push('| keyframes flash-code | да | да |');
  lines.push('| toast-slide-up | да (toast) | нет |');
  lines.push('');

  // collect CSS hardcodes from raw
  const collectDesign = (key) => {
    const colors = new Set();
    const radii = new Set();
    const fonts = new Set();
    const shadows = new Set();
    const transitions = new Set();
    for (const it of raw[key].items) {
      if (!it.design) continue;
      (it.design.colors || []).forEach((c) => colors.add(c));
      (it.design.radii || []).forEach((c) => radii.add(c));
      (it.design.fonts || []).forEach((c) => fonts.add(c));
      (it.design.shadows || []).forEach((c) => shadows.add(c));
      (it.design.transitions || []).forEach((c) => transitions.add(c));
    }
    return { colors, radii, fonts, shadows, transitions };
  };
  const pd = collectDesign('publikator');
  const ad = collectDesign('agora');

  lines.push('## Хардкоды из CSS файлов base');
  lines.push('');
  lines.push('### publikator');
  lines.push(`- colors: ${[...pd.colors].join(', ') || '—'}`);
  lines.push(`- radii: ${[...pd.radii].join(' | ') || '—'}`);
  lines.push(`- font-size: ${[...pd.fonts].join(' | ') || '—'}`);
  lines.push(`- shadows: ${[...pd.shadows].join(' | ') || '—'}`);
  lines.push(`- transitions: ${[...pd.transitions].join(' | ') || '—'}`);
  lines.push('');
  lines.push('### agora-frontend');
  lines.push(`- colors: ${[...ad.colors].join(', ') || '—'}`);
  lines.push(`- radii: ${[...ad.radii].join(' | ') || '—'}`);
  lines.push(`- font-size: ${[...ad.fonts].join(' | ') || '—'}`);
  lines.push(`- shadows: ${[...ad.shadows].join(' | ') || '—'}`);
  lines.push(`- transitions: ${[...ad.transitions].join(' | ') || '—'}`);
  lines.push('');
  lines.push('## Рекомендация по design tokens');
  lines.push('');
  lines.push('1. Вынести color scales + `cFFFFFA` background в `@laziar/tokens`.');
  lines.push('2. Typography: rem-scale (общая) + optional px-scale (agora).');
  lines.push('3. Breakpoints: канон Tailwind default; demo-* только в agora app.');
  lines.push('4. Component tokens (button sizes/colors) — один модуль, версионировать ключи disabled*.');
  lines.push('');
  return lines.join('\n');
}

function summaryMd(pairs) {
  const lines = [];
  const counts = { green: 0, yellow: 0, red: 0 };
  for (const p of pairs) {
    if (p.verdict.includes('🟢')) counts.green++;
    else if (p.verdict.includes('🔴')) counts.red++;
    else counts.yellow++;
  }

  const pubComps = raw.publikator.items.filter((i) => i.types.includes('component')).length;
  const agoraComps = raw.agora.items.filter((i) => i.types.includes('component')).length;
  const pubFiles = raw.publikator.items.length;
  const agoraFiles = raw.agora.items.length;

  lines.push('# Сводка анализа base (publikator × agora-frontend)');
  lines.push('');
  lines.push('## Объём');
  lines.push('');
  lines.push('| | publikator | agora-frontend |');
  lines.push('|--|------------|----------------|');
  lines.push(`| Файлов в base (без spec) | ${pubFiles} | ${agoraFiles} |`);
  lines.push(`| Компонентов | ${pubComps} | ${agoraComps} |`);
  lines.push(`| Сервисов | 1 (ToastService) | 0 |`);
  lines.push(`| Папок | 27 | 24 |`);
  lines.push(`| Пар для сравнения | ${pairs.length} |`);
  lines.push(`| Только publikator | messageChat, table, toastNotification |`);
  lines.push('');
  lines.push('## Вердикты по парам');
  lines.push('');
  lines.push(`| Вердикт | Кол-во |`);
  lines.push(`|---------|--------|`);
  lines.push(`| 🟢 идентичные | ${counts.green} |`);
  lines.push(`| 🟡 параметризуемые | ${counts.yellow} |`);
  lines.push(`| 🔴 новый API | ${counts.red} |`);
  lines.push('');
  lines.push('### Список по вердиктам');
  lines.push('');
  for (const v of ['🟢', '🟡', '🔴']) {
    lines.push(`**${v}**`);
    for (const p of pairs.filter((x) => x.verdict.includes(v))) {
      lines.push(`- ${p.title}`);
    }
    lines.push('');
  }

  lines.push('## Конфликты имён inputs');
  lines.push('');
  const nameConflicts = pairs.flatMap((p) =>
    (p.nameConflicts || []).map((c) => `- (${p.title}) ${c}`)
  );
  lines.push(
    nameConflicts.length
      ? nameConflicts.join('\n')
      : '_Прямых конфликтов «одно назначение — разные имена» почти нет; расхождения в основном в наличии/отсутствии inputs (`ariaLabel`, `pill`, `appearance`, card row*). Исключение по смыслу: Select `options` (разные типы под одним именем)._'
  );
  lines.push('');
  lines.push('## Рекомендуемый порядок переноса');
  lines.push('');
  lines.push('1. **Design tokens** (`button.ts`/`badge.ts`/palette/tailwind shared) + Icon');
  lines.push('2. **🟢/простые 🟡:** PulseDot, Loading, ProgressCircle, Badge, Checkbox, Switch, Tooltip, TooltipHover, ButtonGroup, Avatar, AvatarGroup, Alert, TabButton, Tabs');
  lines.push('3. **Button** (унификация disabled keys + a11y output)');
  lines.push('4. **Input + Textarea** (CVA + appearance/pill optional)');
  lines.push('5. **Select** (новый контракт options + CVA) — 🔴');
  lines.push('6. **Dropdown, LanguageDropdown, Swiper, VideoPlayer** (параметризация)');
  lines.push('7. **Card** — спроектировать dual-mode API — 🔴');
  lines.push('8. **Toast / Table / MessageChat** (publikator-only)');
  lines.push('');
  lines.push('## Риски');
  lines.push('');
  lines.push('- **Breakpoints agora (`d*`) vs стандартные** — ломают responsive classes при шаринге шаблонов.');
  lines.push('- **Select options type mismatch** — тихие runtime-баги при наивном merge.');
  lines.push('- **Card зависимость от Article/сервисов agora** — нельзя слепо переносить в library.');
  lines.push('- **Disabled key casing** в button tokens — часть disabled-стилей может «отвалиться».');
  lines.push('- **i18n defaults** (`Меню` vs `Menu`) — хардкод языка в компонентах.');
  lines.push('- **Tailwind safelist** различается — динамические классы могут пропасть без общего safelist.');
  lines.push('- **Иконочный union** может разъехаться — missing icons at runtime.');
  lines.push('');
  lines.push('## Артефакты');
  lines.push('');
  lines.push('- `publikator-base-inventory.md`');
  lines.push('- `agora-base-inventory.md`');
  lines.push('- `components-detailed-publikator.md`');
  lines.push('- `components-detailed-agora.md`');
  lines.push('- `components-comparison.md`');
  lines.push('- `services-comparison.md`');
  lines.push('- `design-audit.md`');
  lines.push('- `_raw-extract.json` (машинный экстракт)');
  lines.push('');
  return lines.join('\n');
}

// Generate all
const pairs = buildCuratedPairs();
function writeUtf8(file, content) {
  fs.writeFileSync(file, '\uFEFF' + content, 'utf8');
}

writeUtf8(path.join(OUT, 'publikator-base-inventory.md'), inventoryMd('publikator', 'publikator'));
writeUtf8(path.join(OUT, 'agora-base-inventory.md'), inventoryMd('agora', 'agora-frontend'));
writeUtf8(
  path.join(OUT, 'components-detailed-publikator.md'),
  detailedMd('publikator', 'publikator')
);
writeUtf8(path.join(OUT, 'components-detailed-agora.md'), detailedMd('agora', 'agora-frontend'));
writeUtf8(path.join(OUT, 'components-comparison.md'), comparisonMd());
writeUtf8(path.join(OUT, 'services-comparison.md'), servicesComparisonMd());
writeUtf8(path.join(OUT, 'design-audit.md'), designAuditMd());
writeUtf8(path.join(OUT, 'summary.md'), summaryMd(pairs));
console.log('All reports written to', OUT);
console.log(
  'Verdicts',
  pairs.reduce((a, p) => {
    a[p.verdict] = (a[p.verdict] || 0) + 1;
    return a;
  }, {})
);
