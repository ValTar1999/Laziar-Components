# DECISIONS — Angular upgrade (publikator)

**Дата:** 2026-07-22  
**Контекст:** оценка апгрейда publikator с Angular **17.3** до **19** или **20**  
**Статус решения:** рекомендовано целевое **Angular 20.3.x** (довести уже начатый апгрейд)

---

## 1. Фактическое состояние репозитория (важно)

| Слой | Версия |
|------|--------|
| Установлено в `node_modules` | **Angular 17.3.12** / CLI **17.3.17** / TS **5.4.5** / zone.js **0.14.10** |
| Объявлено в `package.json` + `package-lock.json` | **Angular 20.3.25** / CLI **20.3.30** / TS **5.8.3** / zone.js **~0.15.1** |
| Node (локально / engines) | Node **22.16.0**; `engines.node`: `^20.19.0 \|\| ^22.12.0 \|\| ^24.0.0`; `.nvmrc` = `22` |

В git уже есть последовательные коммиты апгрейда (2026-06-30):

1. `7c1cd1b` — Upgrade to Angular **18** (+ `provideHttpClient`, правки spec)
2. `108462c` — Upgrade to Angular **19** (TS 5.8.3, zone.js 0.15.1)
3. `ae79930` — Upgrade to Angular **20** (`moduleResolution: bundler`, schematics type suffixes в `angular.json`)

**Вывод:** манифест уже на 20, но рабочее дерево зависимостей всё ещё на 17.3 — апгрейд **не завершён установкой**. Любая оценка «с нуля 17→19/20» должна учитывать этот разрыв.

---

## 2. Результат `ng update` / dry-run

### Команда обзора (установленный CLI 17.3)

```text
npx ng update
```

Результат:

```text
@angular/cdk   17.3.10 -> 18.2.9   ng update @angular/cdk@18
@angular/cli   17.3.17 -> 18.2.9   ng update @angular/cli@18
@angular/core  17.3.12 -> 18.2.9   ng update @angular/core@18
```

CLI предлагает **только следующий major (18)** — политика Angular: один major за шаг.

### `--dry-run`

```text
npx ng update @angular/core@19 @angular/cli@19 --dry-run --force
npx ng update @angular/core@20 @angular/cli@20 --dry-run --force
→ Error: Unknown argument: dry-run
```

У **Angular CLI 17.3** флага `--dry-run` для `ng update` **нет** (см. `ng update --help`: есть `--migrate-only`, `--from`/`--to`, `--force`, `--verbose`, `--create-commits`).

**Эквивалент «dry» на текущем CLI:** `npx ng update` (список доступных обновлений) + чтение update guide / diff уже сделанных коммитов. Полноценный preview миграций 19/20 возможен только после установки соответствующего major CLI (или через `--migrate-only` после появления пакетов в `node_modules`).

### Предупреждение CLI

```text
Node: 22.16.0 (Unsupported)   # для Angular 17
```

Для Angular **20** Node 22.16 как раз в диапазоне support (`^22.12.0`) — после перехода на 20 это предупреждение уйдёт.

---

## 3. Breaking changes по ступеням (релевантные publikator)

### 17 → 18

| Тема | Влияние на publikator |
|------|------------------------|
| `HttpClientModule` → `provideHttpClient()` | **Уже сделано** в `main.ts` (коммит 18) |
| Application builder / esbuild | Уже на `@angular-devkit/build-angular:application` (ранее `1f8d692`) |
| Signal inputs/outputs stable (opt-in) | Не обязательно мигрировать сразу |
| Node engines расширены | Учтено в коммите 18 |

### 18 → 19

| Тема | Влияние |
|------|---------|
| Standalone **по умолчанию** для новых schematic | Ок; у проекта ~105 `standalone: true`, ~6 `@NgModule` |
| TS **≥ 5.5** (фактически взяли **5.8.3**) | Уже в манифесте |
| zone.js **0.15** | Уже в манифесте |
| Строже unused imports в standalone | Возможен шум компилятора — ручная зачистка |
| `*ngIf`/`*ngFor` ещё не deprecated | — |

### 19 → 20 (целевой)

| Тема | Влияние на publikator |
|------|------------------------|
| **TS ≥ 5.8** | Уже в `package.json` |
| **Node 18 dropped**; нужны `^20.19 \|\| ^22.12 \|\| ^24` | Engines уже выставлены; локальный Node 22.16 OK |
| `DOCUMENT` из `@angular/common` → `@angular/core` | **1 место:** `src/app/common/utils/seo.service.ts` — нужна правка (schematic обычно чинит) |
| `TestBed.get` удалён | В коде не найдено (хорошо) |
| `afterRender` → `afterEveryRender` | В коде не найдено |
| `InjectFlags` удалены | В коде не найдено |
| Deprecation `*ngIf`/`*ngFor`/`*ngSwitch` | **~744** вхождений vs **~6** `@if`/`@for` — не блокер 20, но долг до v22 |
| Смена default type suffixes в CLI | Отражено в `angular.json` schematics (коммит 20) |
| `moduleResolution: "bundler"` | Уже в `tsconfig.json` |

**Опционально / не трогать в этом апгрейде:** zoneless, signal forms, полный перевод на новый control flow.

---

## 4. Зависимости: что обновлять / что несовместимо

| Пакет | Сейчас (manifest) | Совместимость с Angular 20 | Действие |
|-------|-------------------|----------------------------|----------|
| `@angular/*`, CDK, CLI, devkit | 20.3.x | Целевые | `npm ci` / доустановить |
| `typescript` | 5.8.3 | OK для 20 | Оставить |
| `zone.js` | ~0.15.1 | OK | Оставить |
| `rxjs` | ~7.5.0 | OK (peer ^7) | Желательно подтянуть patch/minor 7.8+ |
| **`ngx-quill`** | **16.2.1** + **quill 1.3.7** | **Несовместимо по смыслу** (peer эпохи NG13; для NG20 нужен **ngx-quill@28** + **quill@^2**) | **Обязательный major bump** + регресс редакторов |
| **`ngx-tiptap`** | 6.0.0 + tipap 2.x | Peer `>=14` — формально тянется; latest 14.x требует Angular≥20 **и TipTap 3** | Оставить 6.x на первом проходе **или** отдельный эпик TipTap 3 |
| `ngx-image-cropper` | 9.1.6 | Peer `>=17.3` — OK | Оставить |
| `@angular/cdk` | 20.2.14 | OK | Оставить |
| **`@angular-eslint/*`** | **^14.4.0** | **Сильно устарело** (эпоха NG14) | Обновить до **20.x** (+ eslint/typescript-eslint peers) |
| `swiper` 11 | — | OK | Оставить |
| `video.js` 7 | — | OK (не Angular peer) | Оставить |
| `@types/node` | ^18 | Для Node 22 лучше ^20/^22 | Обновить |

### Явно рискованные / блокирующие

1. **`ngx-quill@16` + `quill@1`** — главный runtime/peer риск на Angular 20. Нужен переход на **ngx-quill@28** + **quill@2** (ломающие изменения API Quill).
2. **`@angular-eslint@14`** — lint pipeline не соответствует toolchain 20; не ломает build, но вводит ложные/устаревшие правила.
3. **Рассинхрон `node_modules` (17) vs lock (20)** — до `npm ci` проект нельзя считать «уже на 20».

---

## 5. Объём ручной работы (оценка)

| Работа | Оценка | Комментарий |
|--------|--------|-------------|
| Восстановить install с lock (20) + починить peer conflicts | **0.5–1 дн** | `npm ci`; при падении — `--legacy-peer-deps` временно + точечные bumps |
| Прогон migrations / `DOCUMENT` / build | **0.5 дн** | `seo.service.ts`; `ng build`; smoke |
| **ngx-quill → 28 + quill 2** (если Quill ещё в проде) | **1–3 дн** | Зависит от кастомных модулей/тулбаров Quill |
| `@angular-eslint` 14 → 20 | **0.5–1 дн** | Конфиг flat/legacy ESLint |
| Регресс ключевых сценариев (login, editors, upload crop, table, video) | **1–2 дн** | |
| (Опционально) control flow `*ngIf`→`@if` | **отдельный эпик** | Не нужен для закрытия 20 |
| **Итого до рабочего Angular 20** | **~3–7 чел/дн** | Нижняя граница если Quill мало используется / легко мигрируется |

Остановка на **19** экономит мало: манифест уже на 20, Node/TS уже «под 20», а Quill/eslint всё равно надо чинить для современного стека.

---

## 6. Риски

| Риск | Уровень | Митигация |
|------|---------|-----------|
| `npm ci` не встаёт из-за peer (quill/eslint) | Высокий | Сначала bump ngx-quill/eslint в отдельном коммите; или временно `legacy-peer-deps` + issue |
| Редакторы новостей/live (Quill) ломаются на quill 2 | Высокий | Фичефлаг / параллельный TipTap-путь; тест-кейсы контента |
| Пропущенные schematic-правки (апгрейд делали version-bump’ами) | Средний | После install прогнать `ng update @angular/core@20 --migrate-only --from=17` **осторожно** или точечно `DOCUMENT` |
| Строгий template checking / unused imports на 19+ | Средний | Чинить по ошибкам компилятора |
| Karma + старый jasmine vs новый toolchain | Низкий–средний | Уже есть puppeteer headless; смотреть падения после install |
| Долг `*ngIf` (~744) к будущему удалению | Низкий сейчас | Планировать отдельно до Angular 22 |

---

## 7. Рекомендация

### Решение: целевой **Angular 20.3.x** (не останавливаться на 19)

**Почему 20, а не 19**

1. В репозитории апгрейд до 20 **уже зафиксирован** в `package.json` / lock / `tsconfig` / `angular.json`.
2. Node/TS engines уже соответствуют требованиям 20.
3. Angular 19 — промежуточный шаг; отдельный «закрепиться на 19» даёт мало ценности при уже сделанных bump’ах.
4. LTS/support: разумнее выровнять runtime с манифестом и закрыть технический долг зависимостей один раз.

**Почему не «прыгать» 17→20 одной командой `ng update`**

CLI 17 это запрещает (только →18). Корректный путь с чистого 17.3:

```bash
ng update @angular/core@18 @angular/cli@18
ng update @angular/cdk@18
# verify build/test
ng update @angular/core@19 @angular/cli@19
ng update @angular/cdk@19
# verify
ng update @angular/core@20 @angular/cli@20
ng update @angular/cdk@20
```

**Практичный путь для текущего дерева (manifest уже 20):**

1. Зафиксировать/очистить локальные изменения.
2. `rm -rf node_modules && npm ci` (или `npm install`) под Node 22.12+.
3. Устранить peer errors: **ngx-quill@28 + quill@2**, **@angular-eslint@20**.
4. Починить `DOCUMENT` import в `seo.service.ts`.
5. `ng build` + `npm test` + ручной smoke (логин, редактор, crop, video, таблица).
6. Не включать zoneless / массовый control-flow в этот же PR.

### Вердикт по сложности

| Вариант | Сложность | Комментарий |
|---------|-----------|-------------|
| Довести **20** (как в git) | **Средняя** | Основной риск — Quill 2 и eslint, не сам Angular |
| Откатиться к **19** и жить на нём | **Средняя−**, но бессмысленно | Двойная работа относительно уже сделанных коммитов |
| Остаться на **17.3** в node_modules | **Техдолг** | Расхождение с lock опаснее «честного» 20 |

---

## 8. Чеклист выполнения

- [ ] Node ≥ 20.19 или ≥ 22.12 (сейчас 22.16 — OK)
- [ ] Синхронизировать `node_modules` с lock (Angular 20)
- [ ] Bump `ngx-quill` → 28.x, `quill` → 2.x; регресс редакторов
- [ ] Bump `@angular-eslint/*` → 20.x
- [ ] Migration `DOCUMENT` → `@angular/core`
- [ ] `ng build` / `npm test` / smoke
- [ ] (Позже) план миграции `*ngIf` → `@if` перед Angular 22

---

## 9. Ссылки

- Коммиты: `7c1cd1b` (18), `108462c` (19), `ae79930` (20)
- [Angular update guide](https://angular.dev/update-guide)
- [Angular 20.0.0 release notes](https://github.com/angular/angular/releases/tag/20.0.0)
- Локальная проверка: `npx ng update` (CLI 17.3 → next 18); `--dry-run` недоступен
