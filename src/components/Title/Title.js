import './Title-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
/* eslint-enable import/no-unresolved */

// ШАБЛОН ОКНА С ПОДСКАЗКОЙ / TITLE
// *
export default function setupTitle(text) {
  return setupBuilder('template-title')({
    insert: {
      '.title__text': text,
    },
  });
}