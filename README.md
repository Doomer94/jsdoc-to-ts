# jsdoc-to-ts

`jsdoc-to-ts` — это утилита для автоматического преобразования JSDoc комментариев в аннотации типов TypeScript. Она подходит для проектов на JavaScript и TypeScript, в которых используется JSDoc, позволяя быстро добавить строгую типизацию на основе уже существующей документации.

## Как работает

`jsdoc-to-ts` анализирует файлы `.js`, `.ts`, и `.mjs` и находит комментарии JSDoc для функций. На основе информации о типах параметров и возвращаемом значении в JSDoc утилита добавляет аннотации типов TypeScript в сигнатуры функций. Обработанные файлы сохраняются в новой директории, не затрагивая исходные файлы проекта.

## Установка и использование

### Установка

1. Склонируйте репозиторий:
   ```bash
   git clone https://github.com/Doomer94/jsdoc-to-ts.git
   jsdoc-to-ts.git
   cd jsdoc-to-ts
   ```
   
2. Установите зависимости (если требуется):
   ```bash
   npm install
   ```

### Использование

1. Запустите скрипт командой:
   ```bash
   node index.js
   ```
2. Утилита создаст новую папку `jsdoc-to-ts-project` в корневой директории. В этой папке будут находиться обработанные файлы с добавленными TypeScript аннотациями.

### Примечания

* Утилита по умолчанию исключает из обработки следующие папки: `node_modules`, `test`, `.devcontainer`, и `.gitlab`. Вы можете изменить список исключений, отредактировав константу `EXCLUDED_FOLDERS` в исходном коде.

## Пример

Исходный код:

```javascript
**
 * Возвращает сумму двух чисел.
 * @param {number} a - Первое число.
 * @param {number} b - Второе число.
 * @returns {number} Сумма a и b.
 */
function add(a, b) {
  return a + b;
}
```

После обработки:

```typescript
**
 * Возвращает сумму двух чисел.
 * @param {number} a - Первое число.
 * @param {number} b - Второе число.
 * @returns {number} Сумма a и b.
 */
function add(a: number, b: number): number {
  return a + b;
}
```