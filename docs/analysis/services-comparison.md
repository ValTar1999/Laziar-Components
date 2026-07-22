# Сравнение не-компонентов (сервисы, модели, утилиты)

## Сервисы

| Элемент | publikator | agora-frontend | Вывод |
|---------|------------|----------------|-------|
| ToastService | `toastNotification/toast.service.ts` | нет в base | Переносить в shared вместе с toast UI; в agora подключать при миграции уведомлений |
| Прочие сервисы в base | нет | нет | Card в agora тянет внешние сервисы (вне base) — при переносе Card не тащить app-сервисы в shared ядро |

## Пайпы / директивы / гварды / интерсепторы

В `base` **обоих** проектов отсутствуют. Дублирования на уровне base нет.

## Модели / константы / токены стилей

| Файл-паттерн | publikator | agora | Различия | Объединение |
|--------------|------------|-------|----------|-------------|
| `button/button.ts` | Variants, sizes, classes, Colors | то же | ключи disabled*, gap vs space-x, padding sm/xl, disabled gray color | Единый tokens-файл + changelog deprecated keys |
| `badge/badge.ts` | Colors/Sizes/types | есть | **общий typo** `'magrnta'`; иначе близко | Merge + rename → `magenta` (alias deprecated) |
| `alert/alert.ts` | Variants/Colors/AlertStylesMap | есть | совпадают по сути | Merge |
| `avatar/avatar.ts` | sizes/colors + **`buildAvatarInitials`** | sizes/colors | util инициалов только в publikator | Взять util из publikator |
| `input/input.ts` | Colors и пр. | есть | appearance/pill только в компоненте agora | Tokens общие; appearance в component API |
| `icons/icon.ts` | TIconName/Variant/Direction | есть | набор имён иконок может отличаться | Объединить union TIconName = pub ∪ agora |

## Утилиты

- publikator: `buildAvatarInitials()` в `avatar/avatar.ts` (+ unit tests `avatar.util.spec.ts`)
- agora: отдельного util-файла в base нет (инициалы считаются внутри `AvatarComponent`)
- Select interfaces (`SelectOption` / `SelectOptionType`) экспортируются из компонента publikator — вынести в shared types при merge

## Что можно объединить в первую очередь

1. `button.ts` / `badge.ts` / `alert.ts` / `avatar.ts` / `input.ts` / `icon.ts` — design tokens + types
2. Общие presentational компоненты без app-домена (button, badge, checkbox, switch, loading, tooltip*)
3. Form controls с CVA (input, textarea, select) — после унификации SelectOption
4. Toast stack (только publikator) — как новый shared module
5. Table / MessageChat — domain-leaning; после ядра
