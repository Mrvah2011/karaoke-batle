# Благотворительный Караоке Батл — Казань, 21 мая 2026

Лендинг благотворительного караоке-баттла в Казани. Сбор средств для фонда
«Солнечный город» — чтобы детских домов в России не существовало.

## Стек

- **React 18** (single-file component)
- **Tailwind CSS** (через Play CDN в `index.html`; в прод-сборке — установите как зависимость)
- **Playfair Display** + **Manrope** (Google Fonts)

## Структура

```
.
├── index.html                  # Standalone preview (React + Tailwind + Babel из CDN)
├── KaraokeBattleLanding.jsx    # Производственный React-компонент
├── Лендинг.txt                 # Копирайт и структура (бриф)
├── Подобные организаторы и боли.txt
├── Описание благотворительность.txt
└── README.md
```

## Быстрый просмотр

Откройте `index.html` двойным кликом — страница отрендерится в браузере без
сборки (используются React/Tailwind/Babel с CDN).

## Интеграция в React-проект

```jsx
import KaraokeBattleLanding from "./KaraokeBattleLanding";

export default function App() {
  return <KaraokeBattleLanding />;
}
```

В `index.html` / `_app` добавьте подключение шрифтов:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet" />
```

## Секции

1. **Hero** — боль → решение, CTA «Участвовать», счётчик мест, прогресс к цели.
2. **Trust strip** — 204 000 ₽ / 510 ч. / 0% (анимированный счётчик).
3. **Services (Тарифы)** — Зритель · Участник · Меценат (боль → результат).
4. **Team** — 3 профиля (организатор, куратор фонда, звукорежиссёр).
5. **Testimonials** — 3 отзыва после первого батла.
6. **FAQ** — закрытие возражений (фуршет, страх сцены, отчётность, парковка).
7. **Booking** — форма брони с переключателем тарифа и валидацией.

## Дизайн-язык

- База: `#0A0A0B`, элевации `#141416`
- Акцент: градиент `#E11D48 → #FF3B5C → #9C1B3B`
- Золото (nod to Zoloto): `#F4D47A → #A37D1B`
- Серифный заголовок + санс-сериф тело

## Организатор

Елизавета Пронских. Партнёр: фонд «Солнечный город».
Площадка: Ресторан **Zoloto**, ТЦ Coliseum, ул. Пушкина 29а (Казань).
