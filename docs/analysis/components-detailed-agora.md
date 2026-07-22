# Детальный разбор компонентов base — agora-frontend

> Путь: `c:\Users\user\Documents\Work-2\agora-frontend\src\app\common\components\base`

## AlertComponent

- **Путь:** `alert/alert.component.ts`
- **Селектор:** `app-alert`
- **Standalone:** true
- **Implements:** —
- **CVA:** нет
- **Назначение:** Уведомление/алерт с иконкой, текстом и опциональной кнопкой закрытия

### Inputs

- `title`: `string`, default `'Alert title'`, опциональный — Заголовок
- `text`: `string`, default `''`, опциональный — Основной текст
- `iconName`: `string`, default `'check-circle'`, опциональный — Имя иконки
- `iconVariant`: `'solid' | 'outline' | 'mini' | 'micro'`, default `'outline'`, опциональный — Стиль иконки (outline/solid/…)
- `variant`: `TVariants`, default `'default'`, опциональный — Визуальный/поведенческий вариант
- `isRow`: `boolean`, default `false`, опциональный — см. использование в шаблоне/классе
- `isRowtext`: `boolean`, default `false`, опциональный — см. использование в шаблоне/классе
- `showCloseButton`: `boolean`, default `true`, опциональный — Кнопка закрытия
- `closeColor`: `TColors`, default —, опциональный — Цвет кнопки закрытия
- `buttonVariant`: `'primary' | 'outline' | 'secondary' | 'tertiary' | 'link'`, default —, опциональный — Вариант кнопки внутри alert
- `size`: `'base' | 'sm'`, default `'sm'`, опциональный — Размерный вариант
- `padding`: `'p-3' | 'p-4'`, default `'p-4'`, опциональный — Токен отступа

### Outputs

_нет_

### ng-content слоты

- `(default)`

### Разметка

- Корневые теги: div, div, app-icon, div, div, div, div, ng-content
- Условия (*ngIf/@if): 1; циклы (*ngFor/@for): 0

### Стили

- Цвета: —; радиусы: —; font-size: —; CSS-vars: нет
- `:host`: есть
- Основная стилизация: **Tailwind utility-классы** в шаблоне и/или строковых константах TS (`button.ts`, `badge.ts` и т.п.).

### Функционал класса

- **Lifecycle:** —
- **HostListeners:** —
- **Инъекции:** —
- **Методы (извлечённые):** getAlertStyles
- Подписки RxJS: нет
- Работа с формами (кроме CVA): нет
- Анимации Angular: нет

### Зависимости

- imports компонента: NgClass, IconComponent, ButtonComponent, NgIf
- Angular: @angular/core, @angular/common
- Сторонние: —
- Локальные: ./alert, ../icons/icon.component, ../button/button.component

### Доступность

- В шаблоне явных aria/role почти нет (или классы задают фокус через Tailwind focus:*)
- A11y-related inputs: iconVariant, variant, buttonVariant

### Сопутствующие модели/константы

- `alert/alert.ts`

---

## AvatarComponent

- **Путь:** `avatar/avatar.component.ts`
- **Селектор:** `app-avatar`
- **Standalone:** true
- **Implements:** OnChanges
- **CVA:** нет
- **Назначение:** Аватар пользователя (фото или инициалы) с опциональными статус-бейджами

### Inputs

- `firstName`: `string`, default `''`, опциональный — Имя (инициалы)
- `lastName`: `string`, default `''`, опциональный — Фамилия (инициалы)
- `imgUrl`: `string | SafeUrl`, default —, опциональный — URL аватара/фото
- `size`: `keyof typeof AVATAR_SIZES`, default `'sm'`, опциональный — Размерный вариант
- `imgNotification`: `string`, default `''`, опциональный — Картинка уведомления на аватаре
- `topNotification`: `boolean`, default `false`, опциональный — Верхний статус-индикатор
- `bottomNotification`: `boolean`, default `false`, опциональный — Нижний статус-индикатор
- `topNotificationStatus`: `string`, default `'error'`, опциональный — см. использование в шаблоне/классе
- `bottomNotificationStatus`: `string`, default `'info'`, опциональный — см. использование в шаблоне/классе
- `containerClass`: `string`, default `''`, опциональный — Класс контейнера
- `variant`: `'default' | 'plain'`, default `'default'`, опциональный — Визуальный/поведенческий вариант

### Outputs

_нет_

### ng-content слоты

_нет_

### Разметка

- Корневые теги: div, div, ng-container, img, ng-template, ng-container, img, ng-template
- Условия (*ngIf/@if): 5; циклы (*ngFor/@for): 0
- Ключевые классы (фрагмент): `relative inline-flex rounded-full items-center justify-center overflow-hidden text-gray-700 font-semibold w-full h-full object-cover -mt-px absolute top-0 right-px border-white bottom-0`

### Стили

- Цвета: —; радиусы: —; font-size: —; CSS-vars: нет
- `:host`: есть
- Основная стилизация: **Tailwind utility-классы** в шаблоне и/или строковых константах TS (`button.ts`, `badge.ts` и т.п.).

### Функционал класса

- **Lifecycle:** ngOnChanges
- **HostListeners:** —
- **Инъекции:** —
- **Методы (извлечённые):** ngOnChanges, getInitials, shouldShowPlaceholder, shouldApplyDefaultPlaceholderStyles, getNotificationColor
- Подписки RxJS: нет
- Работа с формами (кроме CVA): нет
- Анимации Angular: нет

### Зависимости

- imports компонента: CommonModule
- Angular: @angular/core, @angular/platform-browser, @angular/common
- Сторонние: —
- Локальные: ./avatar

### Доступность

- В шаблоне явных aria/role почти нет (или классы задают фокус через Tailwind focus:*)
- A11y-related inputs: variant

### Сопутствующие модели/константы

- `avatar/avatar.ts`

---

## AvatarGroupComponent

- **Путь:** `avatarGroup/avatar-group.component.ts`
- **Селектор:** `app-avatar-group`
- **Standalone:** true
- **Implements:** OnChanges
- **CVA:** нет
- **Назначение:** Группа аватаров с лимитом max и счётчиком остатка

### Inputs

- `avatars`: `{ imgUrl?: string`, default —, опциональный — Массив аватаров
- `max`: `number`, default `4`, опциональный — Макс. видимых элементов
- `size`: `keyof typeof this.AVATAR_SIZES`, default `'md'`, опциональный — Размерный вариант
- `reverse`: `boolean`, default `false`, опциональный — Обратный порядок

### Outputs

_нет_

### ng-content слоты

_нет_

### Разметка

- Корневые теги: div, div, img, ng-template, div, div, span
- Условия (*ngIf/@if): 2; циклы (*ngFor/@for): 1
- Ключевые классы (фрагмент): `flex items-center relative w-full h-full object-cover absolute top-0 left-0 justify-center bg-gray-300 text-white rounded-full border border-gray-100 inline-flex bg-gray-50 text-gray-700 font-semibold -mt-0.5`

### Стили

- Нет отдельного CSS (стили через Tailwind-классы в шаблоне/TS).
- `:host`: нет
- Основная стилизация: **Tailwind utility-классы** в шаблоне и/или строковых константах TS (`button.ts`, `badge.ts` и т.п.).

### Функционал класса

- **Lifecycle:** ngOnChanges
- **HostListeners:** —
- **Инъекции:** —
- **Методы (извлечённые):** ngOnChanges
- Подписки RxJS: нет
- Работа с формами (кроме CVA): нет
- Анимации Angular: нет

### Зависимости

- imports компонента: NgForOf, NgIf, NgClass, NgStyle
- Angular: @angular/core, @angular/common
- Сторонние: —
- Локальные: —

### Доступность

- В шаблоне явных aria/role почти нет (или классы задают фокус через Tailwind focus:*)

---

## BadgeComponent

- **Путь:** `badge/badge.component.ts`
- **Селектор:** `app-badge`
- **Standalone:** true
- **Implements:** —
- **CVA:** нет
- **Назначение:** Бейдж/чип с цветом, размером, иконкой или картинкой

### Inputs

- `icon`: `string`, default —, опциональный — Имя иконки
- `img`: `string`, default —, опциональный — URL изображения
- `iconClickable`: `inferred`, default `false`, опциональный — Иконка кликабельна
- `iconDirection`: `TIconDirectionLR`, default `'left'`, опциональный — Позиция иконки left/right
- `iconVariant`: `TIconVariant`, default `'solid'`, опциональный — Стиль иконки (outline/solid/…)
- `color`: `TColors`, default `'gray'`, опциональный — Цветовая схема
- `size`: `TSizes`, default `'sm'`, опциональный — Размерный вариант
- `border`: `inferred`, default `false`, опциональный — Показать border
- `rounded`: `inferred`, default `false`, опциональный — Полное скругление (pill)
- `disabled`: `inferred`, default `false`, опциональный — Блокировка взаимодействия

### Outputs

- `iconClick`: EventEmitter<`void`>; эмитится: iconClick.emit()

### ng-content слоты

- `app-icon`
- `(default)`

### Разметка

- Корневые теги: div, img, ng-container, ng-content, ng-container, button, app-icon, app-icon
- Условия (*ngIf/@if): 7; циклы (*ngFor/@for): 0
- Ключевые классы (фрагмент): `inline-flex items-center font-medium w-4 h-4 rounded-full mr-0.5 object-cover hover:bg-green-50 transition-all duration-300 ml-0.5`

### Стили

- Цвета: —; радиусы: —; font-size: —; CSS-vars: нет
- `:host`: есть
- Основная стилизация: **Tailwind utility-классы** в шаблоне и/или строковых константах TS (`button.ts`, `badge.ts` и т.п.).

### Функционал класса

- **Lifecycle:** —
- **HostListeners:** —
- **Инъекции:** —
- **Методы (извлечённые):** getClassObject, onIconClick
- Подписки RxJS: нет
- Работа с формами (кроме CVA): нет
- Анимации Angular: нет

### Зависимости

- imports компонента: NgIf, NgClass, IconComponent
- Angular: @angular/core, @angular/common
- Сторонние: —
- Локальные: ./badge, ../icons/icon, ../icons/icon.component

### Доступность

- В шаблоне явных aria/role почти нет (или классы задают фокус через Tailwind focus:*)
- A11y-related inputs: iconVariant

### Сопутствующие модели/константы

- `badge/badge.ts`

---

## ButtonComponent

- **Путь:** `button/button.component.ts`
- **Селектор:** `app-button`
- **Standalone:** true
- **Implements:** —
- **CVA:** нет
- **Назначение:** Кнопка с вариантами, цветами, размерами и иконками

### Inputs

- `label`: `inferred`, default `''`, опциональный — Подпись поля/кнопки
- `variant`: `TVariants`, default `'primary'`, опциональный — Визуальный/поведенческий вариант
- `size`: `keyof typeof sizes.buttonSize.default`, default `'md'`, опциональный — Размерный вариант
- `type`: `'button' | 'submit' | 'reset'`, default `'button'`, опциональный — HTML/логический тип
- `icon`: `TIconName`, default —, опциональный — Имя иконки
- `iconVariant`: `TIconVariant`, default —, опциональный — Стиль иконки (outline/solid/…)
- `iconDirection`: `TIconDirectionLR`, default `'right'`, опциональный — Позиция иконки left/right
- `iconClass`: `string`, default —, опциональный — Доп. CSS-классы иконки
- `disabled`: `inferred`, default `false`, опциональный — Блокировка взаимодействия
- `rounded`: `inferred`, default `false`, опциональный — Полное скругление (pill)
- `color`: `'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'purple'`, default `'gray'`, опциональный — Цветовая схема
- `fullWidth`: `inferred`, default `false`, опциональный — Растянуть на 100% ширины

### Outputs

_нет_

### ng-content слоты

- `(default)`

### Разметка

- Корневые теги: button, ng-container, span, app-icon, ng-container, span, app-icon, span
- Условия (*ngIf/@if): 4; циклы (*ngFor/@for): 0

### Стили

- Цвета: —; радиусы: —; font-size: —; CSS-vars: нет
- `:host`: есть
- Основная стилизация: **Tailwind utility-классы** в шаблоне и/или строковых константах TS (`button.ts`, `badge.ts` и т.п.).

### Функционал класса

- **Lifecycle:** —
- **HostListeners:** —
- **Инъекции:** —
- **Методы (извлечённые):** capitalizeFirstLetter
- Подписки RxJS: нет
- Работа с формами (кроме CVA): нет
- Анимации Angular: нет

### Зависимости

- imports компонента: NgIf, NgClass, IconComponent
- Angular: @angular/core, @angular/common
- Сторонние: —
- Локальные: ./button, ../icons/icon, ../icons/icon.component

### Доступность

- В шаблоне явных aria/role почти нет (или классы задают фокус через Tailwind focus:*)
- A11y-related inputs: label, variant, iconVariant

### Сопутствующие модели/константы

- `button/button.ts`

---

## ButtonGroupComponent

- **Путь:** `buttonGroup/button-group.component.ts`
- **Селектор:** `app-button-group`
- **Standalone:** true
- **Implements:** —
- **CVA:** нет
- **Назначение:** Контейнер для группы кнопок (с/без разделителя)

### Inputs

- `line`: `boolean`, default `false`, опциональный — см. использование в шаблоне/классе

### Outputs

_нет_

### ng-content слоты

- `(default)`

### Разметка

- Корневые теги: div, ng-content
- Условия (*ngIf/@if): 0; циклы (*ngFor/@for): 0

### Стили

- Нет отдельного CSS (стили через Tailwind-классы в шаблоне/TS).
- `:host`: нет
- Основная стилизация: **Tailwind utility-классы** в шаблоне и/или строковых константах TS (`button.ts`, `badge.ts` и т.п.).

### Функционал класса

- **Lifecycle:** —
- **HostListeners:** —
- **Инъекции:** —
- **Методы (извлечённые):** —
- Подписки RxJS: нет
- Работа с формами (кроме CVA): нет
- Анимации Angular: нет

### Зависимости

- imports компонента: NgClass
- Angular: @angular/core, @angular/common
- Сторонние: —
- Локальные: —

### Доступность

- В шаблоне явных aria/role почти нет (или классы задают фокус через Tailwind focus:*)

---

## CardComponent

- **Путь:** `card/card.component.ts`
- **Селектор:** `app-card`
- **Standalone:** true
- **Implements:** OnInit, OnDestroy
- **CVA:** нет
- **Назначение:** Карточка контента (статья/медиа) с изображением и метаданными

### Inputs

- `publisher`: `string`, default `''`, опциональный — Издатель
- `author`: `string`, default `''`, опциональный — Автор
- `link`: `string`, default `'#'`, опциональный — URL перехода
- `variant`: `CardVariant`, default `'col'`, опциональный — Визуальный/поведенческий вариант
- `size`: `CardSize`, default `'xl'`, опциональный — Размерный вариант
- `rowImageHeightMode`: `RowImageHeightMode`, default `'fixed'`, опциональный — см. использование в шаблоне/классе
- `rowIdentityPosition`: `RowIdentityPosition`, default `'top'`, опциональный — см. использование в шаблоне/классе
- `rowMetaLayout`: `RowMetaLayout`, default `'split'`, опциональный — см. использование в шаблоне/классе
- `rowImageAspect`: `RowImageAspect`, default `'1/1'`, опциональный — см. использование в шаблоне/классе
- `rowImageAspectMd`: `RowImageAspect`, default —, опциональный — см. использование в шаблоне/классе
- `showBottomBorder`: `boolean`, default `true`, опциональный — см. использование в шаблоне/классе
- `isLoading`: `boolean`, default `false`, опциональный — Скелетон/loading
- `metricsType`: `boolean`, default `false`, опциональный — Режим метрик на карточке
- `openArticleId`: `number | string | null`, default `null`, опциональный — см. использование в шаблоне/классе

### Outputs

- `openArticle`: EventEmitter<`string | number | null`>; эмитится: openArticle.emit(payload)

### ng-content слоты

_нет_

### Разметка

- Корневые теги: div, div, app-avatar, button, span, button, div, div
- Условия (*ngIf/@if): 46; циклы (*ngFor/@for): 0
- Ключевые классы (фрагмент): `w-full flex flex-col pb-4 mb-1 items-center gap-1 font-medium text-gray-900 text-xs font-onest leading-4 tracking-[-0.18px] hover:underline cursor-pointer text-gray-600 gap-2 items-start justify-between gap-4 min-w-40 gap-3 min-w-0 font-lora line-clamp-3`

### Стили

- Нет отдельного CSS (стили через Tailwind-классы в шаблоне/TS).
- `:host`: нет
- Основная стилизация: **Tailwind utility-классы** в шаблоне и/или строковых константах TS (`button.ts`, `badge.ts` и т.п.).

### Функционал класса

- **Lifecycle:** ngOnInit, ngOnDestroy
- **HostListeners:** document:click, document:keydown.escape, window:resize
- **Инъекции:** ChangeDetectorRef, Router, SavedCardsService, FollowStateService, ViewHistoryService
- **Методы (извлечённые):** ngOnInit, navigateToPublisher, navigateToAuthor, onTitleClick, onPopoverUrmaresteClick, normalizeSize, getImgClass, getTitleClass, getSubtitleClass, getDateClass, getRowImageAspectClass, aspectClass, aspectClassMd, showRowIdentityOnTop, showRowIdentityOnBottom, includeOnMainUrl, recordView, toggleWatchLater, toggleSaveToList, togglePublisherFollowFromMenu, toggleAuthorFollowFromMenu, onWatchLaterMenuClick, onSaveToListMenuClick, onShareMenuClick, onCopyLinkMenuClick…
- Подписки RxJS: да
- Работа с формами (кроме CVA): нет
- Анимации Angular: нет

### Зависимости

- imports компонента: NgIf, NgClass, NgTemplateOutlet, ArticlecardReactionsComponent, AvatarComponent, ButtonComponent, IconComponent, TooltipHoverComponent
- Angular: @angular/core, @angular/common, @angular/router
- Сторонние: src/app/admin/crud/article/article, src/app/website/article-listings/index-category-tag/ui/ui-articlecard/articlecard-reactions/articlecard-reactions.component, @floating-ui/dom, src/app/common/data/saved-cards.service, src/app/common/data/follow-state.service, src/app/common/data/view-history.service, src/app/common/data/publishers-data
- Локальные: ../avatar/avatar.component, ../button/button.component, ../icons/icon.component, ../tooltipHover/tooltip-hover.component

### Доступность

- В шаблоне: aria-expanded, aria-haspopup="menu", aria-expanded, aria-haspopup="menu", aria-expanded, aria-haspopup="menu", role="menu", role="menu", role="menuitem", role="menuitem", role="menuitem", role="menuitem", role="menuitem", role="menuitem", role="menuitem", role="menuitem", role="menuitem", role="menuitem", role="menuitem", role="menuitem"
- В TS: ts-a11y-patterns
- A11y-related inputs: variant

---

## SwiperComponent

- **Путь:** `carousel/swiper.component.ts`
- **Селектор:** `app-swiper`
- **Standalone:** true
- **Implements:** AfterViewInit
- **CVA:** нет
- **Назначение:** Карусель/слайдер на базе Swiper

### Inputs

_нет_

### Outputs

_нет_

### ng-content слоты

- `(default)`

### Разметка

- Корневые теги: div, button, svg, path, swiper-container, ng-content, button, svg
- Условия (*ngIf/@if): 0; циклы (*ngFor/@for): 0
- Ключевые классы (фрагмент): `relative w-full h-full swiper-button-prev cursor-pointer absolute top-1/2 transform -translate-y-1/2 z-10 bg-gray-50 rounded-full border border-gray-100 group hover:bg-gray-900 hover:border-gray-900 transition-all duration-300 fill-gray-500 group-hover:fill-white swiper-button-next`

### Стили

- Цвета: —; радиусы: —; font-size: —; CSS-vars: нет
- `:host`: нет
- Основная стилизация: **Tailwind utility-классы** в шаблоне и/или строковых константах TS (`button.ts`, `badge.ts` и т.п.).

### Функционал класса

- **Lifecycle:** ngAfterViewInit
- **HostListeners:** —
- **Инъекции:** —
- **Методы (извлечённые):** ngAfterViewInit, prevSlide, nextSlide
- Подписки RxJS: нет
- Работа с формами (кроме CVA): нет
- Анимации Angular: нет

### Зависимости

- Angular: @angular/core
- Сторонние: —
- Локальные: —

### Доступность

- В шаблоне явных aria/role почти нет (или классы задают фокус через Tailwind focus:*)

---

## CheckboxComponent

- **Путь:** `checkbox/checkbox.component.ts`
- **Селектор:** `app-checkbox`
- **Standalone:** true
- **Implements:** OnChanges
- **CVA:** нет
- **Назначение:** Чекбокс или радио с label/description

### Inputs

- `type`: `'checkbox' | 'radio'`, default `'checkbox'`, опциональный — HTML/логический тип
- `rounded`: `boolean`, default `false`, опциональный — Полное скругление (pill)
- `checked`: `boolean`, default `false`, опциональный — Состояние checked
- `disabled`: `boolean`, default `false`, опциональный — Блокировка взаимодействия
- `indeterminate`: `boolean`, default `false`, опциональный — Indeterminate checkbox
- `variant`: `'default' | 'error'`, default `'default'`, опциональный — Визуальный/поведенческий вариант
- `title`: `string`, default `''`, опциональный — Заголовок
- `description`: `string`, default `''`, опциональный — Описание

### Outputs

- `checkedChange`: EventEmitter<`boolean`>; эмитится: checkedChange.emit(this.checked)

### ng-content слоты

_нет_

### Разметка

- Корневые теги: label, input, div, span, div
- Условия (*ngIf/@if): 2; циклы (*ngFor/@for): 0
- Ключевые классы (фрагмент): `text-gray-900 text-gray-500`

### Стили

- Цвета: #fffffa, #121212; радиусы: —; font-size: —; CSS-vars: нет
- `:host`: есть
- Основная стилизация: **Tailwind utility-классы** в шаблоне и/или строковых константах TS (`button.ts`, `badge.ts` и т.п.).

### Функционал класса

- **Lifecycle:** ngOnChanges
- **HostListeners:** —
- **Инъекции:** ElementRef, Renderer2
- **Методы (извлечённые):** ngOnChanges, onInputChange
- Подписки RxJS: нет
- Работа с формами (кроме CVA): нет
- Анимации Angular: нет

### Зависимости

- imports компонента: NgIf, NgClass
- Angular: @angular/core, @angular/common
- Сторонние: —
- Локальные: —

### Доступность

- В шаблоне явных aria/role почти нет (или классы задают фокус через Tailwind focus:*)
- A11y-related inputs: variant

---

## PulseDotComponent

- **Путь:** `dotPulse/pulse-dot.component.ts`
- **Селектор:** `app-pulse-dot`
- **Standalone:** true
- **Implements:** —
- **CVA:** нет
- **Назначение:** Анимированная пульсирующая точка (индикатор)

### Inputs

_нет_

### Outputs

_нет_

### ng-content слоты

_нет_

### Разметка

- Корневые теги: span, span, span
- Условия (*ngIf/@if): 0; циклы (*ngFor/@for): 0
- Ключевые классы (фрагмент): `relative flex size-3 absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75 bg-red-500`

### Стили

- Нет отдельного CSS (стили через Tailwind-классы в шаблоне/TS).
- `:host`: нет
- Основная стилизация: **Tailwind utility-классы** в шаблоне и/или строковых константах TS (`button.ts`, `badge.ts` и т.п.).

### Функционал класса

- **Lifecycle:** —
- **HostListeners:** —
- **Инъекции:** —
- **Методы (извлечённые):** —
- Подписки RxJS: нет
- Работа с формами (кроме CVA): нет
- Анимации Angular: нет

### Зависимости

- Angular: @angular/core
- Сторонние: —
- Локальные: —

### Доступность

- В шаблоне явных aria/role почти нет (или классы задают фокус через Tailwind focus:*)

---

## DropdownComponent

- **Путь:** `dropdown/dropdown.component.ts`
- **Селектор:** `app-dropdown`
- **Standalone:** true
- **Implements:** AfterViewInit
- **CVA:** нет
- **Назначение:** Выпадающее меню с секциями

### Inputs

- `title`: `string`, default `'Меню'`, опциональный — Заголовок
- `sections`: `{ heading: string`, default —, опциональный — Секции меню
- `sizeVariant`: `'xl' | 'lg' | 'md' | 'sm'`, default `'xl'`, опциональный — Размер dropdown

### Outputs

_нет_

### ng-content слоты

_нет_

### Разметка

- Корневые теги: div, button, div, app-icon, div, div, p, div
- Условия (*ngIf/@if): 2; циклы (*ngFor/@for): 2
- Ключевые классы (фрагмент): `relative inline-block text-left w-4 h-4 text-gray-500 absolute my-2 z-50 min-w-28 w-fit rounded-md bg-cFFFFFA border border-gray-100 divide-y divide-gray-900/10 py-1 px-3 py-2 text-xs leading-4 font-onest text-gray-400 block`

### Стили

- Нет отдельного CSS (стили через Tailwind-классы в шаблоне/TS).
- `:host`: нет
- Основная стилизация: **Tailwind utility-классы** в шаблоне и/или строковых константах TS (`button.ts`, `badge.ts` и т.п.).

### Функционал класса

- **Lifecycle:** ngAfterViewInit
- **HostListeners:** window:resize, document:click
- **Инъекции:** ElementRef
- **Методы (извлечённые):** ngAfterViewInit, toggleDropdown, closeDropdown, calculatePosition, onWindowResize, onClickOutside
- Подписки RxJS: нет
- Работа с формами (кроме CVA): нет
- Анимации Angular: нет

### Зависимости

- imports компонента: NgIf, NgForOf, NgClass, NgStyle, IconComponent
- Angular: @angular/core, @angular/common
- Сторонние: —
- Локальные: ../icons/icon.component

### Доступность

- В шаблоне явных aria/role почти нет (или классы задают фокус через Tailwind focus:*)
- A11y-related inputs: sizeVariant

---

## IconComponent

- **Путь:** `icons/icon.component.ts`
- **Селектор:** `app-icon`
- **Standalone:** true
- **Implements:** —
- **CVA:** нет
- **Назначение:** Иконка из набора Heroicons-подобных SVG

### Inputs

- `type`: `TIconVariant`, default `'outline'`, опциональный — HTML/логический тип
- `class`: `string`, default —, опциональный — Доп. CSS-класс
- `direction`: `TIconDirectionLR`, default `'left'`, опциональный — Направление

### Outputs

_нет_

### ng-content слоты

_нет_

### Разметка

- нет шаблона
- Условия (*ngIf/@if): 0; циклы (*ngFor/@for): 0

### Стили

- Цвета: —; радиусы: —; font-size: —; CSS-vars: нет
- `:host`: есть
- Основная стилизация: **Tailwind utility-классы** в шаблоне и/или строковых константах TS (`button.ts`, `badge.ts` и т.п.).

### Функционал класса

- **Lifecycle:** —
- **HostListeners:** —
- **Инъекции:** —
- **Методы (извлечённые):** getIconPath
- Подписки RxJS: нет
- Работа с формами (кроме CVA): нет
- Анимации Angular: нет

### Зависимости

- imports компонента: CommonModule
- Angular: @angular/core, @angular/common
- Сторонние: —
- Локальные: ./icon

### Доступность

- В шаблоне явных aria/role почти нет (или классы задают фокус через Tailwind focus:*)
- В TS: ts-a11y-patterns

### Сопутствующие модели/константы

- `icons/icon.ts`

---

## InputFieldComponent

- **Путь:** `input/input.component.ts`
- **Селектор:** `app-input-field`
- **Standalone:** true
- **Implements:** ControlValueAccessor
- **CVA:** да
- **Назначение:** Текстовое поле ввода (CVA) с label/helper/ошибкой

### Inputs

- `label`: `inferred`, default `''`, опциональный — Подпись поля/кнопки
- `helperText`: `inferred`, default `''`, опциональный — Вспомогательный текст под контролом
- `type`: `'text' | 'email' | 'password' | 'search'`, default `'text'`, опциональный — HTML/логический тип
- `placeholder`: `inferred`, default `''`, опциональный — Placeholder текста
- `iconButton`: `inferred`, default `''`, опциональный — Иконка внутри поля (кнопка)
- `error`: `inferred`, default `false`, опциональный — Состояние ошибки (стили/helper)
- `size`: `'sm' | 'md' | 'lg'`, default `'lg'`, опциональный — Размерный вариант
- `withButton`: `'left' | 'right' | null`, default `null`, опциональный — Кнопка слева/справа от input
- `buttonLabel`: `inferred`, default `''`, опциональный — Текст кнопки у input
- `prefix`: `inferred`, default `''`, опциональный — Префикс в input
- `disabled`: `inferred`, default `false`, опциональный — Блокировка взаимодействия
- `pill`: `inferred`, default `false`, опциональный — Pill-скругление input
- `appearance`: `'default' | 'laziarPanel'`, default `'default'`, опциональный — Skin/appearance input

### Outputs

- `valueChange`: EventEmitter<`string`>; эмитится: valueChange.emit(input.value); valueChange.emit('')

### ng-content слоты

_нет_

### Разметка

- Корневые теги: div, label, div, div, app-button, span, app-icon, input
- Условия (*ngIf/@if): 8; циклы (*ngFor/@for): 0
- Ключевые классы (фрагмент): `w-full min-w-0 flex flex-col gap-2 block text-sm font-onest leading-5 font-medium text-gray-900 dark:text-gray-50 items-center bg-cFFFFFA dark:bg-gray-900/5 shadow-xs relative transition-opacity duration-150 border-l border-y border-gray-200 rounded-l-md absolute left-3`

### Стили

- Цвета: —; радиусы: border-radius: 0; font-size: —; CSS-vars: нет
- `:host`: есть
- Основная стилизация: **Tailwind utility-классы** в шаблоне и/или строковых константах TS (`button.ts`, `badge.ts` и т.п.).

### Функционал класса

- **Lifecycle:** ngOnInit
- **HostListeners:** —
- **Инъекции:** —
- **Методы (извлечённые):** ngOnInit, togglePasswordVisibility, writeValue, setDisabledState, onInput, clearSearch
- Подписки RxJS: нет
- Работа с формами (кроме CVA): нет
- Анимации Angular: нет

### Зависимости

- imports компонента: CommonModule, FormsModule, ButtonComponent, TooltipHoverComponent, IconComponent
- Angular: @angular/core, @angular/forms, @angular/common, @angular/forms
- Сторонние: —
- Локальные: ../button/button.component, ../tooltipHover/tooltip-hover.component, ../icons/icon.component

### Доступность

- В шаблоне явных aria/role почти нет (или классы задают фокус через Tailwind focus:*)
- A11y-related inputs: label, buttonLabel

### Сопутствующие модели/константы

- `input/input.ts`

---

## LanguageDropdownComponent

- **Путь:** `languageDropdown/language-dropdown.component.ts`
- **Селектор:** `app-language-dropdown`
- **Standalone:** true
- **Implements:** —
- **CVA:** нет
- **Назначение:** Выпадающий переключатель языка

### Inputs

_нет_

### Outputs

_нет_

### ng-content слоты

_нет_

### Разметка

- Корневые теги: div, button, img, span, app-icon, div, ul, li
- Условия (*ngIf/@if): 2; циклы (*ngFor/@for): 1
- Ключевые классы (фрагмент): `relative inline-block text-left flex items-center gap-1 px-0.5 group rounded-full focus:outline-none border-2 border-transparent focus:border-gray-900/10 transition-colors duration-300 w-4 h-4 text-xs transition-color text-gray-600 group-hover:text-gray-900 focus:text-gray-200 dark:text-gray-200 dark:group-hover:text-gray-50 dark:focus:text-gray-50`

### Стили

- Нет отдельного CSS (стили через Tailwind-классы в шаблоне/TS).
- `:host`: нет
- Основная стилизация: **Tailwind utility-классы** в шаблоне и/или строковых константах TS (`button.ts`, `badge.ts` и т.п.).

### Функционал класса

- **Lifecycle:** ngOnDestroy
- **HostListeners:** —
- **Инъекции:** —
- **Методы (извлечённые):** toggleDropdown, handleOutsideClick, selectLanguage, setLanguage, getLanguageInitials, isCurrentLanguage, ngOnDestroy
- Подписки RxJS: нет
- Работа с формами (кроме CVA): нет
- Анимации Angular: нет

### Зависимости

- imports компонента: NgIf, NgForOf, NgClass, IconComponent
- Angular: @angular/core, @angular/common
- Сторонние: —
- Локальные: ../icons/icon.component

### Доступность

- В шаблоне явных aria/role почти нет (или классы задают фокус через Tailwind focus:*)

---

## LoadingComponent

- **Путь:** `loading/loading.component.ts`
- **Селектор:** `app-loading`
- **Standalone:** true
- **Implements:** —
- **CVA:** нет
- **Назначение:** Индикатор загрузки (spinner/dot)

### Inputs

- `color`: `'black' | 'red'`, default `'black'`, опциональный — Цветовая схема
- `size`: `'sm' | 'md' | 'lg' | 'xl'`, default `'xl'`, опциональный — Размерный вариант
- `variant`: `'spinner' | 'dot'`, default `'spinner'`, опциональный — Визуальный/поведенческий вариант

### Outputs

_нет_

### ng-content слоты

_нет_

### Разметка

- Корневые теги: div, svg, circle, div, div
- Условия (*ngIf/@if): 2; циклы (*ngFor/@for): 1
- Ключевые классы (фрагмент): `inline-flex justify-center items-center relative absolute rounded-full`

### Стили

- Цвета: —; радиусы: —; font-size: —; CSS-vars: нет
- `:host`: нет
- Основная стилизация: **Tailwind utility-классы** в шаблоне и/или строковых константах TS (`button.ts`, `badge.ts` и т.п.).

### Функционал класса

- **Lifecycle:** —
- **HostListeners:** —
- **Инъекции:** —
- **Методы (извлечённые):** getTailwindDotStyle, getDotAnimation
- Подписки RxJS: нет
- Работа с формами (кроме CVA): нет
- Анимации Angular: нет

### Зависимости

- imports компонента: NgIf, NgForOf, NgClass, NgStyle
- Angular: @angular/core, @angular/common
- Сторонние: —
- Локальные: —

### Доступность

- В шаблоне явных aria/role почти нет (или классы задают фокус через Tailwind focus:*)
- A11y-related inputs: variant

---

## ProgressCircleComponent

- **Путь:** `progressCircle/progress-circle.component.ts`
- **Селектор:** `app-progress-circle`
- **Standalone:** true
- **Implements:** —
- **CVA:** нет
- **Назначение:** Круговой индикатор прогресса

### Inputs

- `progress`: `inferred`, default `75`, опциональный — Значение прогресса 0–100
- `size`: `'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'`, default `'md'`, опциональный — Размерный вариант
- `variant`: `'red' | 'white'`, default `'red'`, опциональный — Визуальный/поведенческий вариант

### Outputs

_нет_

### ng-content слоты

_нет_

### Разметка

- Корневые теги: div, svg, circle, circle, div
- Условия (*ngIf/@if): 0; циклы (*ngFor/@for): 0
- Ключевые классы (фрагмент): `relative inline-block transition-all duration-500 absolute inset-0 flex items-center justify-center font-semibold font-onest`

### Стили

- Нет отдельного CSS (стили через Tailwind-классы в шаблоне/TS).
- `:host`: нет
- Основная стилизация: **Tailwind utility-классы** в шаблоне и/или строковых константах TS (`button.ts`, `badge.ts` и т.п.).

### Функционал класса

- **Lifecycle:** —
- **HostListeners:** —
- **Инъекции:** —
- **Методы (извлечённые):** —
- Подписки RxJS: нет
- Работа с формами (кроме CVA): нет
- Анимации Angular: нет

### Зависимости

- imports компонента: NgClass, NgStyle
- Angular: @angular/core, @angular/common
- Сторонние: —
- Локальные: —

### Доступность

- В шаблоне явных aria/role почти нет (или классы задают фокус через Tailwind focus:*)
- A11y-related inputs: variant

---

## SelectComponent

- **Путь:** `select/select.component.ts`
- **Селектор:** `app-select`
- **Standalone:** true
- **Implements:** —
- **CVA:** нет
- **Назначение:** Выпадающий select

### Inputs

- `label`: `string`, default —, опциональный — Подпись поля/кнопки
- `placeholder`: `string`, default `'Select...'`, опциональный — Placeholder текста
- `options`: `string[]`, default `[]`, опциональный — Список опций
- `size`: `'sm' | 'md'`, default `'md'`, опциональный — Размерный вариант
- `helperText`: `string`, default —, опциональный — Вспомогательный текст под контролом
- `disabled`: `boolean`, default `false`, опциональный — Блокировка взаимодействия

### Outputs

_нет_

### ng-content слоты

_нет_

### Разметка

- Корневые теги: div, label, button, div, ul, li, span, svg
- Условия (*ngIf/@if): 4; циклы (*ngFor/@for): 1
- Ключевые классы (фрагмент): `w-full relative block mb-2 text-sm font-onest leading-5 font-medium text-gray-900 mt-2 text-gray-500 absolute z-10 py-2 bg-cFFFFFA border border-gray-100 rounded-lg shadow-lg max-h-48 overflow-y-auto fill-gray-900 w-3 h-3`

### Стили

- Нет отдельного CSS (стили через Tailwind-классы в шаблоне/TS).
- `:host`: нет
- Основная стилизация: **Tailwind utility-классы** в шаблоне и/или строковых константах TS (`button.ts`, `badge.ts` и т.п.).

### Функционал класса

- **Lifecycle:** —
- **HostListeners:** document:click
- **Инъекции:** ElementRef
- **Методы (извлечённые):** toggleDropdown, selectOption, clickOutside
- Подписки RxJS: нет
- Работа с формами (кроме CVA): нет
- Анимации Angular: нет

### Зависимости

- imports компонента: NgIf, NgForOf, NgClass
- Angular: @angular/core, @angular/common
- Сторонние: —
- Локальные: —

### Доступность

- В шаблоне явных aria/role почти нет (или классы задают фокус через Tailwind focus:*)
- A11y-related inputs: label

---

## SwitchToggleComponent

- **Путь:** `switchToggle/switch-toggle.component.ts`
- **Селектор:** `app-switch-toggle`
- **Standalone:** true
- **Implements:** —
- **CVA:** нет
- **Назначение:** Переключатель on/off

### Inputs

- `active`: `inferred`, default `false`, опциональный — Активное состояние
- `disabled`: `inferred`, default `false`, опциональный — Блокировка взаимодействия
- `size`: `'sm' | 'md'`, default `'md'`, опциональный — Размерный вариант

### Outputs

- `changed`: EventEmitter<`boolean`>; эмитится: changed.emit(this.active)

### ng-content слоты

_нет_

### Разметка

- Корневые теги: div, button, span
- Условия (*ngIf/@if): 0; циклы (*ngFor/@for): 0
- Ключевые классы (фрагмент): `inline-flex items-center justify-center rounded-full transition-colors duration-300 ease-in-out focus-within:ring-2 focus-within:ring-gray-900/10 relative focus:outline-none inline-block transform transition-all`

### Стили

- Нет отдельного CSS (стили через Tailwind-классы в шаблоне/TS).
- `:host`: нет
- Основная стилизация: **Tailwind utility-классы** в шаблоне и/или строковых константах TS (`button.ts`, `badge.ts` и т.п.).

### Функционал класса

- **Lifecycle:** —
- **HostListeners:** —
- **Инъекции:** —
- **Методы (извлечённые):** toggle
- Подписки RxJS: нет
- Работа с формами (кроме CVA): нет
- Анимации Angular: нет

### Зависимости

- imports компонента: NgClass
- Angular: @angular/core, @angular/common
- Сторонние: —
- Локальные: —

### Доступность

- В шаблоне явных aria/role почти нет (или классы задают фокус через Tailwind focus:*)

---

## TabButtonComponent

- **Путь:** `tabButton/tab-button.component.ts`
- **Селектор:** `app-tab-button`
- **Standalone:** true
- **Implements:** —
- **CVA:** нет
- **Назначение:** Одиночная вкладка-кнопка (навигация)

### Inputs

- `label`: `string`, default `'Tab'`, опциональный — Подпись поля/кнопки
- `active`: `boolean`, default `false`, опциональный — Активное состояние
- `link`: `string`, default —, опциональный — URL перехода
- `size`: `'md' | 'lg'`, default `'md'`, опциональный — Размерный вариант
- `variant`: `'bg' | 'line'`, default `'bg'`, опциональный — Визуальный/поведенческий вариант

### Outputs

_нет_

### ng-content слоты

_нет_

### Разметка

- Корневые теги: div, a, div
- Условия (*ngIf/@if): 1; циклы (*ngFor/@for): 0
- Ключевые классы (фрагмент): `inline-grid`

### Стили

- Нет отдельного CSS (стили через Tailwind-классы в шаблоне/TS).
- `:host`: нет
- Основная стилизация: **Tailwind utility-классы** в шаблоне и/или строковых константах TS (`button.ts`, `badge.ts` и т.п.).

### Функционал класса

- **Lifecycle:** —
- **HostListeners:** —
- **Инъекции:** —
- **Методы (извлечённые):** —
- Подписки RxJS: нет
- Работа с формами (кроме CVA): нет
- Анимации Angular: нет

### Зависимости

- imports компонента: RouterLink, NgIf, NgClass
- Angular: @angular/core, @angular/common, @angular/router
- Сторонние: —
- Локальные: —

### Доступность

- В шаблоне явных aria/role почти нет (или классы задают фокус через Tailwind focus:*)
- A11y-related inputs: label, variant

---

## TabsComponent

- **Путь:** `tabs/tabs.component.ts`
- **Селектор:** `app-tabs`
- **Standalone:** true
- **Implements:** —
- **CVA:** нет
- **Назначение:** Группа вкладок с активным индексом

### Inputs

- `tabs`: `string[]`, default `[]`, опциональный — Список вкладок
- `style`: `'outline' | 'underline' | 'border'`, default `'outline'`, опциональный — см. использование в шаблоне/классе
- `size`: `'sm' | 'md' | 'lg'`, default `'md'`, опциональный — Размерный вариант
- `badges`: `(TabBadge | null)[]`, default `[]`, опциональный — см. использование в шаблоне/классе
- `icons`: `string[]`, default `[]`, опциональный — см. использование в шаблоне/классе
- `class`: `string`, default —, опциональный — Доп. CSS-класс
- `activeTab`: `inferred`, default `0`, опциональный — Индекс активной вкладки

### Outputs

- `activeTabChange`: EventEmitter<`number`>; эмитится: activeTabChange.emit(index)

### ng-content слоты

_нет_

### Разметка

- Корневые теги: div, button, app-icon, app-badge, div
- Условия (*ngIf/@if): 3; циклы (*ngFor/@for): 1
- Ключевые классы (фрагмент): `absolute bottom-0 h-0.5 bg-gray-900 transition-all duration-300 z-10`

### Стили

- Нет отдельного CSS (стили через Tailwind-классы в шаблоне/TS).
- `:host`: нет
- Основная стилизация: **Tailwind utility-классы** в шаблоне и/или строковых константах TS (`button.ts`, `badge.ts` и т.п.).

### Функционал класса

- **Lifecycle:** —
- **HostListeners:** —
- **Инъекции:** —
- **Методы (извлечённые):** getTabClasses, setActiveTab
- Подписки RxJS: нет
- Работа с формами (кроме CVA): нет
- Анимации Angular: нет

### Зависимости

- imports компонента: CommonModule, BadgeComponent, IconComponent
- Angular: @angular/core, @angular/common
- Сторонние: —
- Локальные: ../badge/badge, ../badge/badge.component, ../icons/icon.component

### Доступность

- В шаблоне: aria-selected, role="tab"

---

## TextareaComponent

- **Путь:** `textarea/textarea.component.ts`
- **Селектор:** `app-textarea`
- **Standalone:** true
- **Implements:** —
- **CVA:** нет
- **Назначение:** Многострочное текстовое поле

### Inputs

- `label`: `string`, default —, опциональный — Подпись поля/кнопки
- `placeholder`: `string`, default —, опциональный — Placeholder текста
- `rows`: `number`, default `4`, опциональный — Число строк textarea
- `disabled`: `boolean`, default `false`, опциональный — Блокировка взаимодействия
- `helperText`: `string`, default —, опциональный — Вспомогательный текст под контролом
- `error`: `inferred`, default `false`, опциональный — Состояние ошибки (стили/helper)

### Outputs

_нет_

### ng-content слоты

_нет_

### Разметка

- Корневые теги: div, label, textarea, span
- Условия (*ngIf/@if): 2; циклы (*ngFor/@for): 0
- Ключевые классы (фрагмент): `w-full flex flex-col gap-2 block text-sm font-onest leading-5 font-medium text-gray-700 dark:text-gray-50 bg-cFFFFFA shadow-xs p-2`

### Стили

- Нет отдельного CSS (стили через Tailwind-классы в шаблоне/TS).
- `:host`: нет
- Основная стилизация: **Tailwind utility-классы** в шаблоне и/или строковых константах TS (`button.ts`, `badge.ts` и т.п.).

### Функционал класса

- **Lifecycle:** —
- **HostListeners:** —
- **Инъекции:** —
- **Методы (извлечённые):** —
- Подписки RxJS: нет
- Работа с формами (кроме CVA): нет
- Анимации Angular: нет

### Зависимости

- imports компонента: NgIf, NgClass
- Angular: @angular/core, @angular/common
- Сторонние: —
- Локальные: —

### Доступность

- В шаблоне явных aria/role почти нет (или классы задают фокус через Tailwind focus:*)
- A11y-related inputs: label

---

## TooltipComponent

- **Путь:** `tooltip/tooltip.component.ts`
- **Селектор:** `app-tooltip`
- **Standalone:** true
- **Implements:** —
- **CVA:** нет
- **Назначение:** Простой статичный tooltip

### Inputs

- `text`: `string`, default `'Tooltip text'`, опциональный — Основной текст
- `position`: `'top' | 'bottom' | 'left' | 'right'`, default `'top'`, опциональный — Позиция tooltip
- `theme`: `'dark' | 'light'`, default `'dark'`, опциональный — Тема dark/light

### Outputs

_нет_

### ng-content слоты

_нет_

### Разметка

- Корневые теги: div, button, svg, path, div, svg, path
- Условия (*ngIf/@if): 1; циклы (*ngFor/@for): 0
- Ключевые классы (фрагмент): `relative flex w-max w-3 h-3 items-center justify-center bg-gray-500 rounded-md ring-2 ring-transparent hover:bg-gray-900 focus:bg-gray-900 focus:ring-gray-900/10 transition-all duration-300 w-1.5 h-1.5 absolute`

### Стили

- Нет отдельного CSS (стили через Tailwind-классы в шаблоне/TS).
- `:host`: нет
- Основная стилизация: **Tailwind utility-классы** в шаблоне и/или строковых константах TS (`button.ts`, `badge.ts` и т.п.).

### Функционал класса

- **Lifecycle:** —
- **HostListeners:** document:click
- **Инъекции:** —
- **Методы (извлечённые):** toggleTooltip, onClickOutside
- Подписки RxJS: нет
- Работа с формами (кроме CVA): нет
- Анимации Angular: нет

### Зависимости

- imports компонента: CommonModule
- Angular: @angular/core, @angular/common
- Сторонние: —
- Локальные: —

### Доступность

- В шаблоне явных aria/role почти нет (или классы задают фокус через Tailwind focus:*)

---

## TooltipHoverComponent

- **Путь:** `tooltipHover/tooltip-hover.component.ts`
- **Селектор:** `app-tooltip-hover`
- **Standalone:** true
- **Implements:** OnInit, OnChanges, OnDestroy
- **CVA:** нет
- **Назначение:** Tooltip по hover с позиционированием

### Inputs

- `title`: `inferred`, default `''`, опциональный — Заголовок
- `text`: `inferred`, default `''`, опциональный — Основной текст
- `img`: `inferred`, default `''`, опциональный — URL изображения
- `position`: `| 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'`, default `'top'`, опциональный — Позиция tooltip
- `theme`: `'dark' | 'light'`, default `'dark'`, опциональный — Тема dark/light
- `arrow`: `inferred`, default `false`, опциональный — Показать стрелку tooltip
- `disabled`: `inferred`, default `false`, опциональный — Блокировка взаимодействия

### Outputs

_нет_

### ng-content слоты

- `(default)`

### Разметка

- Корневые теги: ng-template, div, div, img, div, span, svg, path
- Условия (*ngIf/@if): 4; циклы (*ngFor/@for): 0
- Ключевые классы (фрагмент): `relative box-border max-w-[min(20rem,calc(100vw-1rem))] min-w-0 break-words px-3 py-2 text-xs font-onest font-medium leading-4 rounded-lg shadow-md mb-3 w-full max-w-full overflow-hidden rounded-sm h-auto object-cover text-gray-400 whitespace-pre-line absolute flex cursor-pointer`

### Стили

- Цвета: —; радиусы: —; font-size: —; CSS-vars: нет
- `:host`: есть
- Основная стилизация: **Tailwind utility-классы** в шаблоне и/или строковых константах TS (`button.ts`, `badge.ts` и т.п.).

### Функционал класса

- **Lifecycle:** ngOnInit, ngOnDestroy, ngOnChanges
- **HostListeners:** —
- **Инъекции:** Overlay, ViewContainerRef, ElementRef, ChangeDetectorRef
- **Методы (извлечённые):** ngOnInit, ngOnChanges, ngOnDestroy, forceClose, hasPanelContent, clearHideTimer, scheduleHide, onTriggerMouseEnter, onTriggerMouseLeave, openOverlay, disposeOverlay, buildCdkPositions, buildCdkPositionsTopDefault
- Подписки RxJS: нет
- Работа с формами (кроме CVA): нет
- Анимации Angular: нет

### Зависимости

- imports компонента: CommonModule, OverlayModule
- Angular: @angular/core, @angular/common, @angular/cdk/overlay, @angular/cdk/portal
- Сторонние: —
- Локальные: —

### Доступность

- В шаблоне явных aria/role почти нет (или классы задают фокус через Tailwind focus:*)

---

## VideoPlayerComponent

- **Путь:** `videoPlayer/video-player.component.ts`
- **Селектор:** `app-video-player`
- **Standalone:** true
- **Implements:** AfterViewInit, OnDestroy
- **CVA:** нет
- **Назначение:** Видеоплеер с кастомными контролами

### Inputs

_нет_

### Outputs

_нет_

### ng-content слоты

_нет_

### Разметка

- Корневые теги: video, source
- Условия (*ngIf/@if): 0; циклы (*ngFor/@for): 0
- Ключевые классы (фрагмент): `video-js vjs-default-skin vjs-fluid`

### Стили

- Цвета: —; радиусы: border-radius: 8px; border-radius: 100px; font-size: —; CSS-vars: нет
- `:host`: есть
- Основная стилизация: **Tailwind utility-классы** в шаблоне и/или строковых константах TS (`button.ts`, `badge.ts` и т.п.).

### Функционал класса

- **Lifecycle:** ngOnDestroy, ngAfterViewInit
- **HostListeners:** —
- **Инъекции:** —
- **Методы (извлечённые):** ngAfterViewInit, loadVideoJsAssets, ngOnDestroy
- Подписки RxJS: нет
- Работа с формами (кроме CVA): нет
- Анимации Angular: нет

### Зависимости

- Angular: @angular/core
- Сторонние: —
- Локальные: —

### Доступность

- В шаблоне явных aria/role почти нет (или классы задают фокус через Tailwind focus:*)

---
