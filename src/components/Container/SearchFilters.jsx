import React from 'react';
import { connect } from 'react-redux';
import ColorButton from '../ColorButton/ColorButton.titled';
import IconTile from '../IconTile/IconTile';
import SearchSection from '../SearchSection/SearchSection';

import Container from './Container';

function SearchFilters({ onSelection }) {
  return (
    <Container
      groups={{
        sections: [
          {
            id: 'types', // if note from some category exists
            node: (
              <SearchSection name="Типы">
                <IconTile
                  text="Напоминания"
                  iconSymbol="&#xf0f3;"
                  accented
                  onClick={() => {
                    onSelection('reminder');
                  }}
                />
                <IconTile
                  text="Списки"
                  iconSymbol="&#xe81b;"
                  accented
                  onClick={() => {
                    onSelection('list');
                  }}
                />
                <IconTile
                  text="Изображения"
                  iconSymbol="&#xe802;"
                  accented
                  onClick={() => {
                    onSelection('image');
                  }}
                />
              </SearchSection>
            ),
          },
          {
            id: 'tags', // if at least 1 tagged note exists
            node: (
              <SearchSection name="Ярлыки">
                <IconTile
                  text="tag1"
                  iconSymbol="&#xe81d;"
                  onClick={() => {
                    onSelection('tags', 'tag1');
                  }}
                />
                <IconTile
                  text="tag2"
                  iconSymbol="&#xe81d;"
                  onClick={() => {
                    onSelection('tags', 'tag2');
                  }}
                />
              </SearchSection>
            ),
          },
          {
            id: 'colors', // if 2 or more colors are presented
            node: (
              <SearchSection name="Цвета">
                {/* ...цвета */}
                <ColorButton
                  titleText="По умолчанию"
                  onClick={() => {
                    onSelection('color', 'default');
                  }}
                />
                <ColorButton
                  color="red"
                  titleText="Красный"
                  onClick={() => {
                    onSelection('color', 'red');
                  }}
                />
                <ColorButton
                  color="green"
                  titleText="Зеленый"
                  onClick={() => {
                    onSelection('color', 'green');
                  }}
                />
              </SearchSection>
            ),
          },
        ],
      }}
    />
  );
}

// function mapStateToProps(state) {
//   return {};
// }

export default connect(null, null)(SearchFilters);
