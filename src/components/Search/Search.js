import './Search-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
import setupIconButton from '@components/IconButton/IconButton';
/* eslint-enable import/no-unresolved */

// ШАБЛОН ПОЛЯ ДЛЯ ПОИСКА / SEARCH
// *
export default function setupSearch() {
  return setupBuilder('template-search')({
    insert: {
      '.search__icon': {
        setup: setupIconButton,
        set: [[{ iconSymbol: '&#xe814;', titleText: 'Поиск' }]],
      },
      '.search__clean': {
        setup: setupIconButton,
        set: [
          [{ iconSymbol: '&#xe80c;', titleText: 'Удалить поисковый запрос' }],
        ],
      },
    },
  });
}
