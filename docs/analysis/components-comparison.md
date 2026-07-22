# Сравнение пар компонентов publikator ↔ agora-frontend

Сопоставление по сути (одна задача UI). Вердикты: 🟢 идентичные / 🟡 параметризуемые / 🔴 требуют нового дизайна API.

## Button (`button`)

**Вердикт: 🟡 параметризуемые**

Одинаковый селектор `app-button` и почти один API, но в publikator добавлены a11y inputs + `buttonClick` output + HostBinding fullWidth; различается канон ключей disabled* в `button.ts` и мелкие spacing (gap-2 vs space-x-2, padding sm/xl).

### Таблица различий (шаг 2)

| Аспект | publikator | agora-frontend |
|--------|------------|----------------|
| Селектор | `app-button` | `app-button` |
| Outputs | `buttonClick` | нет (native click в шаблоне) |
| A11y inputs | `ariaLabel`, `ariaCurrentPage` | нет |
| HostBinding | inline-flex/items-center/justify-center/w-full | нет |
| Disabled keys в tokens | `disabledprimary` (lowercase merge) | `disabledPrimary` (Pascal) |
| common classes | `gap-2` | `space-x-2` |
| size sm default pad | `px-3 py-1.5` | `px-2 py-1.5` |
| icon-only xl pad | `p-3` | `p-4` |
| gray disabled primary | `bg-gray-900/30` | `bg-[#B3B3B3]` |

### Объединённый API

**Inputs:**
- `label`: ? = ''
- `variant`: TVariants = 'primary'
- `size`: keyof typeof sizes.buttonSize.default = 'md'
- `type`: 'button' | 'submit' | 'reset' = 'button'
- `icon`: TIconName = —
- `iconVariant`: TIconVariant = —
- `iconDirection`: TIconDirectionLR = 'right'
- `iconClass`: string = —
- `disabled`: ? = false
- `rounded`: ? = false
- `color`: 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'purple' = 'gray'
- `fullWidth`: ? = false
- `ariaLabel`: string = —
- `ariaCurrentPage`: ? = false

**Outputs:**
- `buttonClick`: void

### Функционал только в одном проекте → опционально

- publikator-only `ariaLabel` → optional input (default безопасный)
- publikator-only `ariaCurrentPage` → optional input (default безопасный)
- `buttonClick` output → включить всегда (канон), в agora заменить `(click)` на него
- `ariaLabel` / `ariaCurrentPage` → optional, default undefined/false

### Дизайн

Брать **publikator** как базу API (a11y + явный output). Токены цветов: унифицировать disabled-ключи к одному стилю (`disabledPrimary`) и убрать хардкод `#B3B3B3` в пользу token `gray-300`/`gray-900/30`. Spacing: `gap-2` предпочтительнее `space-x-2`.

---

## Input field (`input`)

**Вердикт: 🟡 параметризуемые**

Оба — CVA `app-input-field`. Agora расширяет внешний вид (`pill`, `appearance: default|laziarPanel`).

### Таблица различий (шаг 2)

| Аспект | publikator | agora-frontend |
|--------|------------|----------------|
| Селектор | app-input-field | app-input-field |
| CVA | да | да |
| Inputs | label, helperText, type, placeholder, iconButton, error, size, withButton, buttonLabel, prefix, disabled | label, helperText, type, placeholder, iconButton, error, size, withButton, buttonLabel, prefix, disabled, pill, appearance |
| Outputs | valueChange | valueChange |
| Lifecycle | ngOnInit | ngOnInit |

### Объединённый API

**Inputs:**
- `label`: ? = ''
- `helperText`: ? = ''
- `type`: 'text' | 'email' | 'password' | 'search' = 'text'
- `placeholder`: ? = ''
- `iconButton`: ? = ''
- `error`: ? = false
- `size`: 'sm' | 'md' | 'lg' = 'lg'
- `withButton`: 'left' | 'right' | null = null
- `buttonLabel`: ? = ''
- `prefix`: ? = ''
- `disabled`: ? = false
- `pill`: ? = false
- `appearance`: 'default' | 'laziarPanel' = 'default'

**Outputs:**
- `valueChange`: string

### Функционал только в одном проекте → опционально

- agora-only `pill` → optional input (default безопасный)
- agora-only `appearance` → optional input (default безопасный)
- `pill` (agora) → optional boolean false
- `appearance` (agora) → optional enum, default `default`

### Дизайн

Визуальные appearance-варианты agora полезны для бренд-панелей — оставить как optional skin.

---

## Select (`select`)

**Вердикт: 🔴 требуют нового дизайна API**

Критичное расхождение: в publikator `options: SelectOptionType[]` + CVA + `opened` output; в agora `options: string[]` без CVA. Нужен единый контракт опций и форм.

### Таблица различий (шаг 2)

| Аспект | publikator | agora-frontend |
|--------|------------|----------------|
| Селектор | app-select | app-select |
| CVA | да | нет |
| Inputs | label, placeholder, options, size, helperText, disabled | label, placeholder, options, size, helperText, disabled |
| Outputs | opened | — |
| Lifecycle | — | — |

### Объединённый API

**Inputs:**
- `label`: string = —
- `placeholder`: string = 'Select...'
- `options`: SelectOptionType[] = []
- `size`: 'sm' | 'md' = 'md'
- `helperText`: string = —
- `disabled`: boolean = false
- `options`: string[] = []

**Outputs:**
- `opened`: void

### Конфликты типов

- `options`: publikator `SelectOptionType[]` vs agora `string[]` → взять union/более широкий тип или нормализовать к канону
- `options`: `SelectOptionType[]` (pub) vs `string[]` (agora) → канон: `SelectOptionType[] | string[]` с нормализацией, deprecate raw string[] через адаптер

### Функционал только в одном проекте → опционально

- CVA — обязательно в shared (как в publikator)
- `opened` output — optional

### Дизайн

UI близкий; API данных — нет. Проектировать SelectOption {label, value, disabled?} как канон.

---

## Textarea (`textarea`)

**Вердикт: 🟡 параметризуемые**

Publikator реализует CVA; agora — нет (только inputs). Нужно подтянуть CVA в shared.

### Таблица различий (шаг 2)

| Аспект | publikator | agora-frontend |
|--------|------------|----------------|
| Селектор | app-textarea | app-textarea |
| CVA | да | нет |
| Inputs | label, placeholder, rows, disabled, helperText, error | label, placeholder, rows, disabled, helperText, error |
| Outputs | — | — |
| Lifecycle | — | — |

### Объединённый API

**Inputs:**
- `label`: string = —
- `placeholder`: string = ''
- `rows`: number = 4
- `disabled`: boolean = false
- `helperText`: string = —
- `error`: ? = false
- `placeholder`: string = —

**Outputs:**
_нет_

### Функционал только в одном проекте → опционально

- CVA из publikator — сделать обязательным контрактом shared

### Дизайн

Оба проекта опираются на общий Tailwind-дизайн (Onest, палитра red/gray/…). Расхождения в основном в spacing utility и disabled-ключах.

---

## Card (`card`)

**Вердикт: 🔴 требуют нового дизайна API**

Сильно разошлись: agora — полноценная article-card с `Article`, layout-режимами row, `openArticle` output и сервисами; publikator — упрощённая презентационная карточка. Общий «ядерный» вид + feature-flags/variants.

### Таблица различий (шаг 2)

| Аспект | publikator | agora-frontend |
|--------|------------|----------------|
| Селектор | app-card | app-card |
| CVA | нет | нет |
| Inputs | link, variant, size, isLoading, metricsType | publisher, author, link, variant, size, rowImageHeightMode, rowIdentityPosition, rowMetaLayout, rowImageAspect, rowImageAspectMd, showBottomBorder, isLoading, metricsType, openArticleId |
| Outputs | — | openArticle |
| Lifecycle | ngOnInit | ngOnInit, ngOnDestroy |

### Объединённый API

**Inputs:**
- `link`: string = '#'
- `variant`: 'col' | 'row' | 'grid' = 'col'
- `size`: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'xl'
- `isLoading`: boolean = false
- `metricsType`: boolean = false
- `publisher`: string = ''
- `author`: string = ''
- `variant`: CardVariant = 'col'
- `size`: CardSize = 'xl'
- `rowImageHeightMode`: RowImageHeightMode = 'fixed'
- `rowIdentityPosition`: RowIdentityPosition = 'top'
- `rowMetaLayout`: RowMetaLayout = 'split'
- `rowImageAspect`: RowImageAspect = '1/1'
- `rowImageAspectMd`: RowImageAspect = —
- `showBottomBorder`: boolean = true
- `openArticleId`: number | string | null = null

**Outputs:**
- `openArticle`: string | number | null

### Конфликты типов

- `variant`: publikator `'col' | 'row' | 'grid'` vs agora `CardVariant` → взять union/более широкий тип или нормализовать к канону
- `size`: publikator `'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'` vs agora `CardSize` → взять union/более широкий тип или нормализовать к канону

### Функционал только в одном проекте → опционально

- agora-only `publisher` → optional input (default безопасный)
- agora-only `author` → optional input (default безопасный)
- agora-only `rowImageHeightMode` → optional input (default безопасный)
- agora-only `rowIdentityPosition` → optional input (default безопасный)
- agora-only `rowMetaLayout` → optional input (default безопасный)
- agora-only `rowImageAspect` → optional input (default безопасный)
- agora-only `rowImageAspectMd` → optional input (default безопасный)
- agora-only `showBottomBorder` → optional input (default безопасный)
- agora-only `openArticleId` → optional input (default безопасный)
- agora: `article`, `publisher`, `author`, `row*`, `openArticleId`, `openArticle`, `showBottomBorder` → variant=`article` / feature inputs
- publikator: более простой API — базовый variant=`media`

### Дизайн

Взять визуальную зрелость **agora** (row layouts, identity) как advanced variant; простой API publikator — default presentational mode без зависимости от Article model.

---

## Alert (`alert`)

**Вердикт: 🟢 идентичные**

Селектор и набор inputs совпадают. Различия косметические (формат union `buttonVariant`).

### Таблица различий (шаг 2)

| Аспект | publikator | agora-frontend |
|--------|------------|----------------|
| Селектор | app-alert | app-alert |
| CVA | нет | нет |
| Inputs | title, text, iconName, iconVariant, variant, isRow, isRowtext, showCloseButton, closeColor, buttonVariant, size, padding | title, text, iconName, iconVariant, variant, isRow, isRowtext, showCloseButton, closeColor, buttonVariant, size, padding |
| Outputs | — | — |
| Lifecycle | — | — |

### Объединённый API

**Inputs:**
- `title`: string = 'Alert title'
- `text`: string = ''
- `iconName`: string = 'check-circle'
- `iconVariant`: 'solid' | 'outline' | 'mini' | 'micro' = 'outline'
- `variant`: TVariants = 'default'
- `isRow`: boolean = false
- `isRowtext`: boolean = false
- `showCloseButton`: boolean = true
- `closeColor`: TColors = —
- `buttonVariant`: | 'primary' | 'outline' | 'secondary' | 'tertiary' | 'link' = —
- `size`: 'base' | 'sm' = 'sm'
- `padding`: 'p-3' | 'p-4' = 'p-4'
- `buttonVariant`: 'primary' | 'outline' | 'secondary' | 'tertiary' | 'link' = —

**Outputs:**
_нет_

### Конфликты типов

- `buttonVariant`: publikator `| 'primary' | 'outline' | 'secondary' | 'tertiary' | 'link'` vs agora `'primary' | 'outline' | 'secondary' | 'tertiary' | 'link'` → взять union/более широкий тип или нормализовать к канону

### Дизайн

Оба проекта опираются на общий Tailwind-дизайн (Onest, палитра red/gray/…). Расхождения в основном в spacing utility и disabled-ключах.

---

## Avatar (`avatar`)

**Вердикт: 🟢 идентичные**

API совпадает. Типы size выражены по-разному (`AvatarSizeKey` vs `keyof typeof AVATAR_SIZES`) при том же наборе ключей. В publikator — `buildAvatarInitials` в `avatar.ts`.

### Таблица различий (шаг 2)

| Аспект | publikator | agora-frontend |
|--------|------------|----------------|
| Селектор | app-avatar | app-avatar |
| CVA | нет | нет |
| Inputs | firstName, lastName, imgUrl, size, imgNotification, topNotification, bottomNotification, topNotificationStatus, bottomNotificationStatus, containerClass, variant | firstName, lastName, imgUrl, size, imgNotification, topNotification, bottomNotification, topNotificationStatus, bottomNotificationStatus, containerClass, variant |
| Outputs | — | — |
| Lifecycle | — | ngOnChanges |

### Объединённый API

**Inputs:**
- `firstName`: ? = ''
- `lastName`: ? = ''
- `imgUrl`: string | SafeUrl = —
- `size`: AvatarSizeKey = 'sm'
- `imgNotification`: ? = ''
- `topNotification`: ? = false
- `bottomNotification`: ? = false
- `topNotificationStatus`: ? = 'error'
- `bottomNotificationStatus`: ? = 'info'
- `containerClass`: ? = ''
- `variant`: 'default' | 'plain' = 'default'
- `firstName`: string = ''
- `lastName`: string = ''
- `size`: keyof typeof AVATAR_SIZES = 'sm'
- `imgNotification`: string = ''
- `topNotification`: boolean = false
- `bottomNotification`: boolean = false
- `topNotificationStatus`: string = 'error'
- `bottomNotificationStatus`: string = 'info'
- `containerClass`: string = ''

**Outputs:**
_нет_

### Конфликты типов

- `size`: publikator `AvatarSizeKey` vs agora `keyof typeof AVATAR_SIZES` → взять union/более широкий тип или нормализовать к канону

### Дизайн

Оба проекта опираются на общий Tailwind-дизайн (Onest, палитра red/gray/…). Расхождения в основном в spacing utility и disabled-ключах.

---

## Avatar group (`avatarGroup`)

**Вердикт: 🟢 идентичные**

Селекторы: publikator `app-avatar-group`, agora `app-avatar-group`. Общих inputs: 4; только publikator: —; только agora: —.

### Таблица различий (шаг 2)

| Аспект | publikator | agora-frontend |
|--------|------------|----------------|
| Селектор | app-avatar-group | app-avatar-group |
| CVA | нет | нет |
| Inputs | avatars, max, size, reverse | avatars, max, size, reverse |
| Outputs | — | — |
| Lifecycle | ngOnChanges | ngOnChanges |

### Объединённый API

**Inputs:**
- `avatars`: { imgUrl?: string = —
- `max`: number = 4
- `size`: keyof typeof this.AVATAR_SIZES = 'md'
- `reverse`: boolean = false

**Outputs:**
_нет_

### Дизайн

Оба проекта опираются на общий Tailwind-дизайн (Onest, палитра red/gray/…). Расхождения в основном в spacing utility и disabled-ключах.

---

## Badge (`badge`)

**Вердикт: 🟢 идентичные**

Селекторы: publikator `app-badge`, agora `app-badge`. Общих inputs: 10; только publikator: —; только agora: —.

### Таблица различий (шаг 2)

| Аспект | publikator | agora-frontend |
|--------|------------|----------------|
| Селектор | app-badge | app-badge |
| CVA | нет | нет |
| Inputs | icon, img, iconClickable, iconDirection, iconVariant, color, size, border, rounded, disabled | icon, img, iconClickable, iconDirection, iconVariant, color, size, border, rounded, disabled |
| Outputs | iconClick | iconClick |
| Lifecycle | — | — |

### Объединённый API

**Inputs:**
- `icon`: string = —
- `img`: string = —
- `iconClickable`: ? = false
- `iconDirection`: TIconDirectionLR = 'left'
- `iconVariant`: TIconVariant = 'solid'
- `color`: TColors = 'gray'
- `size`: TSizes = 'sm'
- `border`: ? = false
- `rounded`: ? = false
- `disabled`: ? = false

**Outputs:**
- `iconClick`: void

### Дизайн

Оба проекта опираются на общий Tailwind-дизайн (Onest, палитра red/gray/…). Расхождения в основном в spacing utility и disabled-ключах.

---

## Button group (`buttonGroup`)

**Вердикт: 🟢 идентичные**

Селекторы: publikator `app-button-group`, agora `app-button-group`. Общих inputs: 1; только publikator: —; только agora: —.

### Таблица различий (шаг 2)

| Аспект | publikator | agora-frontend |
|--------|------------|----------------|
| Селектор | app-button-group | app-button-group |
| CVA | нет | нет |
| Inputs | line | line |
| Outputs | — | — |
| Lifecycle | — | — |

### Объединённый API

**Inputs:**
- `line`: boolean = false

**Outputs:**
_нет_

### Дизайн

Оба проекта опираются на общий Tailwind-дизайн (Onest, палитра red/gray/…). Расхождения в основном в spacing utility и disabled-ключах.

---

## Checkbox (`checkbox`)

**Вердикт: 🟢 идентичные**

Селекторы: publikator `app-checkbox`, agora `app-checkbox`. Общих inputs: 8; только publikator: —; только agora: —.

### Таблица различий (шаг 2)

| Аспект | publikator | agora-frontend |
|--------|------------|----------------|
| Селектор | app-checkbox | app-checkbox |
| CVA | нет | нет |
| Inputs | type, rounded, checked, disabled, indeterminate, variant, title, description | type, rounded, checked, disabled, indeterminate, variant, title, description |
| Outputs | checkedChange | checkedChange |
| Lifecycle | ngOnChanges | ngOnChanges |

### Объединённый API

**Inputs:**
- `type`: 'checkbox' | 'radio' = 'checkbox'
- `rounded`: boolean = false
- `checked`: boolean = false
- `disabled`: boolean = false
- `indeterminate`: boolean = false
- `variant`: 'default' | 'error' = 'default'
- `title`: string = ''
- `description`: string = ''

**Outputs:**
- `checkedChange`: boolean

### Дизайн

Оба проекта опираются на общий Tailwind-дизайн (Onest, палитра red/gray/…). Расхождения в основном в spacing utility и disabled-ключах.

---

## Switch toggle (`switchToggle`)

**Вердикт: 🟢 идентичные**

Селекторы: publikator `app-switch-toggle`, agora `app-switch-toggle`. Общих inputs: 3; только publikator: —; только agora: —.

### Таблица различий (шаг 2)

| Аспект | publikator | agora-frontend |
|--------|------------|----------------|
| Селектор | app-switch-toggle | app-switch-toggle |
| CVA | нет | нет |
| Inputs | active, disabled, size | active, disabled, size |
| Outputs | changed | changed |
| Lifecycle | — | — |

### Объединённый API

**Inputs:**
- `active`: ? = false
- `disabled`: ? = false
- `size`: 'sm' | 'md' = 'md'

**Outputs:**
- `changed`: boolean

### Дизайн

Оба проекта опираются на общий Tailwind-дизайн (Onest, палитра red/gray/…). Расхождения в основном в spacing utility и disabled-ключах.

---

## Tabs (`tabs`)

**Вердикт: 🟢 идентичные**

Селекторы: publikator `app-tabs`, agora `app-tabs`. Общих inputs: 7; только publikator: —; только agora: —.

### Таблица различий (шаг 2)

| Аспект | publikator | agora-frontend |
|--------|------------|----------------|
| Селектор | app-tabs | app-tabs |
| CVA | нет | нет |
| Inputs | tabs, style, size, badges, icons, class, activeTab | tabs, style, size, badges, icons, class, activeTab |
| Outputs | activeTabChange | activeTabChange |
| Lifecycle | — | — |

### Объединённый API

**Inputs:**
- `tabs`: string[] = []
- `style`: 'outline' | 'underline' | 'border' = 'outline'
- `size`: 'sm' | 'md' | 'lg' = 'md'
- `badges`: (TabBadge | null)[] = []
- `icons`: string[] = []
- `class`: string = —
- `activeTab`: ? = 0

**Outputs:**
- `activeTabChange`: number

### Дизайн

Оба проекта опираются на общий Tailwind-дизайн (Onest, палитра red/gray/…). Расхождения в основном в spacing utility и disabled-ключах.

---

## Tab button (`tabButton`)

**Вердикт: 🟢 идентичные**

Селекторы: publikator `app-tab-button`, agora `app-tab-button`. Общих inputs: 5; только publikator: —; только agora: —.

### Таблица различий (шаг 2)

| Аспект | publikator | agora-frontend |
|--------|------------|----------------|
| Селектор | app-tab-button | app-tab-button |
| CVA | нет | нет |
| Inputs | label, active, link, size, variant | label, active, link, size, variant |
| Outputs | — | — |
| Lifecycle | — | — |

### Объединённый API

**Inputs:**
- `label`: string = 'Tab'
- `active`: boolean = false
- `link`: string = —
- `size`: 'md' | 'lg' = 'md'
- `variant`: 'bg' | 'line' = 'bg'

**Outputs:**
_нет_

### Дизайн

Оба проекта опираются на общий Tailwind-дизайн (Onest, палитра red/gray/…). Расхождения в основном в spacing utility и disabled-ключах.

---

## Tooltip (`tooltip`)

**Вердикт: 🟢 идентичные**

Селекторы: publikator `app-tooltip`, agora `app-tooltip`. Общих inputs: 3; только publikator: —; только agora: —.

### Таблица различий (шаг 2)

| Аспект | publikator | agora-frontend |
|--------|------------|----------------|
| Селектор | app-tooltip | app-tooltip |
| CVA | нет | нет |
| Inputs | text, position, theme | text, position, theme |
| Outputs | — | — |
| Lifecycle | — | — |

### Объединённый API

**Inputs:**
- `text`: string = 'Tooltip text'
- `position`: 'top' | 'bottom' | 'left' | 'right' = 'top'
- `theme`: 'dark' | 'light' = 'dark'

**Outputs:**
_нет_

### Дизайн

Оба проекта опираются на общий Tailwind-дизайн (Onest, палитра red/gray/…). Расхождения в основном в spacing utility и disabled-ключах.

---

## Tooltip hover (`tooltipHover`)

**Вердикт: 🟢 идентичные**

Селекторы: publikator `app-tooltip-hover`, agora `app-tooltip-hover`. Общих inputs: 7; только publikator: —; только agora: —.

### Таблица различий (шаг 2)

| Аспект | publikator | agora-frontend |
|--------|------------|----------------|
| Селектор | app-tooltip-hover | app-tooltip-hover |
| CVA | нет | нет |
| Inputs | title, text, img, position, theme, arrow, disabled | title, text, img, position, theme, arrow, disabled |
| Outputs | — | — |
| Lifecycle | ngOnInit, ngOnDestroy, ngOnChanges | ngOnInit, ngOnDestroy, ngOnChanges |

### Объединённый API

**Inputs:**
- `title`: ? = ''
- `text`: ? = ''
- `img`: ? = ''
- `position`: | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' = 'top'
- `theme`: 'dark' | 'light' = 'dark'
- `arrow`: ? = false
- `disabled`: ? = false

**Outputs:**
_нет_

### Дизайн

Оба проекта опираются на общий Tailwind-дизайн (Onest, палитра red/gray/…). Расхождения в основном в spacing utility и disabled-ключах.

---

## Loading (`loading`)

**Вердикт: 🟢 идентичные**

Селекторы: publikator `app-loading`, agora `app-loading`. Общих inputs: 3; только publikator: —; только agora: —.

### Таблица различий (шаг 2)

| Аспект | publikator | agora-frontend |
|--------|------------|----------------|
| Селектор | app-loading | app-loading |
| CVA | нет | нет |
| Inputs | color, size, variant | color, size, variant |
| Outputs | — | — |
| Lifecycle | — | — |

### Объединённый API

**Inputs:**
- `color`: 'black' | 'red' = 'black'
- `size`: 'sm' | 'md' | 'lg' | 'xl' = 'xl'
- `variant`: 'spinner' | 'dot' = 'spinner'

**Outputs:**
_нет_

### Дизайн

Оба проекта опираются на общий Tailwind-дизайн (Onest, палитра red/gray/…). Расхождения в основном в spacing utility и disabled-ключах.

---

## Progress circle (`progressCircle`)

**Вердикт: 🟢 идентичные**

Селекторы: publikator `app-progress-circle`, agora `app-progress-circle`. Общих inputs: 3; только publikator: —; только agora: —.

### Таблица различий (шаг 2)

| Аспект | publikator | agora-frontend |
|--------|------------|----------------|
| Селектор | app-progress-circle | app-progress-circle |
| CVA | нет | нет |
| Inputs | progress, size, variant | progress, size, variant |
| Outputs | — | — |
| Lifecycle | — | — |

### Объединённый API

**Inputs:**
- `progress`: ? = 75
- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' = 'md'
- `variant`: 'red' | 'white' = 'red'

**Outputs:**
_нет_

### Дизайн

Оба проекта опираются на общий Tailwind-дизайн (Onest, палитра red/gray/…). Расхождения в основном в spacing utility и disabled-ключах.

---

## Dropdown (`dropdown`)

**Вердикт: 🟢 идентичные**

Одинаковый API; default `title`: publikator `"Menu"`, agora `"Меню"` — вынести i18n наружу.

### Таблица различий (шаг 2)

| Аспект | publikator | agora-frontend |
|--------|------------|----------------|
| Селектор | app-dropdown | app-dropdown |
| CVA | нет | нет |
| Inputs | title, sections, sizeVariant | title, sections, sizeVariant |
| Outputs | — | — |
| Lifecycle | ngAfterViewInit | ngAfterViewInit |

### Объединённый API

**Inputs:**
- `title`: string = 'Menu'
- `sections`: { heading: string = —
- `sizeVariant`: 'xl' | 'lg' | 'md' | 'sm' = 'xl'
- `title`: string = 'Меню'

**Outputs:**
_нет_

### Дизайн

Не хардкодить язык в default — `title` без дефолта или i18n key.

---

## Icon (`icons`)

**Вердикт: 🟢 идентичные**

Селекторы: publikator `app-icon`, agora `app-icon`. Общих inputs: 3; только publikator: —; только agora: —.

### Таблица различий (шаг 2)

| Аспект | publikator | agora-frontend |
|--------|------------|----------------|
| Селектор | app-icon | app-icon |
| CVA | нет | нет |
| Inputs | type, class, direction | type, class, direction |
| Outputs | — | — |
| Lifecycle | — | — |

### Объединённый API

**Inputs:**
- `type`: TIconVariant = 'outline'
- `class`: string = —
- `direction`: TIconDirectionLR = 'left'

**Outputs:**
_нет_

### Дизайн

Оба проекта опираются на общий Tailwind-дизайн (Onest, палитра red/gray/…). Расхождения в основном в spacing utility и disabled-ключах.

---

## Language dropdown (`languageDropdown`)

**Вердикт: 🟢 идентичные**

Практически идентичны: languages[], localStorage `appLanguage`, outside-click. Нет @Input/@Output. Общий баг removeEventListener+bind.

### Таблица различий (шаг 2)

| Аспект | publikator | agora-frontend |
|--------|------------|----------------|
| Селектор | app-language-dropdown | app-language-dropdown |
| CVA | нет | нет |
| Inputs | — | — |
| Outputs | — | — |
| Lifecycle | ngOnDestroy | ngOnDestroy |

### Объединённый API

**Inputs:**
_нет_

**Outputs:**
_нет_

### Функционал только в одном проекте → опционально

- `languages` input → optional
- `languageChange` output → вместо localStorage side-effect

### Дизайн

Оба проекта опираются на общий Tailwind-дизайн (Onest, палитра red/gray/…). Расхождения в основном в spacing utility и disabled-ключах.

---

## Carousel / Swiper (`carousel`)

**Вердикт: 🟡 параметризуемые**

Оба `app-swiper` без inputs. Publikator импортирует `swiper`+css; agora — `swiper!: any`.

### Таблица различий (шаг 2)

| Аспект | publikator | agora-frontend |
|--------|------------|----------------|
| Селектор | app-swiper | app-swiper |
| CVA | нет | нет |
| Inputs | — | — |
| Outputs | — | — |
| Lifecycle | ngAfterViewInit | ngAfterViewInit |

### Объединённый API

**Inputs:**
_нет_

**Outputs:**
_нет_

### Функционал только в одном проекте → опционально

- `options` SwiperOptions → optional
- ng-content слайдов → канон

### Дизайн

Оба проекта опираются на общий Tailwind-дизайн (Onest, палитра red/gray/…). Расхождения в основном в spacing utility и disabled-ключах.

---

## Pulse dot (`dotPulse`)

**Вердикт: 🟢 идентичные**

Селекторы: publikator `app-pulse-dot`, agora `app-pulse-dot`. Общих inputs: 0; только publikator: —; только agora: —.

### Таблица различий (шаг 2)

| Аспект | publikator | agora-frontend |
|--------|------------|----------------|
| Селектор | app-pulse-dot | app-pulse-dot |
| CVA | нет | нет |
| Inputs | — | — |
| Outputs | — | — |
| Lifecycle | — | — |

### Объединённый API

**Inputs:**
_нет_

**Outputs:**
_нет_

### Дизайн

Оба проекта опираются на общий Tailwind-дизайн (Onest, палитра red/gray/…). Расхождения в основном в spacing utility и disabled-ключах.

---

## Video player (`videoPlayer`)

**Вердикт: 🟡 параметризуемые**

Video.js + nuevo. Publikator: `@Input() videoSrc`. Agora: `videoSrc` — поле класса (не Input). Лицензия захардкожена.

### Таблица различий (шаг 2)

| Аспект | publikator | agora-frontend |
|--------|------------|----------------|
| Селектор | app-video-player | app-video-player |
| CVA | нет | нет |
| Inputs | videoSrc | — |
| Outputs | — | — |
| Lifecycle | ngOnDestroy, ngAfterViewInit | ngOnDestroy, ngAfterViewInit |

### Объединённый API

**Inputs:**
- `videoSrc`: string = '/assets/video/IntroF1.mp4'

**Outputs:**
_нет_

### Функционал только в одном проекте → опционально

- publikator-only `videoSrc` → optional input (default безопасный)
- `videoSrc` — канонический @Input
- license/logoPath — injection token

### Дизайн

Оба проекта опираются на общий Tailwind-дизайн (Onest, палитра red/gray/…). Расхождения в основном в spacing utility и disabled-ключах.

---

## Только в publikator (пар нет)

- **messageChat**: `app-message-chat` — пузырь чата; URL autolink через `DomSanitizer.bypassSecurityTrustHtml` (XSS-риск); слот для медиа; измерение строк → pill vs rounded.
- **table**: `app-table` — колонки/пагинация/sticky/elevated row; template outlets `#cellTemplate`/`#headerTemplate`/`rowDetailTemplate`; лучший a11y в base (aria, keyboard на строках). Зависит от `FloatingUiDirective` (вне base).
- **toastNotification**: `app-toast-notification` + `app-toast-container` + `ToastService` (5s auto-dismiss, `aria-live`); UI type→color частично не доведён (иконка часто green).

## Только в agora-frontend

_Папок, отсутствующих в publikator `base`, нет. Однако у Card/Input/Select в agora есть уникальные возможности (см. пары выше)._

## Сквозные замечания (оба проекта)

1. **Стилизация:** Tailwind-first; CSS в base почти только `:host` + точечные hex. CSS variables (`var(--*)`) в base **не используются**.
2. **Form CVA:** publikator — Input/Select/Textarea; agora — только Input. Shared должен требовать CVA для всех трёх.
3. **AvatarGroup ≠ Avatar:** разные size maps; group не композирует `app-avatar`.
4. **Tooltip vs TooltipHover:** click «?» vs CDK Overlay hover-wrapper — разные парадигмы, оба нужны.
5. **Tabs vs TabButton:** группа с `activeTabChange` vs одиночный `routerLink`.
6. **Dropdown без selection API** в обоих — при shared добавить `itemSelect` output.
7. **A11y debt общий:** switch/select/tabs/loading/progress почти без ARIA; table (pub) и card menus (agora) — исключения в лучшую сторону.