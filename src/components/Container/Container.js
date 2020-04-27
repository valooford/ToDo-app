import './Container-cfg.scss';
/* eslint-disable import/no-unresolved */
import setupBuilder from '@components/templates';
import setupAddNote from '@components/AddNote/AddNote';
import setupNote from '@components/Note/Note';
/* eslint-enable import/no-unresolved */

// ШАБЛОН КОНТЕЙНЕРА / CONTAINER
// *
export default function setupContainer(state) {
  const notes = state.notes.map((note) => ({
    setup: setupNote,
    set: [[{ type: note.type, header: note.header }]],
  }));
  return setupBuilder('template-container')({
    clone: {
      '.container__item': notes.length,
    },
    insert: {
      '.container__item': [
        state.isAddPostFocused ? { setup: setupNote } : { setup: setupAddNote },
        ...notes,
      ],
    },
  });
}
