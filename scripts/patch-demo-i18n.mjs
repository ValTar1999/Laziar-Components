import fs from 'fs';

const demos = {
  en: {
    'button-group': {
      demo: { left: 'Left', center: 'Center', right: 'Right' },
    },
    tooltip: { demo: { trigger: 'Hover me' } },
    tabs: {
      demo: { overview: 'Overview', members: 'Members', settings: 'Settings' },
    },
    'tab-button': { demo: { overview: 'Overview' } },
    select: {
      demo: { optionA: 'Option A', optionB: 'Option B', optionC: 'Option C' },
    },
  },
  ru: {
    'button-group': {
      demo: { left: 'Слева', center: 'Центр', right: 'Справа' },
    },
    tooltip: { demo: { trigger: 'Наведи' } },
    tabs: {
      demo: { overview: 'Обзор', members: 'Участники', settings: 'Настройки' },
    },
    'tab-button': { demo: { overview: 'Обзор' } },
    select: {
      demo: { optionA: 'Опция A', optionB: 'Опция B', optionC: 'Опция C' },
    },
  },
  ro: {
    'button-group': {
      demo: { left: 'Stânga', center: 'Centru', right: 'Dreapta' },
    },
    tooltip: { demo: { trigger: 'Treci cu mouse-ul' } },
    tabs: {
      demo: { overview: 'Prezentare', members: 'Participanți', settings: 'Setări' },
    },
    'tab-button': { demo: { overview: 'Prezentare' } },
    select: {
      demo: { optionA: 'Opțiunea A', optionB: 'Opțiunea B', optionC: 'Opțiunea C' },
    },
  },
};

for (const lang of ['en', 'ru', 'ro']) {
  const path = `projects/docs/public/assets/i18n/${lang}.json`;
  const json = JSON.parse(fs.readFileSync(path, 'utf8'));
  for (const [id, patch] of Object.entries(demos[lang])) {
    json.components[id] = { ...json.components[id], ...patch };
  }
  fs.writeFileSync(path, JSON.stringify(json, null, 2) + '\n');
}
console.log('demos patched');
