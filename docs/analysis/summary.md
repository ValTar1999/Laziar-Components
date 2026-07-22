# Сводка анализа base (publikator × agora-frontend)

## Объём

| | publikator | agora-frontend |
|--|------------|----------------|
| Файлов в base (без spec) | 73 | 64 |
| Компонентов | 28 | 24 |
| Сервисов | 1 (ToastService) | 0 |
| Папок | 27 | 24 |
| Пар для сравнения | 24 |
| Только publikator | messageChat, table, toastNotification |

## Вердикты по парам

| Вердикт | Кол-во |
|---------|--------|
| 🟢 идентичные | 17 |
| 🟡 параметризуемые | 5 |
| 🔴 новый API | 2 |

### Список по вердиктам

**🟢**
- Alert (`alert`)
- Avatar (`avatar`)
- Avatar group (`avatarGroup`)
- Badge (`badge`)
- Button group (`buttonGroup`)
- Checkbox (`checkbox`)
- Switch toggle (`switchToggle`)
- Tabs (`tabs`)
- Tab button (`tabButton`)
- Tooltip (`tooltip`)
- Tooltip hover (`tooltipHover`)
- Loading (`loading`)
- Progress circle (`progressCircle`)
- Dropdown (`dropdown`)
- Icon (`icons`)
- Language dropdown (`languageDropdown`)
- Pulse dot (`dotPulse`)

**🟡**
- Button (`button`)
- Input field (`input`)
- Textarea (`textarea`)
- Carousel / Swiper (`carousel`)
- Video player (`videoPlayer`)

**🔴**
- Select (`select`)
- Card (`card`)

## Конфликты имён inputs

_Прямых конфликтов «одно назначение — разные имена» почти нет; расхождения в основном в наличии/отсутствии inputs (`ariaLabel`, `pill`, `appearance`, card row*). Исключение по смыслу: Select `options` (разные типы под одним именем)._

## Рекомендуемый порядок переноса

1. **Design tokens** (`button.ts`/`badge.ts`/palette/tailwind shared) + Icon
2. **🟢/простые 🟡:** PulseDot, Loading, ProgressCircle, Badge, Checkbox, Switch, Tooltip, TooltipHover, ButtonGroup, Avatar, AvatarGroup, Alert, TabButton, Tabs
3. **Button** (унификация disabled keys + a11y output)
4. **Input + Textarea** (CVA + appearance/pill optional)
5. **Select** (новый контракт options + CVA) — 🔴
6. **Dropdown, LanguageDropdown, Swiper, VideoPlayer** (параметризация)
7. **Card** — спроектировать dual-mode API — 🔴
8. **Toast / Table / MessageChat** (publikator-only)

## Риски

- **Breakpoints agora (`d*`) vs стандартные** — ломают responsive classes при шаринге шаблонов.
- **Select options type mismatch** — тихие runtime-баги при наивном merge.
- **Card зависимость от Article/сервисов agora** — нельзя слепо переносить в library.
- **Disabled key casing** в button tokens — часть disabled-стилей может «отвалиться».
- **i18n defaults** (`Меню` vs `Menu`) — хардкод языка в компонентах.
- **Tailwind safelist** различается — динамические классы могут пропасть без общего safelist.
- **Иконочный union** может разъехаться — missing icons at runtime.
- **MessageChat** (`bypassSecurityTrustHtml` + URL autolink) — XSS-риск при переносе без санитизации.
- **VideoPlayer** — hardcoded Nuevo license string в обоих проектах.

## Известные дефекты / пробелы (оба проекта, зафиксировать при переносе)

| Компонент | Проблема |
|-----------|----------|
| Alert | `closeColor` / `buttonVariant` объявлены, но **не используются** в шаблоне; close **без** emit/handler |
| Badge | typo в `TColors`: `'magrnta'` (оба) |
| AvatarGroup | **не** использует `app-avatar`; своя size-map (расходится с Avatar) |
| ButtonGroup | border/divide: pub `divide-gray-200`, agora `divide-gray-100` + `shadow` |
| Dropdown | нет output выбора пункта — только закрытие |
| LanguageDropdown | `removeEventListener` с новым `.bind(this)` → listener **не снимается** |
| Input | label не связан через `for`/`id` |
| Switch / Select / Tabs | слабая a11y (`role=switch`, listbox, `tablist`/стрелки) |
| Textarea | typo-классы `dark:boder-*`, `dark-hover:` / `dark-focus:` (невалидный Tailwind) |
| Icon | `direction` input **unused** |
| ProgressCircle / Tooltip SVG | hex вне design tokens (`#ef4444`, `#121212`, …) |
| Toast (pub) | type→color helpers есть, в UI иконка часто **hardcoded green** |
| Card (pub) | `metricsType` заявлен, в шаблоне по сути не задействован |
| Card (agora) | app-coupled: Floating UI, SavedCards/Follow/ViewHistory, reactions |

## Артефакты

- `publikator-base-inventory.md`
- `agora-base-inventory.md`
- `components-detailed-publikator.md`
- `components-detailed-agora.md`
- `components-comparison.md`
- `services-comparison.md`
- `design-audit.md`
- `_raw-extract.json` (машинный экстракт)
