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
        set: [['&#xe814;', 'Поиск']],
      },
      '.search__clean': {
        setup: setupIconButton,
        set: [['&#xe80c;', 'Удалить поисковый запрос']],
      },
    },
  });
}
