import './Title-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
/* eslint-enable import/no-unresolved */

// ШАБЛОН ОКНА С ПОДСКАЗКОЙ / TITLE
// *
export default function Title(text) {
  return setupBuilder('template-title')({
    '.title__text': {
      append: text,
    },
  });
}
