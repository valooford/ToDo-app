import React from 'react';
import { connect } from 'react-redux';
import ColorButton from '../ColorButton/ColorButton.titled';
import IconTile from '../IconTile/IconTile';
import SearchSection from '../SearchSection/SearchSection';

import Container from './Container';

function SearchFilters() {
  return (
    <Container
      groups={{
        sections: [
          {
            id: 'types', // if note from some category exists
            node: (
              <SearchSection name="Типы">
                <IconTile text="Напоминания" iconSymbol="&#xf0f3;" accented />
                <IconTile text="Списки" iconSymbol="&#xe81b;" accented />
                <IconTile text="Изображения" iconSymbol="&#xe802;" accented />
              </SearchSection>
            ),
          },
          {
            id: 'tags', // if at least 1 tagged note exists
            node: (
              <SearchSection name="Ярлыки">
                <IconTile text="tag1" iconSymbol="&#xe81d;" />
                <IconTile text="tag2" iconSymbol="&#xe81d;" />
              </SearchSection>
            ),
          },
          {
            id: 'colors', // if 2 or more colors are presented
            node: (
              <SearchSection name="Цвета">
                {/* ...цвета */}
                <ColorButton titleText="По умолчанию" />
                <ColorButton color="red" titleText="Красный" />
                <ColorButton color="green" titleText="Зеленый" />
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
