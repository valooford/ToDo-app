import React from 'react';
import { connect } from 'react-redux';
/* eslint-disable import/no-unresolved */
import AddNote from '@components/AddNote/AddNote.container';
import Note from '@components/Note/Note.container';

import { focusNote } from '@store/mainReducer';
/* eslint-enable import/no-unresolved */
import Container from './Container';

// КОНТЕЙНЕРНЫЙ КОМПОНЕНТ ДЛЯ CONTAINER
// *
function ContainerContainer({
  notesDisplayInfo,
  notesOrder,
  selectedNotes,
  focusedNoteId,
  onNoteFocus, // pressing Enter on focused container item
}) {
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
  const addElem = {};
  {
    const addNoteId = notesOrder[0];
    const { color } = notesDisplayInfo[addNoteId];
    const isFocused = addNoteId === focusedNoteId;
    addElem.id = isFocused ? addNoteId : 'add';
    addElem.color = isFocused && color;
    addElem.node = isFocused ? <Note id={addNoteId} /> : <AddNote />;
    // ? Note focusInfo={{
    //   fieldName: addingNote.type === 'list' ? 'add-list-item' : 'textfield',
    // }}
    addElem.hasFocusStyling = true; // always styled as focused
  }

  // заметка с индексом 0 используется для добавления
  // контейнеру может передаваться только индекс в пределах [1,...)
  // в модальном окне могут редактироваться только уже добавленные заметки
  const elementGroups = notesOrder.slice(1).reduce(
    (groups, id) => {
      const { isPinned, color } = notesDisplayInfo[id];
      // eslint-disable-next-line no-param-reassign
      const isFocused = id === focusedNoteId;
      const noteElem = {
        id,
        color,
        isFiller: isFocused,
        node: (
          <Note
            id={id}
            isFiller={isFocused}
            // onFocusInfoChange={(noteFocusInfo) => {
            //   setContainerFocusInfo({
            //     noteId: id,
            //     noteFocusInfo,
            //   });
            // }}
            // ? isSelected={!focusedNoteId && id === focusedItemId}
          />
        ),
        isFocusable: true,
        isSelected: selectedNotes[id],
        // onFocus: (e) => {
        //   // triggers for an unknown reason when something get focus inside
        //   // seems like it's bubbling
        //   if (e.target !== e.currentTarget) return;
        //   setLastItemBeingFocused(id);
        // },
        onKeyDown: (e) => {
          // Enter
          if (e.keyCode === 13) {
            onNoteFocus(id);
          }
        },
      };
      if (isPinned) {
        groups.pinned.push(noteElem);
      } else {
        groups.unpinned.push(noteElem);
      }
      return groups;
    },
    { pinned: [], unpinned: [] }
  );
  return (
    <Container
      elementGroups={[
        [addElem],
        { name: 'Закрепленные', elements: elementGroups.pinned },
        {
          name: elementGroups.pinned.length ? 'Другие заметки' : null,
          elements: elementGroups.unpinned,
        },
      ]}
      // itemToFocus={[lastItemBeingFocusedId, lastItemBeingFocusedRef]}
    />
  );
}

function mapStateToProps(state) {
  return {
    notesDisplayInfo: state.main.notesDisplayInformation,
    notesOrder: state.main.notesOrder,
    selectedNotes: state.main.selectedNotes,
    focusedNoteId: state.main.focusedNoteId,
  };
}

export default connect(mapStateToProps, {
  onNoteFocus: focusNote,
})(ContainerContainer);
