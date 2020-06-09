import './Search-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
import IconButton from '@components/IconButton/IconButton';
/* eslint-enable import/no-unresolved */

// ШАБЛОН ПОЛЯ ДЛЯ ПОИСКА / SEARCH
// *
export default function Search({
  searchIconParams = { iconSymbol: '&#xe814;', titleText: 'Поиск' },
  cleanIconParams = {
    iconSymbol: '&#xe80c;',
    titleText: 'Удалить поисковый запрос',
  },
} = {}) {
  return setupBuilder('template-search')({
    '.search__icon': {
      append: IconButton(searchIconParams),
    },
    '.search__clean': {
      append: IconButton(cleanIconParams),
    },
  });
}
