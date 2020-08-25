import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
/* eslint-disable import/no-unresolved */
import AddNote from '@components/AddNote/AddNote.container';
import Note from '@components/Note/Note.container';

import { focusNote, blurNote } from '@store/mainReducer';
import { readyModal } from '@store/modalReducer';
/* eslint-enable import/no-unresolved */
import Container from './Container';

// КОНТЕЙНЕРНЫЙ КОМПОНЕНТ ДЛЯ CONTAINER
// *
function ContainerContainer({
  notesDisplayInformation,
  notesOrder,
  selectedNotes,
  modalRef,
  onModalReady,
  onNoteFocus,
  onNoteBlur,
}) {
  const [containerFocusInfo, setContainerFocusInfo] = useState({});
  // index of a currently focused container item
  const [focusedItemId, setFocusedItemId] = useState(null);
  // id of a container item that is needed to be focused
  const [itemToFocusId, setItemToFocusId] = useState(null);
  // checking modal for being closed
  const [haveModalBeenClosed, setHaveModalBeenClosed] = useState(false);
  useEffect(() => {
    if (haveModalBeenClosed) {
      setContainerFocusInfo((prevFocusInfo) => ({
        ...prevFocusInfo,
        noteFocusInfo: {},
      }));
      setItemToFocusId(containerFocusInfo.noteId);
      setHaveModalBeenClosed(false);
    } else {
      setItemToFocusId(null);
    }
  }, [haveModalBeenClosed]);

  const addingNote = notesDisplayInformation[notesOrder[0]];
  const add = {
    key: 'add',
    color: addingNote.isFocused && addingNote.color,
    node: addingNote.isFocused ? (
      <Note
        id={notesOrder[0]}
        // focusInfo={{
        //   fieldName: addingNote.type === 'list' ? 'add-list-item' : 'textfield',
        // }}
      />
    ) : (
      <AddNote />
    ),
    isItemFocused: true, // always focused
  };
  let focusedNoteId;
  // заметка с индексом 0 используется для добавления
  // контейнеру может передаваться только индекс в пределах [1,...)
  // в модальном окне могут редактироваться только уже добавленные заметки
  const noteElements = notesOrder.slice(1).map((id) => {
    const note = notesDisplayInformation[id];
    if (note.isFocused) {
      focusedNoteId = id;
    }
    return {
      // assume that creationDate is unique for every note
      key: id,
      color: note.color,
      isFiller: focusedNoteId === id,
      node: (
        <Note
          id={id}
          isFiller={focusedNoteId === id}
          onFocusInfoChange={(noteFocusInfo) => {
            setContainerFocusInfo({
              noteId: id,
              noteFocusInfo,
            });
          }}
          isSelected={!focusedNoteId && id === focusedItemId}
        />
      ),
      isFocusable: true,
      isItemFocusNeeded: id === itemToFocusId,
      isSelected: selectedNotes.includes(id),
      onItemFocus: (e) => {
        // triggers for an unknown reason when something get focus inside
        // seems like bubbling
        if (e.target !== e.currentTarget) return;
        setFocusedItemId(id);
      },
      onItemBlur: (e) => {
        // triggers for an unknown reason when something lose focus inside
        // seems like bubbling
        if (e.target !== e.currentTarget) return;
        setFocusedItemId(null);
      },
      onItemKeyDown:
        id === focusedItemId
          ? (e) => {
              // Enter
              if (e.keyCode === 13) {
                onNoteFocus(id);
              }
            }
          : null,
    };
  });
  const pinnedNotes = noteElements.filter(
    (v, i) => notesDisplayInformation[notesOrder[i + 1]].isPinned
  );
  const unpinnedNotes = noteElements.filter(
    (v, i) => !notesDisplayInformation[notesOrder[i + 1]].isPinned
  );
  return (
    <Container
      elementGroups={[
        [add],
        { name: 'Закрепленные', elements: pinnedNotes },
        {
          name: pinnedNotes.length ? 'Другие заметки' : null,
          elements: unpinnedNotes,
        },
      ]}
      portal={[
        {
          node: focusedNoteId && (
            <Note
              id={focusedNoteId}
              onClose={() => {
                setHaveModalBeenClosed(true);
              }}
              // focusInfo={
              //   // fallback to default focusInfo if field wasn't specified
              //   {
              //     fieldName:
              //       notes[focusedNoteId].type === 'list'
              //         ? 'add-list-item'
              //         : 'textfield',
              //     ...containerFocusInfo.noteFocusInfo,
              //   }
              // }
            />
          ),
          color: focusedNoteId && notesDisplayInformation[focusedNoteId].color,
        },
        () => {
          onModalReady(() => {
            onNoteBlur(focusedNoteId);
            setHaveModalBeenClosed(true);
          });
        },
        modalRef.current,
      ]}
    />
  );
}

function mapStateToProps(state) {
  return {
    notesDisplayInformation: state.main.notesDisplayInformation,
    notesOrder: state.main.notesOrder,
    selectedNotes: state.main.selectedNotes,
  };
}

export default connect(mapStateToProps, {
  onNoteFocus: focusNote,
  onNoteBlur: blurNote,
  onModalReady: readyModal,
})(ContainerContainer);
