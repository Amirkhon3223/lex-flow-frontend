# Code Style Guide

## JavaScript/TypeScript Best Practices

### ✅ Проверка длины массивов

**Правило**: Используйте неявное преобразование для проверки длины массивов.

```typescript
// ❌ Избыточно
if (array.length === 0) { }
if (array.length > 0) { }

// ✅ Идиоматично
if (!array.length) { }  // массив пустой
if (array.length) { }   // массив не пустой
```

**Почему это лучше:**
- Короче и читабельнее
- Стандартная практика в JavaScript/TypeScript
- В 0 это falsy, любое число > 0 это truthy

**Исключения:**
```typescript
// ✅ Оставляем явное сравнение когда важна семантика
if (items.length >= 5) { }  // "минимум 5 элементов"
if (count > 0) { }          // "больше нуля" (не длина массива)
```

### ✅ Проверка строк

```typescript
// ❌ Избыточно
if (str.length === 0) { }
if (str.trim().length === 0) { }

// ✅ Идиоматично
if (!str.length) { }
if (!str.trim()) { }
```

### ✅ Проверка существования

```typescript
// ❌ Избыточно
if (value !== null && value !== undefined) { }
if (value === null || value === undefined) { }

// ✅ Идиоматично
if (value != null) { }  // != (не !==) проверяет и null и undefined
if (value == null) { }
```

### ✅ Boolean проверки

```typescript
// ❌ Избыточно
if (isActive === true) { }
if (isActive === false) { }

// ✅ Идиоматично
if (isActive) { }
if (!isActive) { }
```

### ✅ Опциональная цепочка

```typescript
// ❌ Многословно
if (user && user.profile && user.profile.name) { }

// ✅ Современно
if (user?.profile?.name) { }
```

### ✅ Nullish coalescing

```typescript
// ❌ Неправильно (0 и "" это falsy!)
const value = input || 'default';

// ✅ Правильно (только null/undefined)
const value = input ?? 'default';
```

## React Best Practices

### ✅ Условный рендеринг

**⚠️ ВАЖНО! React рендерит 0 как текст:**

```typescript
// ❌ ОПАСНО! Покажет "0" когда массив пустой
{items.length && <List items={items} />}

// ✅ Правильно - двойное отрицание
{!!items.length && <List items={items} />}

// ✅ Правильно - явное сравнение
{items.length > 0 && <List items={items} />}

// ✅ Правильно - тернарный оператор
{items.length ? <List items={items} /> : null}
```

**Правило для JSX:**
- В условиях (`if`/`while`) используйте `array.length` ✅
- В JSX используйте `!!array.length` или `array.length > 0` ✅

### ✅ Optional props

```typescript
// ❌ Многословно
interface Props {
  items: Item[] | undefined;
}

// ✅ Идиоматично
interface Props {
  items?: Item[];
}
```

## Общие правила

1. **Короткая запись для length** - используйте `!array.length` и `array.length`
2. **Явное сравнение для чисел** - используйте `count > 0` когда это не длина массива
3. **Опциональная цепочка** - используйте `?.` вместо множественных `&&`
4. **Nullish coalescing** - используйте `??` вместо `||` для значений по умолчанию
5. **Boolean проверки** - не сравнивайте с `true`/`false` явно

---

_Этот гайд основан на современных best practices JavaScript/TypeScript и React сообщества._
