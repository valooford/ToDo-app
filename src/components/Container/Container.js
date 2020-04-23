import './Container-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
import setupAddNote from '@components/AddNote/AddNote';
import setupNote from '@components/Note/Note';
/* eslint-enable import/no-unresolved */

// ШАБЛОН КОНТЕЙНЕРА / CONTAINER
// *
export default function setupContainer() {
  return setupBuilder('template-container')({
    insert: {
      '.container__item:first-of-type': {
        setup: setupAddNote,
        set: [
          [
            () => {
              alert('hey');
            },
          ],
        ],
      },
      '.container__item:nth-of-type(2)': {
        setup: setupNote,
      },
      '.container__item:last-of-type': {
        setup: setupNote,
        set: [[{ type: 'list' }]],
      },
    },
  });
}
