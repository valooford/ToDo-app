import React from 'react';
import ColorButton from '../ColorButton/ColorButton.titled';
import IconTile from '../IconTile/IconTile';
import SearchSection from '../SearchSection/SearchSection';

import Container from './Container';

const colorNames = {
  default: 'По умолчанию',
  red: 'Красный',
  orange: 'Оранжевый',
  yellow: 'Желтый',
  green: 'Зеленый',
  aquamarine: 'Сине-зеленый',
  blue: 'Синий',
  darkblue: 'Темно-синий',
  purple: 'Фиолетовый',
  pink: 'Розовый',
  brown: 'Коричневый',
  grey: 'Серый',
};

export default function SearchFilters({
  hasNotesWithReminders,
  hasLists,
  hasImages,
  labels,
  colors,
  onSelection,
}) {
  return (
    <Container
      groups={{
        sections: [
          // if note from some category exists
          (hasNotesWithReminders || hasLists || hasImages) && {
            id: 'types',
            node: (
              <SearchSection name="Типы">
                {hasNotesWithReminders && (
                  <IconTile
                    text="Напоминания"
                    iconSymbol="&#xf0f3;"
                    accented
                    onClick={() => {
                      onSelection('reminder');
                    }}
                  />
                )}
                {hasLists && (
                  <IconTile
                    text="Списки"
                    iconSymbol="&#xe81b;"
                    accented
                    onClick={() => {
                      onSelection('list');
                    }}
                  />
                )}
                {hasImages && (
                  <IconTile
                    text="Изображения"
                    iconSymbol="&#xe802;"
                    accented
                    onClick={() => {
                      onSelection('image');
                    }}
                  />
                )}
              </SearchSection>
            ),
          },
          labels.length && {
            id: 'tags',
            node: (
              <SearchSection name="Ярлыки">
                {labels.map((label) => (
                  <IconTile
                    text={label}
                    iconSymbol="&#xe81d;"
                    onClick={() => {
                      onSelection('tags', label);
                    }}
                    key={label}
                  />
                ))}
              </SearchSection>
            ),
          },
          colors.length > 1 && {
            id: 'colors',
            node: (
              <SearchSection name="Цвета">
                {colors.map((color) => (
                  <ColorButton
                    color={color}
                    titleText={colorNames[color]}
                    onClick={() => {
                      onSelection('color', color);
                    }}
                    key={color}
                  />
                ))}
              </SearchSection>
            ),
          },
        ],
      }}
    />
  );
}
