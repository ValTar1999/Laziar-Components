# Инвентаризация base — agora-frontend

> Источник: `c:\Users\user\Documents\Work-2\agora-frontend\src\app\common\components\base`
> Сгенерировано автоматически при анализе (код не изменялся).

## Сводка

| Категория | Кол-во |
|-----------|--------|
| Компоненты | 24 |
| Сервисы | 0 |
| Модели/константы/утилиты | 6 |
| Шаблоны (.html) | 23 |
| Стили (.css) | 11 |
| Файлов всего (без spec) | 64 |
| Папок | 24 |

## Полный список элементов

| Путь | Имя | Тип | Назначение |
|------|-----|-----|------------|
| `alert/alert.component.css` | alert.component.css | styles | Стили компонента |
| `alert/alert.component.html` | alert.component.html | template | HTML-шаблон компонента |
| `alert/alert.component.ts` | AlertComponent | component | Уведомление/алерт с иконкой, текстом и опциональной кнопкой закрытия (`app-alert`) |
| `alert/alert.ts` | Variants, TVariants, Colors, TColors, AlertStyles, AlertStylesMap | model/types | Экспорты: Variants, TVariants, Colors, TColors, AlertStyles, AlertStylesMap |
| `avatar/avatar.component.css` | avatar.component.css | styles | Стили компонента |
| `avatar/avatar.component.html` | avatar.component.html | template | HTML-шаблон компонента |
| `avatar/avatar.component.ts` | AvatarComponent | component | Аватар пользователя (фото или инициалы) с опциональными статус-бейджами (`app-avatar`) |
| `avatar/avatar.ts` | AvatarSize, AVATAR_SIZES, Colors, TColors | model/types | Экспорты: AvatarSize, AVATAR_SIZES, Colors, TColors |
| `avatarGroup/avatar-group.component.html` | avatar-group.component.html | template | HTML-шаблон компонента |
| `avatarGroup/avatar-group.component.ts` | AvatarGroupComponent | component | Группа аватаров с лимитом max и счётчиком остатка (`app-avatar-group`) |
| `badge/badge.component.css` | badge.component.css | styles | Стили компонента |
| `badge/badge.component.html` | badge.component.html | template | HTML-шаблон компонента |
| `badge/badge.component.ts` | BadgeComponent | component | Бейдж/чип с цветом, размером, иконкой или картинкой (`app-badge`) |
| `badge/badge.ts` | Colors, TColors, Sizes, TSizes, classes | model/types | Экспорты: Colors, TColors, Sizes, TSizes, classes |
| `button/button.component.css` | button.component.css | styles | Стили компонента |
| `button/button.component.html` | button.component.html | template | HTML-шаблон компонента |
| `button/button.component.ts` | ButtonComponent | component | Кнопка с вариантами, цветами, размерами и иконками (`app-button`) |
| `button/button.ts` | Variants, TVariants, sizes, classes, Colors, TColors | model/types | Экспорты: Variants, TVariants, sizes, classes, Colors, TColors |
| `buttonGroup/button-group.component.html` | button-group.component.html | template | HTML-шаблон компонента |
| `buttonGroup/button-group.component.ts` | ButtonGroupComponent | component | Контейнер для группы кнопок (с/без разделителя) (`app-button-group`) |
| `card/card.component.html` | card.component.html | template | HTML-шаблон компонента |
| `card/card.component.ts` | CardComponent | component | Карточка контента (статья/медиа) с изображением и метаданными (`app-card`) |
| `carousel/swiper.component.css` | swiper.component.css | styles | Стили компонента |
| `carousel/swiper.component.html` | swiper.component.html | template | HTML-шаблон компонента |
| `carousel/swiper.component.ts` | SwiperComponent | component | Карусель/слайдер на базе Swiper (`app-swiper`) |
| `checkbox/checkbox.component.css` | checkbox.component.css | styles | Стили компонента |
| `checkbox/checkbox.component.html` | checkbox.component.html | template | HTML-шаблон компонента |
| `checkbox/checkbox.component.ts` | CheckboxComponent | component | Чекбокс или радио с label/description (`app-checkbox`) |
| `dotPulse/pulse-dot.component.html` | pulse-dot.component.html | template | HTML-шаблон компонента |
| `dotPulse/pulse-dot.component.ts` | PulseDotComponent | component | Анимированная пульсирующая точка (индикатор) (`app-pulse-dot`) |
| `dropdown/dropdown.component.html` | dropdown.component.html | template | HTML-шаблон компонента |
| `dropdown/dropdown.component.ts` | DropdownComponent | component | Выпадающее меню с секциями (`app-dropdown`) |
| `icons/icon.component.css` | icon.component.css | styles | Стили компонента |
| `icons/icon.component.ts` | IconComponent | component | Иконка из набора Heroicons-подобных SVG (`app-icon`) |
| `icons/icon.ts` | TIconName, IconVariant, TIconVariant, IconDirectionLR, TIconDirectionLR | model/types | Экспорты: TIconName, IconVariant, TIconVariant, IconDirectionLR, TIconDirectionLR |
| `input/input.component.css` | input.component.css | styles | Стили компонента |
| `input/input.component.html` | input.component.html | template | HTML-шаблон компонента |
| `input/input.component.ts` | InputFieldComponent | component | Текстовое поле ввода (CVA) с label/helper/ошибкой (`app-input-field`); ControlValueAccessor |
| `input/input.ts` | Colors, TColors | model/types | Экспорты: Colors, TColors |
| `languageDropdown/language-dropdown.component.html` | language-dropdown.component.html | template | HTML-шаблон компонента |
| `languageDropdown/language-dropdown.component.ts` | LanguageDropdownComponent | component | Выпадающий переключатель языка (`app-language-dropdown`) |
| `loading/loading.component.css` | loading.component.css | styles | Стили компонента |
| `loading/loading.component.html` | loading.component.html | template | HTML-шаблон компонента |
| `loading/loading.component.ts` | LoadingComponent | component | Индикатор загрузки (spinner/dot) (`app-loading`) |
| `progressCircle/progress-circle.component.html` | progress-circle.component.html | template | HTML-шаблон компонента |
| `progressCircle/progress-circle.component.ts` | ProgressCircleComponent | component | Круговой индикатор прогресса (`app-progress-circle`) |
| `select/select.component.html` | select.component.html | template | HTML-шаблон компонента |
| `select/select.component.ts` | SelectComponent | component | Выпадающий select (`app-select`) |
| `switchToggle/switch-toggle.component.html` | switch-toggle.component.html | template | HTML-шаблон компонента |
| `switchToggle/switch-toggle.component.ts` | SwitchToggleComponent | component | Переключатель on/off (`app-switch-toggle`) |
| `tabButton/tab-button.component.html` | tab-button.component.html | template | HTML-шаблон компонента |
| `tabButton/tab-button.component.ts` | TabButtonComponent | component | Одиночная вкладка-кнопка (навигация) (`app-tab-button`) |
| `tabs/tabs.component.html` | tabs.component.html | template | HTML-шаблон компонента |
| `tabs/tabs.component.ts` | TabsComponent | component | Группа вкладок с активным индексом (`app-tabs`) |
| `textarea/textarea.component.html` | textarea.component.html | template | HTML-шаблон компонента |
| `textarea/textarea.component.ts` | TextareaComponent | component | Многострочное текстовое поле (`app-textarea`) |
| `tooltip/tooltip.component.html` | tooltip.component.html | template | HTML-шаблон компонента |
| `tooltip/tooltip.component.ts` | TooltipComponent | component | Простой статичный tooltip (`app-tooltip`) |
| `tooltipHover/tooltip-hover.component.css` | tooltip-hover.component.css | styles | Стили компонента |
| `tooltipHover/tooltip-hover.component.html` | tooltip-hover.component.html | template | HTML-шаблон компонента |
| `tooltipHover/tooltip-hover.component.ts` | TooltipHoverComponent | component | Tooltip по hover с позиционированием (`app-tooltip-hover`) |
| `videoPlayer/video-player.component.css` | video-player.component.css | styles | Стили компонента |
| `videoPlayer/video-player.component.html` | video-player.component.html | template | HTML-шаблон компонента |
| `videoPlayer/video-player.component.ts` | VideoPlayerComponent | component | Видеоплеер с кастомными контролами (`app-video-player`) |

## Компоненты (кратко)

- **AlertComponent** (`app-alert`) — inputs: 12, outputs: 0, CVA: нет, lifecycle: —
- **AvatarComponent** (`app-avatar`) — inputs: 11, outputs: 0, CVA: нет, lifecycle: ngOnChanges
- **AvatarGroupComponent** (`app-avatar-group`) — inputs: 4, outputs: 0, CVA: нет, lifecycle: ngOnChanges
- **BadgeComponent** (`app-badge`) — inputs: 10, outputs: 1, CVA: нет, lifecycle: —
- **ButtonComponent** (`app-button`) — inputs: 12, outputs: 0, CVA: нет, lifecycle: —
- **ButtonGroupComponent** (`app-button-group`) — inputs: 1, outputs: 0, CVA: нет, lifecycle: —
- **CardComponent** (`app-card`) — inputs: 14, outputs: 1, CVA: нет, lifecycle: ngOnInit, ngOnDestroy
- **SwiperComponent** (`app-swiper`) — inputs: 0, outputs: 0, CVA: нет, lifecycle: ngAfterViewInit
- **CheckboxComponent** (`app-checkbox`) — inputs: 8, outputs: 1, CVA: нет, lifecycle: ngOnChanges
- **PulseDotComponent** (`app-pulse-dot`) — inputs: 0, outputs: 0, CVA: нет, lifecycle: —
- **DropdownComponent** (`app-dropdown`) — inputs: 3, outputs: 0, CVA: нет, lifecycle: ngAfterViewInit
- **IconComponent** (`app-icon`) — inputs: 3, outputs: 0, CVA: нет, lifecycle: —
- **InputFieldComponent** (`app-input-field`) — inputs: 13, outputs: 1, CVA: да, lifecycle: ngOnInit
- **LanguageDropdownComponent** (`app-language-dropdown`) — inputs: 0, outputs: 0, CVA: нет, lifecycle: ngOnDestroy
- **LoadingComponent** (`app-loading`) — inputs: 3, outputs: 0, CVA: нет, lifecycle: —
- **ProgressCircleComponent** (`app-progress-circle`) — inputs: 3, outputs: 0, CVA: нет, lifecycle: —
- **SelectComponent** (`app-select`) — inputs: 6, outputs: 0, CVA: нет, lifecycle: —
- **SwitchToggleComponent** (`app-switch-toggle`) — inputs: 3, outputs: 1, CVA: нет, lifecycle: —
- **TabButtonComponent** (`app-tab-button`) — inputs: 5, outputs: 0, CVA: нет, lifecycle: —
- **TabsComponent** (`app-tabs`) — inputs: 7, outputs: 1, CVA: нет, lifecycle: —
- **TextareaComponent** (`app-textarea`) — inputs: 6, outputs: 0, CVA: нет, lifecycle: —
- **TooltipComponent** (`app-tooltip`) — inputs: 3, outputs: 0, CVA: нет, lifecycle: —
- **TooltipHoverComponent** (`app-tooltip-hover`) — inputs: 7, outputs: 0, CVA: нет, lifecycle: ngOnInit, ngOnDestroy, ngOnChanges
- **VideoPlayerComponent** (`app-video-player`) — inputs: 0, outputs: 0, CVA: нет, lifecycle: ngOnDestroy, ngAfterViewInit

## Не-компоненты

- **model** `alert/alert.ts` — экспорты: Variants, TVariants, Colors, TColors, AlertStyles, AlertStylesMap
- **model** `avatar/avatar.ts` — экспорты: AvatarSize, AVATAR_SIZES, Colors, TColors
- **model** `badge/badge.ts` — экспорты: Colors, TColors, Sizes, TSizes, classes
- **model** `button/button.ts` — экспорты: Variants, TVariants, sizes, classes, Colors, TColors
- **model** `icons/icon.ts` — экспорты: TIconName, IconVariant, TIconVariant, IconDirectionLR, TIconDirectionLR
- **model** `input/input.ts` — экспорты: Colors, TColors

### Пайпы / директивы / гварды / интерсепторы

В папке `base` обоих проектов **не обнаружено** standalone `@Pipe`, `@Directive` (кроме компонентов), guards и interceptors — они живут вне `base` (если есть).
