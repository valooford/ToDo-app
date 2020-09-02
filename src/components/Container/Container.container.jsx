import React from 'react';
import { connect } from 'react-redux';
/* eslint-disable import/no-unresolved */
import AddNote from '@components/Note/AddNote.container';
import Note from '@components/Note/Note.container';
/* eslint-enable import/no-unresolved */
import Container from './Container';

// КОНТЕЙНЕРНЫЙ КОМПОНЕНТ ДЛЯ CONTAINER
// *
function ContainerContainer({ notesDisplayInfo, notesOrder }) {
  // FOCUS HANDLING (not finished yet)
  // *
  // // info for saving note focus info to set focus inside modal
  // const [containerFocusInfo, setContainerFocusInfo] = useState({});
  // // id of the last  container item being focused
  // const [lastItemBeingFocusedId, setLastItemBeingFocused] = useState(null);
  // const lastItemBeingFocusedRef = useRef(null);
  // const onModalClose = () => {
  //   // clearing focus info
  //   setContainerFocusInfo((prevFocusInfo) => ({
  //     ...prevFocusInfo, // saving noteId
  //     noteFocusInfo: {},
  //   }));
  //   lastItemBeingFocusedRef.current.focus();
  // };

  // ELEMENT GROUPS GATHERING
  // *
  const elementGroups = notesOrder.reduce(
    (groups, id) => {
      if (id === notesOrder[0]) {
        // first note is used for adding
        groups.addition.push({ id, node: <AddNote /> });
        return groups;
      }
      const noteElem = {
        id,
        node: <Note id={id} />,
      };
      if (notesDisplayInfo[id].isPinned) {
        groups.pinned.push(noteElem);
      } else {
        groups.unpinned.push(noteElem);
      }
      return groups;
    },
    { addition: [], pinned: [], unpinned: [] }
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
    notesDisplayInfo: state.main.notesDisplayInformation,
    notesOrder: state.main.notesOrder,
  };
}

export default connect(mapStateToProps, null)(ContainerContainer);
