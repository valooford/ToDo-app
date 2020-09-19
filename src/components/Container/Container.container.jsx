import React from 'react';
import { connect } from 'react-redux';
/* eslint-disable import/no-unresolved */
import AddNote from '@components/Note/AddNote.container';
import Note from '@components/Note/Note.container';
/* eslint-enable import/no-unresolved */
import Container from './Container';

// КОНТЕЙНЕРНЫЙ КОМПОНЕНТ ДЛЯ CONTAINER
// *
function ContainerContainer({ pinnedNotes, notesOrder }) {
  // ELEMENT GROUPS GATHERING
  // *
  const elementGroups = notesOrder.reduce(
    (groups, id) => {
      /* eslint-disable no-param-reassign */
      if (id === notesOrder[0]) {
        // first note is used for adding
        const addNoteRef = React.createRef();
        groups.addition.push({ id, node: <AddNote addNoteRef={addNoteRef} /> });
        groups.neighbourRef = addNoteRef;
        return groups;
      }
      const noteRef = React.createRef();
      const noteElem = {
        id,
        node: (
          <Note id={id} neighbourRef={groups.neighbourRef} noteRef={noteRef} />
        ),
      };
      groups.neighbourRef = noteRef;
      if (pinnedNotes[id]) {
        groups.pinned.push(noteElem);
      } else {
        groups.unpinned.push(noteElem);
      }
      return groups;
      /* eslint-enable no-param-reassign */
    },
    { addition: [], pinned: [], unpinned: [], neighbourRef: null }
  );
  elementGroups.addition.key = 'addition'; // adding key for correct rerender
  return (
    <Container
      groups={[
        elementGroups.addition,
        { name: 'Закрепленные', elements: elementGroups.pinned, key: 'pinned' },
        {
          name: elementGroups.pinned.length ? 'Другие заметки' : null,
          elements: elementGroups.unpinned,
          key: 'unpinned',
        },
      ]}
    />
  );
}

function mapStateToProps(state) {
  return {
    pinnedNotes: state.main.pinnedNotes,
    notesOrder: state.main.notesOrder,
  };
}

export default connect(mapStateToProps, null)(ContainerContainer);
