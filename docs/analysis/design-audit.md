# Design audit — tokens из base + tailwind.config

Сравнение значений, используемых в `base` и корневых `tailwind.config.js`.

## Палитра (semantic scales)

Обе темы содержат одинаковые шкалы: `red`, `magenta`, `purple`, `violet`, `blue`, `cyan`, `teal`, `mint`, `green`, `kiwi`, `avocado`, `dijon`, `yellow`, `amber`, `orange`, `coral`, `gray`, `warmGray` (+ `surface`, 50–900) и набор `c*` legacy hex.

| Токен | Совпадение | Комментарий |
|-------|------------|-------------|
| Brand scales (red…warmGray) | ✅ совпадают | Можно вынести в shared tokens as-is |
| Legacy `cFFFFFA`, `c121212`, … | ✅ почти все | |
| `c9AD0FF` | ❌ только agora | Добавить в shared или удалить если не нужен base |
| Button disabled gray | ❌ | pub `gray-900/30` vs agora `#B3B3B3` |

## Типографика

| Токен | publikator | agora |
|-------|------------|-------|
| fontFamily | bitter, lora, onest | bitter, lora, onest |
| fontSize xs…10xl | одинаковые rem+letterSpacing | одинаковые + **много** `s*-l*` (10–56px) |
| fontWeight mediumbold | `570` (есть) | нет в extend |

**Вывод:** базовые rem-размеры совпадают; у agora расширенный набор pixel-scale для контентных страниц — в design tokens держать оба слоя (`type.scale` + `type.legacyPx`).

## Отступы / spacing

| Токен | publikator | agora |
|-------|------------|-------|
| spacing 2.5 | `10px` | нет в extend (есть в safelist p-2.5) |
| spacing 13/18/30/33/37/110 | есть | есть |
| width/height 260/368 | нет | есть |
| maxWidth 380/632/… | частично | расширеннее |
| Button gap | `gap-2` | `space-x-2` |

## Радиусы

В button tokens: `rounded-lg` (xl–sm), `rounded-md` (xs), `rounded-full` при `rounded=true`. Совпадает. В CSS-файлах base радиусы встречаются точечно (video/tooltip) — см. raw extract.

## Тени

В base мало кастомных box-shadow; используется Tailwind `shadow-xs` / default. Publikator safelist включает `shadow-xs`. Отдельных расходящихся shadow-токенов в button/badge почти нет.

## Брейкпоинты

| publikator | agora |
|------------|-------|
| sm 640, md 768, lg 1024, xl 1280, 2xl 1536 | dsm 414, d2sm 450, d3sm 600, md 768, dxl 1024, d1200 1200, d2xl 1312, d3xl 1920 |

**Критичное расхождение.** Для shared components предпочитать стандартные `sm/md/lg/xl` (publikator) либо ввести алиасы `dxl→lg`. Demo-брейкпоинты agora не тащить в library API.

## Переходы / анимации

| | publikator | agora |
|--|------------|-------|
| button transition | `transition-colors duration-300` | то же |
| keyframes flash-code | да | да |
| toast-slide-up | да (toast) | нет |

## Хардкоды из CSS файлов base

### publikator
- colors: #FFFFFA, #121212
- radii: 0 | 8px | 100px
- font-size: —
- shadows: 0 0 0 1px #121212
- transitions: —

### agora-frontend
- colors: #fffffa, #121212
- radii: 0 | 8px | 100px
- font-size: —
- shadows: 0 0 0 1px #121212
- transitions: —

### Доп. хардкоды (из шаблонов/TS, не только .css)

| Значение | Где |
|----------|-----|
| `#B3B3B3` | agora button disabled gray primary |
| `#E0E0E0`, `#F9F9F9` | agora input `laziarPanel` |
| `#ef4444`, `#F4F5F5`, `#121212` | progressCircle (оба) |
| `#ffffff` / `#121212` / `#F5F5F5` | tooltip / tooltipHover SVG fills |
| `-6px` overlap | avatarGroup |
| `32×32` nav buttons | carousel |
| `8px` radius, progress `2px`/`4px` | videoPlayer |
| sticky shadow `rgba(0,0,0,0.1)` | publikator table |
| `#121212`/55, `rgba(18,18,18,0.12)` | agora card mobile sheet |

## Рекомендация по design tokens

1. Вынести color scales + `cFFFFFA` background в `@laziar/tokens`.
2. Typography: rem-scale (общая) + optional px-scale (agora).
3. Breakpoints: канон Tailwind default; demo-* только в agora app.
4. Component tokens (button sizes/colors) — один модуль, версионировать ключи disabled*.
5. Заменить hex в progressCircle/tooltip/button-disabled на semantic tokens.